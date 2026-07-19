import { App, PluginSettingTab, Setting, MarkdownRenderer } from "obsidian";
import type TaskDashboardPlugin from "./main";
import type { DashboardConfig } from "./types";
import { DEFAULT_CONFIG } from "./constants";

// ==================== i18n ====================
type Lang = "zh" | "en";

const T = {
  zh: {
    general: "通用设置",
    sorting: "排序",
    highlighting: "高亮与显示",
    glowSidebar: "微光侧边条",
    tutorialTitle: "使用教程",
    searchPath: { name: "搜索路径", desc: "限定扫描的目录路径（如 'Tasks/'），留空则扫描整个 Vault", placeholder: "留空 = 扫描整个 Vault" },
    showCompleted: { name: "显示已完成任务", desc: "关闭后只显示未完成的任务" },
    completedPosition: { name: "已完成任务位置", desc: "\"top\" 置顶 / \"bottom\" 沉底" },
    primarySort: { name: "主排序键", desc: "按优先级还是到期日排序" },
    sortOrder: { name: "排序方向", desc: "升序或降序" },
    pinMetadata: { name: "钉住带元数据的任务", desc: "开启后带到期日、Area、优先级的任务排在无元数据任务前面" },
    showRemainingDays: { name: "显示剩余天数", desc: "在 Left 列显示距离到期日的天数" },
    highlightToday: { name: "高亮今日到期", desc: "启用后将今日到期任务置顶或沉底" },
    todayPosition: { name: "今日到期位置", desc: "\"top\" 置顶 / \"bottom\" 沉底" },
    enableTodayStrip: { name: "启用今日到期侧边条", desc: "当任务 Left=0（今日到期）时，行首显示彩色侧边条" },
    todayStripColor: { name: "今日侧边条颜色", desc: "Left=0 时的侧边条颜色，十六进制色值" },
    enableHoverStrip: { name: "启用悬停侧边条", desc: "鼠标悬停在任务行时显示侧边条" },
    hoverStripColor: { name: "悬停侧边条颜色", desc: "鼠标悬停时的侧边条颜色" },
    top: "置顶",
    bottom: "沉底",
    priority: "优先级",
    due: "到期日",
    asc: "升序",
    desc: "降序",
    tutorialMD: `
## Minimalist Task Board 使用教程

### 插入面板
- **Ctrl+P** → 搜索 "Minimalist Task Board: 插入看板" → 在光标处插入完整面板代码块
- 或手动输入 \\\`\\\`\\\`task-dashboard

### 代码块配置
在代码块内写入 JSON 覆盖默认值；只需包含需要修改的键：
\\\`\\\`\\\`json
{
  "primarySort": "due",
  "showCompleted": false,
  "todayStripColor": "#00ff00"
}
\\\`\\\`\\\`

### 任务格式
使用 Obsidian 标准 Markdown 任务列表：
\\\`\\\`\\\`
- [ ] 完成项目报告 [due:: 2026-07-25] [area::work] [priority::high]
  - [ ] 收集数据
  - [x] 撰写大纲
\\\`\\\`\\\`

### 元数据标签
| 标签 | 描述 | 示例 |
|------|------|------|
| \\\`[due:: YYYY-MM-DD]\\\` | 到期日 | \\\`[due:: 2026-07-25]\\\` |
| \\\`[area::xxx]\\\` | 领域 | \\\`[area::work]\\\` / \\\`life\\\` / \\\`study\\\` |
| \\\`[priority::xxx]\\\` | 优先级 | \\\`[priority::high]\\\` / \\\`middle\\\` / \\\`low\\\` |

> 所有元数据标签均可内联在标准 Obsidian 任务格式 \\\`- [ ]\\\` 中使用。
`.trim(),
  },
  en: {
    general: "General",
    sorting: "Sorting",
    highlighting: "Highlighting & Display",
    glowSidebar: "Glow Sidebar",
    tutorialTitle: "Usage Guide",
    searchPath: { name: "Search Path", desc: "Limit scan to a directory (e.g. 'Tasks/'), leave empty to scan entire Vault", placeholder: "Empty = entire vault" },
    showCompleted: { name: "Show Completed Tasks", desc: "When disabled, only show incomplete tasks" },
    completedPosition: { name: "Completed Tasks Position", desc: "\"top\" pin to top / \"bottom\" sink to bottom" },
    primarySort: { name: "Primary Sort Key", desc: "Sort by priority or due date" },
    sortOrder: { name: "Sort Order", desc: "Ascending or descending" },
    pinMetadata: { name: "Pin Tasks with Metadata", desc: "Tasks with due/area/priority appear before tasks without metadata" },
    showRemainingDays: { name: "Show Remaining Days", desc: "Show days until due date in the Left column" },
    highlightToday: { name: "Highlight Today's Tasks", desc: "Pin today's due tasks to top or bottom" },
    todayPosition: { name: "Today Position", desc: "\"top\" pin to top / \"bottom\" sink to bottom" },
    enableTodayStrip: { name: "Enable Today Strip", desc: "Show a colored strip on the left when task Left=0 (due today)" },
    todayStripColor: { name: "Today Strip Color", desc: "Color of the today strip, hex value" },
    enableHoverStrip: { name: "Enable Hover Strip", desc: "Show a strip on hover" },
    hoverStripColor: { name: "Hover Strip Color", desc: "Color of the hover strip" },
    top: "Top",
    bottom: "Bottom",
    priority: "Priority",
    due: "Due",
    asc: "Ascending",
    desc: "Descending",
    tutorialMD: `
## Minimalist Task Board Usage Guide

### Insert Dashboard
- **Ctrl+P** → search "Minimalist Task Board: Insert dashboard" → inserts a full dashboard code block at cursor
- Or type manually: \\\`\\\`\\\`task-dashboard

### Code Block Configuration
Override defaults with JSON inside the code block (only include what you need to change):
\\\`\\\`\\\`json
{
  "primarySort": "due",
  "showCompleted": false,
  "todayStripColor": "#00ff00"
}
\\\`\\\`\\\`

### Task Format
Use standard Obsidian Markdown task lists with inline metadata tags:
\\\`\\\`\\\`
- [ ] Complete project report [due:: 2026-07-25] [area::work] [priority::high]
  - [ ] Collect data
  - [x] Draft outline
\\\`\\\`\\\`

### Metadata Tags
| Tag | Description | Example |
|------|-------------|---------|
| \\\`[due:: YYYY-MM-DD]\\\` | Due date | \\\`[due:: 2026-07-25]\\\` |
| \\\`[area::xxx]\\\` | Area | \\\`[area::work]\\\` / \\\`life\\\` / \\\`study\\\` |
| \\\`[priority::xxx]\\\` | Priority | \\\`[priority::high]\\\` / \\\`middle\\\` / \\\`low\\\` |

> All metadata tags work inline within standard Obsidian \\\`- [ ]\\\` task format.
`.trim(),
  },
} as const;

// ==================== Settings storage ====================
export class TaskDashboardSettings {
  private plugin: TaskDashboardPlugin;

  constructor(plugin: TaskDashboardPlugin) {
    this.plugin = plugin;
  }

  get config(): DashboardConfig {
    return this.plugin.settings;
  }

  set config(c: DashboardConfig) {
    this.plugin.settings = c;
  }

  async load(): Promise<void> {
    const data = await this.plugin.loadData();
    this.plugin.settings = Object.assign({}, DEFAULT_CONFIG, data);
  }

  async save(): Promise<void> {
    await this.plugin.saveData(this.plugin.settings);
  }
}

// ==================== Settings tab ====================
export class TaskDashboardSettingTab extends PluginSettingTab {
  plugin: TaskDashboardPlugin;
  settings: TaskDashboardSettings;

  constructor(app: App, plugin: TaskDashboardPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.settings = new TaskDashboardSettings(plugin);
  }

  private t(): Record<string, any> {
    const lang = this.plugin.settings.language || "zh";
    return T[lang] || T.zh;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    const t = this.t();

    // compact styles for this settings panel
    containerEl.style.setProperty("--heading-margin", "8px 0 4px");
    const h = (text: string) => {
      const el = containerEl.createEl("h3", { text });
      el.style.margin = "12px 0 4px";
      el.style.fontSize = "0.95rem";
      return el;
    };

    // ===== Language Toggle =====
    new Setting(containerEl)
      .setName("🌐 Language / 语言")
      .addDropdown(dropdown => dropdown
        .addOption("zh", "中文")
        .addOption("en", "English")
        .setValue(this.plugin.settings.language)
        .onChange(async (value) => {
          this.plugin.settings.language = value as "zh" | "en";
          await this.settings.save();
          this.display();
        }));

    // ===== General =====
    h(t.general);

    new Setting(containerEl)
      .setName(t.searchPath.name)
      .addText(text => text
        .setPlaceholder(t.searchPath.placeholder)
        .setValue(this.plugin.settings.searchPath)
        .onChange(async (value) => {
          this.plugin.settings.searchPath = value;
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.showCompleted.name)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showCompleted)
        .onChange(async (value) => {
          this.plugin.settings.showCompleted = value;
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.completedPosition.name)
      .addDropdown(dropdown => dropdown
        .addOption("top", t.top)
        .addOption("bottom", t.bottom)
        .setValue(this.plugin.settings.completedPosition)
        .onChange(async (value) => {
          this.plugin.settings.completedPosition = value as "top" | "bottom";
          await this.settings.save();
        }));

    // ===== Sorting =====
    h(t.sorting);

    new Setting(containerEl)
      .setName(t.primarySort.name)
      .addDropdown(dropdown => dropdown
        .addOption("priority", t.priority)
        .addOption("due", t.due)
        .setValue(this.plugin.settings.primarySort)
        .onChange(async (value) => {
          this.plugin.settings.primarySort = value as "priority" | "due";
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.sortOrder.name)
      .addDropdown(dropdown => dropdown
        .addOption("asc", t.asc)
        .addOption("desc", t.desc)
        .setValue(this.plugin.settings.sortOrder)
        .onChange(async (value) => {
          this.plugin.settings.sortOrder = value as "asc" | "desc";
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.pinMetadata.name)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.pinMetadata)
        .onChange(async (value) => {
          this.plugin.settings.pinMetadata = value;
          await this.settings.save();
        }));

    // ===== Highlighting =====
    h(t.highlighting);

    new Setting(containerEl)
      .setName(t.showRemainingDays.name)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showRemainingDays)
        .onChange(async (value) => {
          this.plugin.settings.showRemainingDays = value;
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.highlightToday.name)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.highlightToday)
        .onChange(async (value) => {
          this.plugin.settings.highlightToday = value;
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.todayPosition.name)
      .addDropdown(dropdown => dropdown
        .addOption("top", t.top)
        .addOption("bottom", t.bottom)
        .setValue(this.plugin.settings.todayPosition)
        .onChange(async (value) => {
          this.plugin.settings.todayPosition = value as "top" | "bottom";
          await this.settings.save();
        }));

    // ===== Glow Sidebar =====
    h(t.glowSidebar);

    new Setting(containerEl)
      .setName(t.enableTodayStrip.name)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableTodayStrip)
        .onChange(async (value) => {
          this.plugin.settings.enableTodayStrip = value;
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.todayStripColor.name)
      .addText(text => text
        .setValue(this.plugin.settings.todayStripColor)
        .onChange(async (value) => {
          this.plugin.settings.todayStripColor = value;
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.enableHoverStrip.name)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableHoverStrip)
        .onChange(async (value) => {
          this.plugin.settings.enableHoverStrip = value;
          await this.settings.save();
        }));

    new Setting(containerEl)
      .setName(t.hoverStripColor.name)
      .addText(text => text
        .setValue(this.plugin.settings.hoverStripColor)
        .onChange(async (value) => {
          this.plugin.settings.hoverStripColor = value;
          await this.settings.save();
        }));

    // ===== Tutorial =====
    containerEl.createEl("hr");
    h(t.tutorialTitle);
    const tutorialDiv = containerEl.createDiv({ cls: "task-dashboard-tutorial" });
    tutorialDiv.style.maxHeight = "300px";
    tutorialDiv.style.overflowY = "auto";
    tutorialDiv.style.padding = "8px";
    tutorialDiv.style.background = "var(--background-secondary)";
    tutorialDiv.style.borderRadius = "8px";

    MarkdownRenderer.renderMarkdown(
      t.tutorialMD,
      tutorialDiv,
      "",
      this.plugin,
    );
  }
}
