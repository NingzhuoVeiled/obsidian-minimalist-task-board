import type { App, ListItemCache } from "obsidian";
import type { DashboardConfig, ParsedTask, SortableTask, TaskChild } from "./types";
import { parseTaskLine, buildSortableTasks, sortTasks } from "./parser";
import { PRIORITY_REGEX } from "./constants";

/**
 * Task query engine based on MetadataCache.
 * Caches parsed tasks by file path with dirty-file tracking.
 */
export class TaskQueryEngine {
	private app: App;
	private taskCache: Map<string, ParsedTask[]> = new Map();
	private dirtyFiles: Set<string> = new Set();
	private lastConfigHash: string = "";
	private resultDirty: boolean = true;

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * Mark a file for re-scan (called when file content changes).
	 */
	markDirty(filePath: string): void {
		this.dirtyFiles.add(filePath);
		this.resultDirty = true;
	}

	/**
	 * Invalidate all caches (called on config change, e.g. searchPath).
	 */
	invalidateAll(): void {
		this.dirtyFiles.clear();
		this.taskCache.clear();
		this.resultDirty = true;
	}

	/**
	 * Mark results dirty without clearing cache entries.
	 * Used when metadata is re-resolved but file contents haven't changed.
	 */
	setAllDirty(): void {
		this.resultDirty = true;
	}

	/**
	 * Return whether the cache needs a rebuild.
	 */
	isDirty(): boolean {
		return this.resultDirty || this.dirtyFiles.size > 0;
	}

	/**
	 * Synchronously return sorted tasks from the in-memory cache.
	 * Call rebuildCache() first to ensure the cache is fresh.
	 */
	getTasksSync(config: DashboardConfig): SortableTask[] {
		const configHash = JSON.stringify(config);
		if (configHash !== this.lastConfigHash) {
			this.resultDirty = true;
			this.lastConfigHash = configHash;
		}

		const allParsed: ParsedTask[] = [];
		for (const tasks of this.taskCache.values()) {
			allParsed.push(...tasks);
		}

		const sortable = buildSortableTasks(allParsed, config);
		return sortTasks(sortable);
	}

	/**
	 * Rebuild the hierarchy: assign children to each task based on parent references.
	 * Uses ListItemCache.parent which points to the parent item's line number.
	 */
	private rebuildChildren(
		items: ListItemCache[],
		completedByLine: Map<number, boolean>,
	): Map<number, TaskChild[]> {
		const childrenByLine = new Map<number, TaskChild[]>();

		for (const item of items) {
			if (item.parent < 0) continue; // root level item, no parent
			if (!childrenByLine.has(item.parent)) {
				childrenByLine.set(item.parent, []);
			}
			childrenByLine.get(item.parent)!.push({
				completed: completedByLine.get(item.position.start.line) ?? false,
			});
		}
		return childrenByLine;
	}

	/**
	 * Asynchronously rebuild the task cache.
	 * Reads file content via vault.read() to extract task line text,
	 * and uses MetadataCache for task status/priority/children metadata.
	 */
	async rebuildCache(config: DashboardConfig): Promise<void> {
		const { metadataCache, vault } = this.app;

		// Remove cache entries for deleted/renamed files
		for (const [path] of this.taskCache) {
			if (!vault.getAbstractFileByPath(path)) {
				this.taskCache.delete(path);
			}
		}

		const allFiles = vault.getMarkdownFiles();
		const filesToScan = config.searchPath
			? allFiles.filter((f) => f.path.startsWith(config.searchPath))
			: allFiles;

		// Clear caches for dirty files so they get re-scanned
		for (const dirty of this.dirtyFiles) {
			this.taskCache.delete(dirty);
		}
		this.dirtyFiles.clear();

		const now = new Date();
		const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
		const todayBase = new Date(todayStr + "T00:00:00").getTime();

		// Only scan files not already in the cache
		const newFiles = filesToScan.filter((f) => !this.taskCache.has(f.path));

		for (const file of newFiles) {
			const cache = metadataCache.getFileCache(file);
			if (!cache || !cache.listItems) {
				this.taskCache.set(file.path, []);
				continue;
			}

			// Read file content to extract task line text
			const content = await vault.read(file);
			const lines = content.split("\n");

			// Build a map of line -> completed status for all list items (for child reconstruction)
			const completedByLine = new Map<number, boolean>();
			for (const item of cache.listItems) {
				if (!item.task) continue;
				// Public API: item.task is a string like " " (incomplete) or "x" (completed)
				completedByLine.set(item.position.start.line, item.task !== " ");
			}

			// Rebuild children hierarchy
			const childrenByLine = this.rebuildChildren(cache.listItems, completedByLine);

			const tasks: ParsedTask[] = [];
			for (const item of cache.listItems) {
				if (!item.task) continue;

				const line = item.position.start.line;
				const rawLine = lines[line] || "";

				// Extract task text by stripping the markdown task prefix
				const taskText = rawLine.replace(/^\s*-\s*\[(.)\]\s*/, "");

				// Public API: item.task is a string.
				// " " = incomplete, any other character (typically "x") = completed.
				const completed = item.task !== " ";

				// Extract priority from raw line text using regex (public API approach)
				let priority: string | undefined;
				const priorityMatch = rawLine.match(PRIORITY_REGEX);
				if (priorityMatch) {
					priority = priorityMatch[1].toLowerCase();
				}

				// Children derived from ListItemCache hierarchy (parent field)
				const children = childrenByLine.get(line) || [];

				const parsed = parseTaskLine(
					taskText,
					priority,
					completed,
					children,
					file.path,
					todayBase,
				);
				tasks.push(parsed);
			}

			this.taskCache.set(file.path, tasks);
		}

		this.lastConfigHash = JSON.stringify(config);
		this.resultDirty = false;
	}
}
