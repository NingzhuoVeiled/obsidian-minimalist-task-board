<p align="right">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>
</p>

# Minimalist Task Board — Obsidian Plugin

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

BRAT will automatically check for updates and install new versions as they are released.

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
