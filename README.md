<p align="right">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>
</p>

# Minimalist Task Board — Obsidian Plugin

A high-performance, zero-dependency task board plugin for Obsidian.

## Features

- **Zero dependencies** — Built on Obsidian's native MetadataCache; no Dataview or other plugins required
- **Real-time live refresh** — Like Dataview, watches vault file changes (modify/create/delete/rename) and refreshes dashboards instantly without page reload
- **Smart sorting** — Sort by priority or due date; items due today auto-pin to top
- **Area filter** — One-click toggle between Work / Life / Study areas
- **Subtask progress bar** — Auto-calculates child task completion percentage
- **Glow strip** — Red highlight strip for today's due items, dynamic hover strip
- **Dual-layer config** — Global defaults + code-block overrides, flexible per-note
- **Bilingual UI** — Settings panel supports Chinese and English

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

## Usage Guide

### Insert a dashboard

- `Ctrl+P` → Search "Minimalist Task Board: Insert dashboard"
- Or manually enter in any note:

````markdown
```task-dashboard
```
````

This inserts a dashboard that scans your entire vault for tasks.

### Jump to Target Task
- Jump to a specific task globally: use global search `Ctrl + Shift + F`
- Jump to a specific task on the current page: `Ctrl + F`

### Task format

Write tasks as standard Obsidian Markdown task lists with inline metadata tags:
> All tags are optional. Tasks without tags still appear on the board; they just won't have metadata-driven sorting or highlighting.
```markdown
- [ ] Finish project report [due:: 2026-07-25] [area::work] 
  - [ ] Collect data [priority::high]
  - [x] Write outline
- [ ] Buy milk [due:: 2026-07-20] [area::life] [priority::low]
```

Metadata tags are placed **inline** after the task text, inside `[key::value]` brackets.

### Metadata tags

| Tag | Required | Description | Example |
|------|----------|-------------|---------|
| `[due:: YYYY-MM-DD]` | No | Due date | `[due:: 2026-07-25]` |
| `[area::xxx]` | No | Area category | `[area::work]` / `life` / `study` |
| `[priority::xxx]` | No | Priority level | `[priority::high]` / `middle` / `low` |

> All tags are optional. Tasks without tags still appear on the board; they just won't have metadata-driven sorting or highlighting.

### Subtask progress

Indented tasks under a parent task are automatically treated as subtasks:

```markdown
- [ ] Write blog post [due:: 2026-08-01] [area::work] [priority::high]
  - [x] Research topic
  - [x] Draft outline
  - [ ] Write first draft
  - [ ] Proofread
```

The board will show a progress bar (50% in this example) and a "2/4" count for the parent task.

### Area filter

Once a dashboard is rendered, click the **All / Work / Life / Study** buttons at the top to filter tasks by area. Only tasks matching the selected area (or all areas) are shown.

### Sorting behavior

The default sort order is:

1. **Today's tasks** pinned to top (when `highlightToday` is on)
2. **Tasks with metadata** ranked before tasks without (when `pinMetadata` is on)
3. **Primary sort** by `priority` (high → middle → low) or by `due` date
4. Completed tasks positioned by `completedPosition` setting

You can change the primary sort key and direction in settings or per code block.

### Glow strips

- **Today strip** — A colored bar on the left edge of tasks due today (or overdue). Red by default.
- **Hover strip** — A colored bar that appears when hovering over any task row.

Strip colors can be customized in the settings panel or per code block.

### Settings panel

Open **Settings → Minimalist Task Board** to configure global defaults. The panel is organized into four sections:

| Section | What you can set |
|---------|-----------------|
| **General** | Search path, show/hide completed tasks, completed task position |
| **Sorting** | Primary sort key, sort order, pin metadata tasks |
| **Highlighting & Display** | Remaining days, today highlight, today position |
| **Glow Sidebar** | Enable/disable strips, strip colors |

A built-in tutorial is displayed at the bottom of the settings panel.

Switch between Chinese and English via the **Language / 语言** dropdown at the top.

### Per-dashboard config (code block overrides)

Write JSON inside the `task-dashboard` code block to override global settings for that specific dashboard. Only include the keys you want to change:

````markdown
```task-dashboard
{
  "searchPath": "Projects/",
  "primarySort": "due",
  "showCompleted": false,
  "todayStripColor": "#00ff00"
}
```
````

This example: scans only the `Projects/` folder, sorts by due date, hides completed tasks, and uses a green today strip.

### Custom columns

You can redefine the table columns globally or per code block:

```json
{
  "columns": [
    { "header": "Task", "width": "50%", "key": "text" },
    { "header": "Area", "width": "10%", "key": "area" },
    { "header": "Priority", "width": "10%", "key": "priority" },
    { "header": "Left", "width": "10%", "key": "remaining" },
    { "header": "Due", "width": "20%", "key": "due" }
  ]
}
```

Valid column keys: `text`, `area`, `priority`, `remaining`, `due`.

## Configuration reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `searchPath` | string | `""` | Limit scan directory; empty = entire vault |
| `primarySort` | `"priority"` / `"due"` | `"priority"` | Primary sort key |
| `sortOrder` | `"asc"` / `"desc"` | `"asc"` | Sort direction |
| `pinMetadata` | boolean | `true` | Pin tasks with metadata to top |
| `showRemainingDays` | boolean | `true` | Show remaining days in the Left column |
| `highlightToday` | boolean | `true` | Pin today's due tasks to top or bottom |
| `todayPosition` | `"top"` / `"bottom"` | `"top"` | Position of today's tasks |
| `showCompleted` | boolean | `true` | Show completed tasks |
| `completedPosition` | `"top"` / `"bottom"` | `"bottom"` | Position of completed tasks |
| `enableTodayStrip` | boolean | `true` | Today-due glow strip |
| `todayStripColor` | string | `"#FF0000"` | Today strip color |
| `enableHoverStrip` | boolean | `true` | Hover glow strip |
| `hoverStripColor` | string | `"#ffffff"` | Hover strip color |
| `columns` | Column[] | 5 columns | Column definitions |
| `language` | `"zh"` / `"en"` | `"zh"` | Settings panel language |

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
```

After building, `main.js` and `styles.css` are the complete plugin files.

## License

MIT
