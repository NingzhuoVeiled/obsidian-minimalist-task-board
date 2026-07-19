# Task Dashboard — Obsidian 插件

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

1. 下载插件文件夹放入 `<vault>/.obsidian/plugins/task-dashboard/`
2. 确保文件夹包含 `main.js`、`styles.css`、`manifest.json`
3. 重启 Obsidian 或在设置 → 第三方插件中启用 "Task Dashboard"
4. （可选）在设置面板中调整默认配置

## 快速开始

### 插入看板

- `Ctrl+P` → 搜索 "插入 Task Dashboard"
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
