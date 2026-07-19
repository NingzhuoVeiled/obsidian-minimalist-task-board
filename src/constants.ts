import type { DashboardConfig } from "./types";

// ==================== 默认配置 ====================
export const DEFAULT_CONFIG: DashboardConfig = {
  searchPath: "",
  primarySort: "priority",
  sortOrder: "asc",
  pinMetadata: true,
  showRemainingDays: true,
  highlightToday: true,
  todayPosition: "top",
  showCompleted: true,
  completedPosition: "bottom",
  enableTodayStrip: true,
  todayStripColor: "#FF0000",
  enableHoverStrip: true,
  hoverStripColor: "#ffffff",
  columns: [
    { header: "Task Description", width: "42%", key: "text" },
    { header: "Area", width: "9%", key: "area" },
    { header: "Priority", width: "10%", key: "priority" },
    { header: "Left", width: "8%", key: "remaining" },
    { header: "Due", width: "14%", key: "due" },
  ],
  language: "zh",
};

// ==================== 映射表 ====================
export const PRIORITY_MAP: Record<string, number> = {
  high: 1, middle: 2, low: 3, none: 99,
};

export const AREA_MAP: Record<string, number> = {
  work: 1, life: 2, study: 3, none: 99,
};

// ==================== 预编译正则 ====================
export const DUE_REGEX = /\[due::\s*(\d{4}-\d{2}-\d{2})\]/;
export const META_REGEX = /\[\w+::/;
export const LINK_REGEX = /\[([^\]]+)\]\([^)]+\)/g;
export const CODE_REGEX = /`([^`]+)`/g;
export const AREA_REGEX = /\[area::\s*(\w+)\]/;
export const PRIORITY_REGEX = /\[priority::\s*(\w+)\]/;

