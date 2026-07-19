<!-- Language switcher -->
<p align="right">
  <a href="#english">English</a> | <a href="#chinese">中文</a>
</p>

---

<h1 id="english">Minimalist Task Board — Obsidian Plugin</h1>

A high-performance, zero-dependency task board plugin for Obsidian.

## Features

- **Zero dependencies** — Built on Obsidian's native MetadataCache; no Dataview or other plugins required
- **Virtual scrolling** — Handles thousands of tasks smoothly without lag
- **Smart sorting** — Sort by priority or due date; items due today auto-pin to top
- **Area filter** — One-click toggle between Work / Life / Study areas
- **Subtask progress bar** — Auto-calculates child task completion percentage
- **Glow strip** — Red highlight strip for today's due items, dynamic hover strip
- **Dual-layer config** — Global defaults + code-block overrides, flexible per-note

## Installation

### Option 1: Manual install

1. Download the latest release from [GitHub Releases](https://github.com/NingzhuoVeiled/obsidian-minimalist-task-board/releases)
2. Extract into `<vault>/.obsidian/plugins/minimalist-task-board/`
3. Restart Obsidian or enable "Minimalist Task Board" in Settings → Community plugins

### Option 2: BRAT (Beta Reviewer's Auto-update Tool)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) from Obsidian community plugins
2. Open BRAT settings → "Add Beta plugin"
3. Enter the repo URL: `NingzhuoVeiled/obsidian-minimalist-task-board`
4. Enable "Minimalist Task Board" in Settings → Community plugins

BRAT will automatically check for updates and install new versions as they are released

## Quick Start

### Insert a dashboard

- `Ctrl+P` → Search "Minimalist Task Board: Insert dashboard"
- Or manually enter:

````markdown
```task-dashboard
```
````

### Task format

Use standard Markdown task lists with inline metadata tags:

```markdown
- [ ] Finish project report [due:: 2026-07-25] [area::work] [priority::high]
  - [ ] Collect data
  - [x] Write outline
- [ ] Buy milk [due:: 2026-07-20] [area::life] [priority::low]
```

### Metadata tags

| Tag | Required | Description | Example |
|------|----------|-------------|---------|
| `[due:: YYYY-MM-DD]` | No | Due date | `[due:: 2026-07-25]` |
| `[area::xxx]` | No | Area | `[area::work]` / `life` / `study` |
| `[priority::xxx]` | No | Priority | `[priority::high]` / `middle` / `low` |

### Code block config

Write JSON inside the code block to override specific settings:

````markdown
```task-dashboard
{
  "primarySort": "due",
  "showCompleted": false,
  "todayStripColor": "#00ff00"
}
```
````

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `searchPath` | string | `""` | Limit scan directory; empty = entire vault |
| `primarySort` | `"priority"` / `"due"` | `"priority"` | Primary sort key |
| `sortOrder` | `"asc"` / `"desc"` | `"asc"` | Sort direction |
| `pinMetadata` | boolean | `true` | Pin tasks with metadata to top |
| `showRemainingDays` | boolean | `true` | Show remaining days |
| `highlightToday` | boolean | `true` | Highlight tasks due today |
| `todayPosition` | `"top"` / `"bottom"` | `"top"` | Position of today's tasks |
| `showCompleted` | boolean | `true` | Show completed tasks |
| `completedPosition` | `"top"` / `"bottom"` | `"bottom"` | Position of completed tasks |
| `enableTodayStrip` | boolean | `true` | Today-due glow strip |
| `todayStripColor` | string | `"#FF0000"` | Today strip color |
| `enableHoverStrip` | boolean | `true` | Hover glow strip |
| `hoverStripColor` | string | `"#ffffff"` | Hover strip color |
| `columns` | Column[] | 5 columns | Column definitions |

Columns format: `{ "header": "Name", "width": "percent", "key": "field" }`. Key values: `text`, `area`, `priority`, `remaining`, `due`.

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
```

After building, `main.js` and `styles.css` are the complete plugin files.

## License

MIT

---

<h1 id="chinese">Minimalist Task Board — Obsidian 插件</h1>

高性能、零依赖的任务看板插件。

## 特性

- **零外部依赖** — 基于 Obsidian 原生 MetadataCache，无需安装 Dataview 等插件
- **虚拟滚动** — 支持数千条任务，流畅不卡顿
- **智能排序** — 可按优先级或到期日排序，今日到期自动置顶
- **Area 过滤** — 一键切换 Work / Life / Study 区域
- **子任务进度条** — 自动统计子任务完成百分比
- **微光侧边条** — 今日到期红色高亮、悬停动态色条
- **双层配置** — 全局默认 + 代码块覆盖，灵活适配不同笔记

## 安装

### 方案一：手动安装

1. 从 [GitHub Releases](https://github.com/NingzhuoVeiled/obsidian-minimalist-task-board/releases) 下载最新版本
2. 解压放入 `<vault>/.obsidian/plugins/minimalist-task-board/`
3. 重启 Obsidian 或在设置 → 第三方插件中启用 "Minimalist Task Board"

### 方案二：BRAT 安装（推荐）

1. 在 Obsidian 社区插件中安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. 打开 BRAT 设置 → "Add Beta plugin"
3. 输入仓库地址：`NingzhuoVeiled/obsidian-minimalist-task-board`
4. 在设置 → 第三方插件中启用 "Minimalist Task Board"

BRAT 会自动检测更新，无需手动下载新版本。

## 快速开始

### 插入看板

- `Ctrl+P` → 搜索 "Minimalist Task Board: 插入看板"
- 或手动输入：

````markdown
```task-dashboard
```
````

### 任务格式

在你的 Obsidian 笔记中使用标准 Markdown 任务列表，附加行内元数据标签：

```markdown
- [ ] 完成项目报告 [due:: 2026-07-25] [area::work] [priority::high]
  - [ ] 收集数据
  - [x] 撰写大纲
- [ ] 买牛奶 [due:: 2026-07-20] [area::life] [priority::low]
```

### 元数据标签

| 标签 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `[due:: YYYY-MM-DD]` | 否 | 到期日 | `[due:: 2026-07-25]` |
| `[area::xxx]` | 否 | 所属区域 | `[area::work]` / `life` / `study` |
| `[priority::xxx]` | 否 | 优先级 | `[priority::high]` / `middle` / `low` |

### 代码块配置

在代码块内写 JSON，仅需覆盖你要改的配置项：

````markdown
```task-dashboard
{
  "primarySort": "due",
  "showCompleted": false,
  "todayStripColor": "#00ff00"
}
```
````

## 配置选项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `searchPath` | string | `""` | 限定扫描目录，留空=全 Vault |
| `primarySort` | `"priority"` / `"due"` | `"priority"` | 主排序键 |
| `sortOrder` | `"asc"` / `"desc"` | `"asc"` | 排序方向 |
| `pinMetadata` | boolean | `true` | 带元数据任务排前面 |
| `showRemainingDays` | boolean | `true` | 显示剩余天数 |
| `highlightToday` | boolean | `true` | 今日到期高亮 |
| `todayPosition` | `"top"` / `"bottom"` | `"top"` | 今日到期位置 |
| `showCompleted` | boolean | `true` | 显示已完成 |
| `completedPosition` | `"top"` / `"bottom"` | `"bottom"` | 已完成任务位置 |
| `enableTodayStrip` | boolean | `true` | 今日到期侧边条 |
| `todayStripColor` | string | `"#FF0000"` | 今日侧边条颜色 |
| `enableHoverStrip` | boolean | `true` | 悬停侧边条 |
| `hoverStripColor` | string | `"#ffffff"` | 悬停侧边条颜色 |
| `columns` | Column[] | 5列 | 表格列定义 |

Columns 格式：`{ "header": "列名", "width": "百分比", "key": "字段" }`，key 可选值：`text`、`area`、`priority`、`remaining`、`due`。

## 开发

```bash
npm install
npm run dev    # watch 模式
npm run build  # 生产构建
```

构建后 `main.js` 和 `styles.css` 即为完整插件文件。

## 许可

MIT
