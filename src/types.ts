// ==================== 表格列定义 ====================
export interface ColumnDef {
  header: string;    // 列头显示文字
  width: string;     // CSS 宽度值，如 "42%"
  key: ColumnKey;    // 列数据键
}

export type ColumnKey = "text" | "area" | "priority" | "remaining" | "due";

// ==================== 插件配置 ====================
export interface DashboardConfig {
  // 数据源
  searchPath: string;

  // 排序
  primarySort: "priority" | "due";
  sortOrder: "asc" | "desc";
  pinMetadata: boolean;

  // 高亮
  showRemainingDays: boolean;
  highlightToday: boolean;
  todayPosition: "top" | "bottom";

  // 已完成任务
  showCompleted: boolean;
  completedPosition: "top" | "bottom";

  // 微光侧边条
  enableTodayStrip: boolean;
  todayStripColor: string;
  enableHoverStrip: boolean;
  hoverStripColor: string;

  // 表格列定义
  columns: ColumnDef[];

  // 语言
  language: "zh" | "en";
}

// ==================== 任务解析结果 ====================
export interface ParsedTask {
  filePath: string;
  text: string;           // 去掉元数据和链接后的纯文本
  due: string | null;     // "2026-07-19" 格式的到期日
  dueMs: number | null;   // Unix 毫秒时间戳
  area: "work" | "life" | "study" | "none";
  priority: "high" | "middle" | "low" | "none";
  completed: boolean;
  diffDays: number | null; // 距离到期天数（正=还有，负=过期）
  children: TaskChild[];
  totalChildren: number;
  completedChildren: number;
  progressPercent: number;
}

export interface TaskChild {
  completed: boolean;
}

// ==================== 排序用扩展字段 ====================
export interface SortableTask extends ParsedTask {
  sC: number;   // completed position
  s1: number;   // today highlight
  s2: number;   // pin metadata
  s3: number;   // primary sort key
  s4: number;   // secondary sort key
  s5: number;   // area sort key
}

// ==================== Area 过滤 ====================
export type AreaFilter = "all" | "work" | "life" | "study";
