import type { DashboardConfig, SortableTask, AreaFilter } from "./types";

/**
 * Task dashboard renderer — builds the full HTML table with area filter.
 * Renders all rows directly (no virtual scrolling) so new tasks appear
 * naturally at the bottom of the list.
 */
export class TaskDashboardRenderer {
  private currentArea: AreaFilter = "all";
  private container: HTMLElement | null = null;
  private allTasks: SortableTask[] = [];
  private config!: DashboardConfig;
  private tbody: HTMLElement | null = null;
  private btnContainer: HTMLElement | null = null;

  /**
   * Main render entry point.
   */
  render(
    container: HTMLElement,
    config: DashboardConfig,
    tasks: SortableTask[],
  ): void {
    this.container = container;
    this.allTasks = tasks;
    this.config = config;

    container.empty();

    // 1. Dynamic styles (CSS variables + column widths)
    this.injectStyles(config);

    // 2. Toggle glow strip classes on container
    container.classList.toggle("enable-today-strip", config.enableTodayStrip);
    container.classList.toggle("enable-hover-strip", config.enableHoverStrip);

    // 3. Area filter buttons
    this.buildFilterButtons();

    // 4. Table (matches dv.table() output class)
    const table = container.createEl("table", { cls: "dataview table-view-table" });

    // 5. Header
    const thead = table.createEl("thead");
    const headerRow = thead.createEl("tr");
    for (const col of config.columns) {
      headerRow.createEl("th", { text: col.header });
    }

    // 6. Body — all rows rendered directly
    this.tbody = table.createEl("tbody");
    this.renderAllRows();
  }

  /**
   * Clean up — nothing to clean in the simplified renderer.
   */
  destroy(): void {
    this.tbody = null;
    this.btnContainer = null;
    this.container = null;
  }

  // ---- Private helpers ----

  private injectStyles(config: DashboardConfig): void {
    const styleId = "task-dashboard-dynamic-style";
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const styleEl = document.createElement("style");
    styleEl.id = styleId;

    let colCSS = config.columns.map((col, i) => `
      .dataview.table-view-table th:nth-child(${i + 1}),
      .dataview.table-view-table td:nth-child(${i + 1}) { width: ${col.width}; }
    `).join("\n");

    styleEl.innerHTML = `
      :root {
        --today-strip-color: ${config.todayStripColor};
        --hover-strip-color: ${config.hoverStripColor};
      }
      ${colCSS}
    `;
    document.head.appendChild(styleEl);
  }

  private buildFilterButtons(): void {
    if (!this.container) return;
    this.btnContainer = this.container.createDiv({ cls: "area-filter-container" });

    const areas: AreaFilter[] = ["all", "work", "life", "study"];
    for (const area of areas) {
      const btn = this.btnContainer.createEl("button", {
        text: area.toUpperCase(),
        cls: `area-btn area-btn-${area} ${this.currentArea === area ? "active" : ""}`,
      });
      btn.addEventListener("click", () => {
        this.currentArea = area;
        // Update active state
        const allBtns = this.btnContainer!.querySelectorAll(".area-btn");
        allBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        // Re-render table body
        this.renderAllRows();
      });
    }
  }

  private getFilteredTasks(): SortableTask[] {
    if (this.currentArea === "all") return this.allTasks;
    return this.allTasks.filter(t => t.area === this.currentArea);
  }

  private renderAllRows(): void {
    if (!this.tbody) return;
    this.tbody.empty();

    const filtered = this.getFilteredTasks();
    for (const t of filtered) {
      const tr = this.tbody.createEl("tr");
      for (const col of this.config.columns) {
        const td = tr.createEl("td");
        switch (col.key) {
          case "text":   this.renderTextCell(td, t);   break;
          case "area":   this.renderAreaCell(td, t);   break;
          case "priority": this.renderPriorityCell(td, t); break;
          case "remaining": this.renderRemainingCell(td, t); break;
          case "due":    this.renderDueCell(td, t);    break;
        }
      }
    }
  }

  private renderTextCell(td: HTMLTableCellElement, t: SortableTask): void {
    if (t.totalChildren > 0) {
      td.innerHTML = `
        <div class="task-text-wrapper ${t.completed ? "task-is-completed" : ""}">
          <div class="task-text-line">${t.text}</div>
          <div class="task-progress-bar-wrapper">
            <span class="progress-text">${t.progressPercent}%</span>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${t.progressPercent}%;"></div>
            </div>
          </div>
        </div>`;
    } else {
      td.innerHTML = `
        <div class="task-text-line ${t.completed ? "task-is-completed" : ""}">${t.text}</div>`;
    }
  }

  private renderAreaCell(td: HTMLTableCellElement, t: SortableTask): void {
    const area = t.area !== "none" ? t.area.toUpperCase() : "•";
    td.innerHTML = `<div class="pill area-${t.area}">${area}</div>`;
  }

  private renderPriorityCell(td: HTMLTableCellElement, t: SortableTask): void {
    const priority = t.priority !== "none" ? t.priority.toUpperCase() : "•";
    td.innerHTML = `<div class="pill priority-${t.priority}">${priority}</div>`;
  }

  private renderRemainingCell(td: HTMLTableCellElement, t: SortableTask): void {
    if (t.completed) {
      td.innerHTML = '<span class="days-completed">✓</span>';
    } else if (!this.config.showRemainingDays || t.due === null) {
      td.innerHTML = "-";
    } else if (t.diffDays === 0) {
      td.innerHTML = '<span class="days-zero">0</span>';
    } else if (t.diffDays! > 0) {
      td.innerHTML = `<span class="days-pos">+${t.diffDays}</span>`;
    } else {
      td.innerHTML = `<span class="days-neg">${t.diffDays}</span>`;
    }
  }

  private renderDueCell(td: HTMLTableCellElement, t: SortableTask): void {
    td.innerHTML = t.due ? `<span>${t.due}</span>` : "•";
  }
}
