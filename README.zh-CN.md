<p align="right">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>
</p>

# Minimalist Task Board — Obsidian 插件

高性能、零依赖的任务看板插件。

## 特性

- **零外部依赖** — 基于 Obsidian 原生 MetadataCache，无需安装 Dataview 等插件
- **虚拟滚动** — 支持数千条任务，流畅不卡顿
- **智能排序** — 可按优先级或到期日排序，今日到期自动置顶
- **Area 过滤** — 一键切换 Work / Life / Study 区域
- **子任务进度条** — 自动统计子任务完成百分比
- **微光侧边条** — 今日到期红色高亮、悬停动态色条
- **双层配置** — 全局默认 + 代码块覆盖，灵活适配不同笔记
- **双语界面** — 设置面板支持中英文切换

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

## 使用教程

### 插入看板

- `Ctrl+P` → 搜索 "Minimalist Task Board: 插入看板"
- 或在任意笔记中手动输入：

````markdown
```task-dashboard
```
````

即可插入一个扫描全 Vault 的任务看板。

### 任务格式

使用 Obsidian 标准 Markdown 任务列表，在任务文本后方附加行内元数据标签：

```markdown
- [ ] 完成项目报告 [due:: 2026-07-25] [area::work] [priority::high]
  - [ ] 收集数据
  - [x] 撰写大纲
- [ ] 买牛奶 [due:: 2026-07-20] [area::life] [priority::low]
```

元数据标签放在任务文本后面，格式为 `[key::value]`，可内联在同一条任务中。

### 元数据标签

| 标签 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `[due:: YYYY-MM-DD]` | 否 | 到期日 | `[due:: 2026-07-25]` |
| `[area::xxx]` | 否 | 所属区域 | `[area::work]` / `life` / `study` |
| `[priority::xxx]` | 否 | 优先级 | `[priority::high]` / `middle` / `low` |

> 所有标签均为可选。没有元数据的任务也会显示在看板中，只是不会获得标签驱动的排序和高亮效果。

### 子任务进度

父任务下方缩进的任务自动视为子任务：

```markdown
- [ ] 撰写博客 [due:: 2026-08-01] [area::work] [priority::high]
  - [x] 调研主题
  - [x] 撰写大纲
  - [ ] 写初稿
  - [ ] 校对
```

看板会自动显示父任务的进度条（上例为 50%）和 "2/4" 完成计数。

### Area 过滤

看板渲染后，点击顶部的 **All / Work / Life / Study** 按钮即可按区域过滤任务，只显示对应区域的任务。

### 排序规则

默认排序逻辑为：

1. **今日到期**置顶（`highlightToday` 开启时）
2. **带元数据的任务**排前面（`pinMetadata` 开启时）
3. **主排序**按 `priority`（高→中→低）或按 `due` 到期日
4. 已完成任务按 `completedPosition` 设置决定位置

可在设置面板或代码块中调整主排序键和方向。

### 微光侧边条

- **今日到期侧边条** — 今日到期（含已过期）的任务行左侧显示彩色边条，默认红色
- **悬停侧边条** — 鼠标悬停在任意任务行时显示彩色边条

颜色可在设置面板或代码块中自定义。

### 设置面板

打开 **设置 → Minimalist Task Board** 配置全局默认值。面板分为四个区域：

| 区域 | 可配置项 |
|------|---------|
| **通用设置** | 搜索路径、显示/隐藏已完成、已完成位置 |
| **排序** | 主排序键、排序方向、钉住元数据任务 |
| **高亮与显示** | 剩余天数、今日高亮、今日到期位置 |
| **微光侧边条** | 开关侧边条、侧边条颜色 |

面板底部内置了使用教程，顶部可通过 **Language / 语言** 下拉框切换中英文。

### 代码块配置（面板级覆盖）

在 `task-dashboard` 代码块中写入 JSON，仅覆盖需要修改的配置项，未写明的项沿用全局设置：

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

上例效果：仅扫描 `Projects/` 目录，按到期日排序，隐藏已完成任务，今日到期侧边条改为绿色。

### 自定义列

可在全局设置或代码块中重新定义表格列：

```json
{
  "columns": [
    { "header": "任务", "width": "50%", "key": "text" },
    { "header": "区域", "width": "10%", "key": "area" },
    { "header": "优先级", "width": "10%", "key": "priority" },
    { "header": "剩余", "width": "10%", "key": "remaining" },
    { "header": "到期日", "width": "20%", "key": "due" }
  ]
}
```

column 的 key 可选值：`text`、`area`、`priority`、`remaining`、`due`。

## 配置参考

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `searchPath` | string | `""` | 限定扫描目录，留空=全 Vault |
| `primarySort` | `"priority"` / `"due"` | `"priority"` | 主排序键 |
| `sortOrder` | `"asc"` / `"desc"` | `"asc"` | 排序方向 |
| `pinMetadata` | boolean | `true` | 带元数据任务排前面 |
| `showRemainingDays` | boolean | `true` | 在 Left 列显示剩余天数 |
| `highlightToday` | boolean | `true` | 今日到期任务置顶或沉底 |
| `todayPosition` | `"top"` / `"bottom"` | `"top"` | 今日到期位置 |
| `showCompleted` | boolean | `true` | 显示已完成任务 |
| `completedPosition` | `"top"` / `"bottom"` | `"bottom"` | 已完成任务位置 |
| `enableTodayStrip` | boolean | `true` | 今日到期侧边条 |
| `todayStripColor` | string | `"#FF0000"` | 今日侧边条颜色 |
| `enableHoverStrip` | boolean | `true` | 悬停侧边条 |
| `hoverStripColor` | string | `"#ffffff"` | 悬停侧边条颜色 |
| `columns` | Column[] | 5列 | 表格列定义 |
| `language` | `"zh"` / `"en"` | `"zh"` | 设置面板语言 |

## 开发

```bash
npm install
npm run dev    # watch 模式
npm run build  # 生产构建
```

构建后 `main.js` 和 `styles.css` 即为完整插件文件。

## 许可

MIT
