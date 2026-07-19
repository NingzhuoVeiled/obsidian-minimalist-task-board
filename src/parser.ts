import type { ParsedTask, SortableTask, TaskChild, DashboardConfig } from "./types";
import {
  DUE_REGEX, META_REGEX, LINK_REGEX, CODE_REGEX, AREA_REGEX,
  PRIORITY_MAP, AREA_MAP,
} from "./constants";

/**
 * 从任务文本中提取元数据，返回 ParsedTask
 */
export function parseTaskLine(
  rawText: string,
  priority: string | undefined,
  completed: boolean,
  children: TaskChild[],
  filePath: string,
  todayMs: number,
): ParsedTask {
  // 提取 [due:: YYYY-MM-DD]
  const dueMatch = rawText.match(DUE_REGEX);
  const due = dueMatch ? dueMatch[1] : null;

  // 提取 [area::xxx]
  const areaMatch = rawText.match(AREA_REGEX);
  const area = areaMatch ? areaMatch[1].toLowerCase() : "none";

  // 计算到期日毫秒时间戳和剩余天数
  let dueMs: number | null = null;
  let diffDays: number | null = null;
  if (due) {
    dueMs = new Date(due + "T00:00:00").getTime();
    diffDays = Math.round((dueMs - todayMs) / 86400000);
  }

  // 去掉元数据标签，提取纯显示文本
  const metaIndex = rawText.search(META_REGEX);
  let displayText = metaIndex !== -1
    ? rawText.substring(0, metaIndex).trim()
    : rawText.trim();

  // 移除 Markdown 链接语法，保留链接文字
  displayText = displayText.replace(LINK_REGEX, "$1");

  // 内联代码用 <code> 标签包裹
  displayText = displayText.replace(CODE_REGEX, "<code>$1</code>");

  // 优先级标准化
  const p = priority ? priority.toLowerCase() : "none";
  const normalizedPriority: ParsedTask["priority"] = PRIORITY_MAP[p] !== undefined ? (p as ParsedTask["priority"]) : "none";

  // 子任务统计
  const totalChildren = children.length;
  let completedChildren = 0;
  for (let i = 0; i < totalChildren; i++) {
    if (children[i].completed) completedChildren++;
  }
  const progressPercent = totalChildren > 0
    ? Math.round((completedChildren / totalChildren) * 100)
    : 0;

  return {
    filePath,
    text: displayText,
    due,
    dueMs,
    area: AREA_MAP[area] !== undefined ? (area as ParsedTask["area"]) : "none",
    priority: normalizedPriority,
    completed,
    diffDays,
    children,
    totalChildren,
    completedChildren,
    progressPercent,
  };
}

/**
 * 将 ParsedTask 列表转换为可排序的 SortableTask 列表
 */
export function buildSortableTasks(
  tasks: ParsedTask[],
  config: DashboardConfig,
): SortableTask[] {
  const orderMult = config.sortOrder === "asc" ? 1 : -1;

  // Filter out completed tasks when showCompleted is disabled
  const filtered = config.showCompleted ? tasks : tasks.filter(t => !t.completed);

  return filtered.map(t => {
    const pVal = PRIORITY_MAP[t.priority] || 99;
    const aVal = AREA_MAP[t.area] || 99;

    // completed position sort key
    let compSort = 0;
    if (config.showCompleted) {
      compSort = config.completedPosition === "top"
        ? (t.completed ? 0 : 1)
        : (t.completed ? 1 : 0);
    }

    // today highlight
    let todaySort = 0;
    if (config.highlightToday && t.diffDays === 0 && !t.completed) {
      todaySort = config.todayPosition === "top" ? -1 : 1;
    }

    // pin metadata
    const metaSort = (config.pinMetadata && (pVal !== 99 || t.due || aVal !== 99)) ? 0 : 1;

    // primary/secondary sort
    const primaryVal = config.primarySort === "priority" ? pVal : (t.dueMs || 999999999999999);
    const secondaryVal = config.primarySort === "priority" ? (t.dueMs || 999999999999999) : pVal;

    return {
      ...t,
      sC: compSort,
      s1: todaySort,
      s2: metaSort,
      s3: primaryVal * orderMult,
      s4: secondaryVal * orderMult,
      s5: aVal,
    };
  });
}

/**
 * 对 SortableTask 数组排序
 */
export function sortTasks(tasks: SortableTask[]): SortableTask[] {
  return tasks.sort((a, b) =>
    a.sC - b.sC ||
    a.s1 - b.s1 ||
    a.s2 - b.s2 ||
    a.s3 - b.s3 ||
    a.s4 - b.s4 ||
    a.s5 - b.s5
  );
}
