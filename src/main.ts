import { Plugin, MarkdownPostProcessorContext, Notice } from "obsidian";
import type { DashboardConfig } from "./types";
import { DEFAULT_CONFIG } from "./constants";
import { TaskDashboardSettingTab } from "./settings";
import { TaskQueryEngine } from "./query";
import { TaskDashboardRenderer } from "./renderer";

export default class TaskDashboardPlugin extends Plugin {
  settings!: DashboardConfig;
  queryEngine!: TaskQueryEngine;
  dashboardElements: Map<HTMLElement, DashboardConfig> = new Map();

  async onload(): Promise<void> {
    // 加载设置
    this.settings = Object.assign({}, DEFAULT_CONFIG, await this.loadData());

    // 初始化查询引擎
    this.queryEngine = new TaskQueryEngine(this.app);

    // 注册设置面板
    this.addSettingTab(new TaskDashboardSettingTab(this.app, this));

    // 注册代码块处理器（新名称 + 向后兼容旧名称）
    this.registerMarkdownCodeBlockProcessor(
      "task-dashboard",
      this.createCodeBlockHandler()
    );
    this.registerMarkdownCodeBlockProcessor(
      "task-dashborad",
      this.createCodeBlockHandler()
    );

    // 注册命令：插入看板
    this.addCommand({
      id: "insert-task-dashboard",
      name: "Minimalist Task Board: 插入看板",
      editorCallback: (editor) => {
        const defaultConfig = JSON.stringify(this.settings, null, 2)
          // 嵌套缩进 columns 数组
          .replace(/(\s*)"columns": \[/, '$1"columns": [')
          .replace(/(\s*)\{ "header":/, '$1  { "header":');

        const codeBlock = "```task-dashboard\n" + defaultConfig + "\n```\n";
        editor.replaceSelection(codeBlock);
        new Notice("看板已插入");
      },
    });

    const refresh = () => this.refreshDashboards();

    // Vault events: fire on actual file I/O — essential for real-time updates
    this.registerEvent(this.app.vault.on("modify", (file) => {
      this.queryEngine.markDirty(file.path);
      refresh();
    }));
    this.registerEvent(this.app.vault.on("create", () => {
      this.queryEngine.setAllDirty();
      refresh();
    }));
    this.registerEvent(this.app.vault.on("delete", (file) => {
      this.queryEngine.invalidateFile(file.path);
      refresh();
    }));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      this.queryEngine.invalidateFile(oldPath);
      this.queryEngine.markDirty(file.path);
      refresh();
    }));

    // MetadataCache events: fallback for metadata-only changes
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.queryEngine.markDirty(file.path);
        refresh();
      })
    );

    this.registerEvent(
      this.app.metadataCache.on("resolved", () => {
        this.queryEngine.setAllDirty();
        refresh();
      })
    );
  }

  async onunload(): Promise<void> {
    // 清理动态样式
    const styleEl = document.getElementById("task-dashboard-dynamic-style");
    if (styleEl) styleEl.remove();
    this.dashboardElements.clear();
  }

  /**
   * 创建代码块处理器
   */
  private createCodeBlockHandler() {
    return async (
      source: string,
      el: HTMLElement,
      _ctx: MarkdownPostProcessorContext,
    ) => {
      // 解析代码块中的 JSON 配置
      let codeConfig: Partial<DashboardConfig> = {};
      try {
        codeConfig = JSON.parse(source.trim() || "{}");
      } catch {
        el.createDiv({ cls: "task-dashboard-error", text: "配置 JSON 解析错误" });
        return;
      }

      // 合并配置：代码块覆盖全局默认
      const mergedConfig: DashboardConfig = deepMerge(
        deepMerge({} as DashboardConfig, this.settings),
        codeConfig,
      );

      // 重建缓存（如果配置变更导致需要重新扫描）
      if (this.queryEngine.isDirty()) {
        el.createDiv({ text: "加载中..." });
        await this.queryEngine.rebuildCache(mergedConfig);
        el.empty();
      }

      // 获取排序后任务
      const tasks = this.queryEngine.getTasksSync(mergedConfig);

      // 渲染并注册到活跃面板列表
      const renderer = new TaskDashboardRenderer();
      renderer.render(el, mergedConfig, tasks);
      this.dashboardElements.set(el, mergedConfig);
    };
  }

  /**
   * 直接刷新所有活跃的 dashboard 面板，无需通过 MarkdownPostProcessor 重解析。
   */
  async refreshDashboards(): Promise<void> {
    const seen = new Set<string>();
    for (const [el, config] of this.dashboardElements) {
      if (!el.isConnected) {
        this.dashboardElements.delete(el);
        continue;
      }
      const key = JSON.stringify(config);
      if (this.queryEngine.isDirty() && !seen.has(key)) {
        await this.queryEngine.rebuildCache(config);
        seen.add(key);
      }
      const tasks = this.queryEngine.getTasksSync(config);
      const renderer = new TaskDashboardRenderer();
      renderer.render(el, config, tasks);
    }
  }
}

/**
 * 深度合并对象（用于配置合并）
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sv = source[key];
    if (sv !== undefined && sv !== null) {
      if (typeof sv === "object" && !Array.isArray(sv) && typeof result[key] === "object" && !Array.isArray(result[key])) {
        result[key] = deepMerge(result[key] as any, sv as any);
      } else if (Array.isArray(sv)) {
        result[key] = [...sv] as any;
      } else {
        result[key] = sv as any;
      }
    }
  }
  return result;
}
