import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown,
  Filter, 
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Settings2,
  Check,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

// --- Low-level Primitives ---

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b border-border bg-secondary/40", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("border-t border-border bg-secondary/50 font-medium [&_tr]:last-child:border-0", className)}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border/40 transition-colors hover:bg-secondary/20 data-[state=selected]:bg-secondary/40",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-xs [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-4 align-middle text-foreground [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

// --- High-level Flexible Table Types and Subcomponent ---

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: string[];
  render?: (row: T) => React.ReactNode;
  searchable?: boolean;
  className?: string;
}

export interface TableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  columns?: TableColumn<T>[];
  data?: T[];
  title?: string;
  description?: string;
  defaultSort?: { key: string; direction: "asc" | "desc" };
  actions?: React.ReactNode;
  emptyState?: React.ReactNode;
}

function FlexibleTableInternal<T>({
  columns = [],
  data = [],
  title,
  description,
  defaultSort,
  actions,
  className,
  emptyState,
  ...props
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key || null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(defaultSort?.direction || null);
  
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => new Set(columns.map((c) => c.key)));
  const [density, setDensity] = useState<"compact" | "moderate" | "relaxed">("moderate");
  
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement | null>(null);

  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [settingsPopoverPosition, setSettingsPopoverPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [settingsTrigger, setSettingsTrigger] = useState<HTMLButtonElement | null>(null);

  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const settingsPopoverRef = useRef<HTMLDivElement>(null);

  // Dynamically update and reposition popovers on scroll or window resize
  useEffect(() => {
    const updatePosition = () => {
      if (activePopover && activeTrigger) {
        const rect = activeTrigger.getBoundingClientRect();
        const width = 240;
        
        // Hide popover if the column header scrolls completely out of view of the table scroll window
        const tableWrapper = tableWrapperRef.current;
        if (tableWrapper) {
          const wrapperRect = tableWrapper.getBoundingClientRect();
          if (rect.right < wrapperRect.left || rect.left > wrapperRect.right) {
            setActivePopover(null);
            setActiveTrigger(null);
            return;
          }
        }

        // Hide popover if it scrolls out of the viewport vertically
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setActivePopover(null);
          setActiveTrigger(null);
          return;
        }

        let left = rect.left;
        if (left + width > window.innerWidth) {
          left = window.innerWidth - width - 16;
        }
        left = Math.max(16, left);

        setPopoverPosition({
          top: rect.bottom + 4,
          left: left,
          width: width
        });
      }

      if (showSettingsPopover && settingsTrigger) {
        const rect = settingsTrigger.getBoundingClientRect();
        const width = 220;

        // Hide settings popover if it scrolls out of the viewport vertically
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setShowSettingsPopover(false);
          setSettingsTrigger(null);
          return;
        }

        let left = rect.right - width;
        if (left + width > window.innerWidth) {
          left = window.innerWidth - width - 16;
        }
        left = Math.max(16, left);

        setSettingsPopoverPosition({
          top: rect.bottom + 4,
          left: left,
          width: width
        });
      }
    };

    updatePosition(); // Initial calculation on open

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    
    const tableWrapper = tableWrapperRef.current;
    if (tableWrapper) {
      tableWrapper.addEventListener("scroll", updatePosition, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      if (tableWrapper) {
        tableWrapper.removeEventListener("scroll", updatePosition);
      }
    };
  }, [activePopover, activeTrigger, showSettingsPopover, settingsTrigger]);

  // Centralized click-away handler
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      // Handle column filters popover click-away
      if (activePopover) {
        const popoverEl = document.getElementById("column-settings-popover");
        const triggers = document.querySelectorAll(".column-settings-trigger");
        let isTriggerClick = false;
        triggers.forEach((trigger) => {
          if (trigger.contains(target)) {
            isTriggerClick = true;
          }
        });
        if (popoverEl && !popoverEl.contains(target) && !isTriggerClick) {
          setActivePopover(null);
          setActiveTrigger(null);
        }
      }

      // Handle settings gear popover click-away
      if (showSettingsPopover && settingsPopoverRef.current) {
        const trigger = document.getElementById("table-settings-trigger");
        const isTriggerClick = trigger && trigger.contains(target);
        if (!settingsPopoverRef.current.contains(target) && !isTriggerClick) {
          setShowSettingsPopover(false);
          setSettingsTrigger(null);
        }
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activePopover, showSettingsPopover]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery, columnFilters, pageSize]);

  useEffect(() => {
    setVisibleColumns(new Set(columns.map((c) => c.key)));
  }, [columns]);

  const openSettingsPopover = (triggerEl: HTMLButtonElement) => {
    setSettingsTrigger(triggerEl);
    setShowSettingsPopover(true);
    setActivePopover(null);
    setActiveTrigger(null);
  };

  const openPopover = (columnKey: string, triggerEl: HTMLButtonElement) => {
    setActiveTrigger(triggerEl);
    setActivePopover(columnKey);
    setShowSettingsPopover(false);
    setSettingsTrigger(null);
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const searchableKeys = columns
        .filter((c) => c.searchable !== false)
        .map((c) => c.key);

      result = result.filter((row: any) => {
        return searchableKeys.some((key) => {
          const val = row[key];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(query);
        });
      });
    }

    Object.entries(columnFilters).forEach(([key, allowedValues]) => {
      if (!allowedValues || !Array.isArray(allowedValues)) return;
      result = result.filter((row: any) => {
        const val = row[key];
        const valStr = val !== undefined && val !== null && val !== "" ? String(val) : "-";
        return allowedValues.includes(valStr);
      });
    });

    if (sortKey && sortDirection) {
      result.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        const comparison = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
          sensitivity: "base",
        });

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, columns, searchQuery, columnFilters, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return processedData.slice(start, end);
  }, [processedData, pageIndex, pageSize]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));

  const handleSort = (key: string, direction?: "asc" | "desc") => {
    if (direction) {
      if (sortKey === key && sortDirection === direction) {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortKey(key);
        setSortDirection(direction);
      }
    } else {
      if (sortKey === key) {
        if (sortDirection === "asc") {
          setSortDirection("desc");
        } else {
          setSortKey(null);
          setSortDirection(null);
        }
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    }
  };

  const toggleColumnVisibility = (key: string) => {
    const next = new Set(visibleColumns);
    if (next.has(key)) {
      if (next.size > 1) {
        next.delete(key);
      }
    } else {
      next.add(key);
    }
    setVisibleColumns(next);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setColumnFilters({});
    setSortKey(defaultSort?.key || null);
    setSortDirection(defaultSort?.direction || null);
    setActivePopover(null);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.keys(columnFilters).length + (searchQuery ? 1 : 0);
  }, [columnFilters, searchQuery]);

  return (
    <div className="space-y-4 w-full text-left relative">
      
      {/* Page Title Header */}
      {(title || description || actions) && (
        <div className="flex items-center justify-between px-1">
          <div>
            {title && <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}

      {/* Main Table Card (Contains Search row + headers + rows + borders) */}
      <div className="rounded-2xl border border-border/80 bg-card/30 backdrop-blur-md overflow-hidden shadow-lg w-full flex flex-col">
        
        {/* Integrated Search Bar directly at the top of the headers */}
        <div className="relative flex items-center justify-between border-b border-border/80 bg-secondary/10 px-4 py-2">
          {/* Search Input Box with Outline (less round corner md style) */}
          <div className="relative flex flex-1 items-center gap-2 max-w-sm rounded-md border border-border bg-background/50 px-3 py-1.5 transition-all focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/20">
            <Search className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <input
              placeholder="Search table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-xs text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-0 min-w-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground/60 hover:text-foreground shrink-0 rounded-full p-0.5 hover:bg-secondary"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          
          {/* Settings Trigger (Three dots menu) */}
          <button
            id="table-settings-trigger"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (showSettingsPopover) {
                setShowSettingsPopover(false);
              } else {
                openSettingsPopover(e.currentTarget);
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all shrink-0 ml-2"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Active Filters Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/50 bg-secondary/5 px-4 py-2 text-xs">
            <span className="text-muted-foreground font-semibold">Filtered Columns:</span>
            
            {searchQuery && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border/60 py-0.5 pl-2.5 pr-1.5 text-[11px] font-medium text-foreground">
                <span>Search: &quot;{searchQuery}&quot;</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-0.5 hover:bg-border/60 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            )}

            {Object.entries(columnFilters).map(([key, filterVal]) => {
              const col = columns.find((c) => c.key === key);
              if (!col) return null;
              return (
                <div
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border/60 py-0.5 pl-2.5 pr-1.5 text-[11px] font-medium text-foreground"
                >
                  <span className="text-muted-foreground">{col.header}:</span>
                  <span className="font-semibold">{filterVal.length} selected</span>
                  <button
                    onClick={() => {
                      setColumnFilters((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                    }}
                    className="rounded-full p-0.5 hover:bg-border/60 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              );
            })}

            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-colors px-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Scrollable Table View */}
        <div className="overflow-x-auto w-full scrollbar-thin" ref={tableWrapperRef}>
          <table className={cn("w-full text-left border-collapse min-w-[600px] table-auto", className)} {...props}>
            <thead className="border-b border-border bg-secondary/35">
              <tr className="border-b border-border/50 hover:bg-transparent">
                {columns
                  .filter((col) => visibleColumns.has(col.key))
                  .map((col) => {
                    const isSortable = col.sortable !== false;
                    const isSorted = sortKey === col.key && sortDirection !== null;
                    const isFiltered = columnFilters[col.key] !== undefined;
                    
                    return (
                      <th
                        key={col.key}
                        className={cn(
                          "px-4 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider select-none transition-colors group relative",
                          density === "compact" && "h-10 py-2 text-[10px]",
                          density === "moderate" && "h-12 py-3 text-xs",
                          density === "relaxed" && "h-14 py-4 text-sm",
                          col.className
                        )}
                      >
                        <div className="flex items-center justify-between gap-1.5 w-full">
                          <span className="truncate">{col.header}</span>
                          
                          {/* Column Settings trigger button */}
                          {(isSortable || col.filterable !== false) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activePopover === col.key) {
                                  setActivePopover(null);
                                } else {
                                  openPopover(col.key, e.currentTarget);
                                }
                              }}
                              className={cn(
                                "column-settings-trigger flex h-6 w-6 items-center justify-center rounded-md transition-all hover:bg-secondary/60 hover:text-foreground shrink-0",
                                isFiltered || isSorted 
                                  ? "text-orange-500 bg-orange-500/10 opacity-100" 
                                  : "text-muted-foreground/45 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              )}
                            >
                              {isFiltered ? (
                                <Filter className="h-3.5 w-3.5 stroke-[2.5]" />
                              ) : isSorted ? (
                                sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30 text-sm">
              <AnimatePresence initial={false}>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row: any, rowIndex) => {
                    const rowId = row.id || rowIndex;
                    
                    return (
                      <tr
                        key={`row-${rowId}`}
                        className="border-b border-border/30 hover:bg-secondary/10 transition-colors"
                      >
                        {columns
                          .filter((col) => visibleColumns.has(col.key))
                          .map((col) => {
                            return (
                              <td
                                key={`cell-${rowId}-${col.key}`}
                                className={cn(
                                  "px-4 font-medium text-foreground/90 align-middle",
                                  density === "compact" && "py-1.5 text-xs",
                                  density === "moderate" && "py-3.5 text-sm",
                                  density === "relaxed" && "py-5 text-base",
                                  col.className
                                )}
                              >
                                {col.render ? col.render(row) : (
                                  <span>{row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : "-"}</span>
                                )}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={columns.filter((c) => visibleColumns.has(c.key)).length}
                      className="py-12 text-center text-muted-foreground"
                    >
                      {emptyState ? emptyState : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Eye className="h-8 w-8 text-muted-foreground/40" />
                          <p className="font-semibold text-sm">No items found</p>
                          <p className="text-xs text-muted-foreground/70">
                            Try adjusting column filters or search parameters.
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Pagination Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-1">
        <div className="text-xs text-muted-foreground text-center sm:text-left">
          Showing <span className="font-bold text-foreground">{processedData.length === 0 ? 0 : pageIndex * pageSize + 1}</span> to{" "}
          <span className="font-bold text-foreground">
            {Math.min(processedData.length, (pageIndex + 1) * pageSize)}
          </span>{" "}
          of <span className="font-bold text-foreground">{processedData.length}</span> results
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageIndex(0);
              }}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-orange-500 focus:outline-none transition-colors"
            >
              {[5, 10, 20, 35, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
              className="h-8.5 w-8.5 p-0 rounded-lg animate-scale-click"
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-xs text-muted-foreground font-semibold px-2">
              Page {pageIndex + 1} of {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageIndex >= totalPages - 1}
              className="h-8.5 w-8.5 p-0 rounded-lg animate-scale-click"
              aria-label="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- Column Settings Menu --- */}
      <AnimatePresence>
        {activePopover && popoverPosition && (
          <ColumnPopover
            column={columns.find((c) => c.key === activePopover)!}
            data={data}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            popoverPosition={popoverPosition}
            handleSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            setActivePopover={setActivePopover}
          />
        )}
      </AnimatePresence>

      {/* --- General Settings Menu --- */}
      <AnimatePresence>
        {showSettingsPopover && settingsPopoverPosition && (
          <motion.div
            ref={settingsPopoverRef}
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              top: settingsPopoverPosition.top,
              left: settingsPopoverPosition.left,
              width: settingsPopoverPosition.width,
            }}
            className="z-50 rounded-xl border border-border bg-card/95 backdrop-blur-lg p-3.5 shadow-xl text-left space-y-4 font-sans animate-scale-up"
          >
            {/* Density selection */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-1">Row Spacing</span>
              <div className="grid grid-cols-3 gap-1 bg-secondary/35 rounded-lg p-1">
                {["compact", "moderate", "relaxed"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDensity(opt as any)}
                    className={cn(
                      "rounded px-2 py-1 text-[10px] font-bold capitalize transition-all",
                      density === opt 
                        ? "bg-background text-foreground shadow-sm animate-scale-click" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility checkboxes */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-1">Visible Columns</span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 px-1 py-0.5 scrollbar-thin">
                {columns.map((col) => (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => toggleColumnVisibility(col.key)}
                    className="flex items-center gap-2 w-full text-left text-xs font-semibold text-foreground/80 hover:text-foreground animate-scale-click"
                  >
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-all shrink-0",
                      visibleColumns.has(col.key) 
                        ? "border-orange-500 bg-orange-500 text-white" 
                        : "border-border bg-transparent"
                    )}>
                      {visibleColumns.has(col.key) && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{col.header}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resets */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-bold">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-orange-500 hover:text-orange-600 animate-scale-click"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisibleColumns(new Set(columns.map(c => c.key)));
                  setDensity("moderate");
                  setShowSettingsPopover(false);
                }}
                className="text-muted-foreground hover:text-foreground animate-scale-click"
              >
                Reset Layout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Excel-style Columns Popover Subcomponent ---

interface ColumnPopoverProps {
  column: TableColumn<any>;
  data: any[];
  columnFilters: Record<string, string[]>;
  setColumnFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  popoverPosition: { top: number; left: number; width: number };
  handleSort: (key: string, direction: "asc" | "desc") => void;
  sortKey: string | null;
  sortDirection: "asc" | "desc" | null;
  setActivePopover: React.Dispatch<React.SetStateAction<string | null>>;
}

function ColumnPopover({
  column,
  data,
  columnFilters,
  setColumnFilters,
  popoverPosition,
  handleSort,
  sortKey,
  sortDirection,
  setActivePopover
}: ColumnPopoverProps) {
  
  const uniqueValues = useMemo(() => {
    const values = new Set<string>();
    data.forEach((row: any) => {
      const val = row[column.key];
      const valStr = val !== undefined && val !== null && val !== "" ? String(val) : "-";
      values.add(valStr);
    });
    return Array.from(values).sort();
  }, [data, column.key]);

  const [searchVal, setSearchVal] = useState("");

  const filteredValues = useMemo(() => {
    if (!searchVal) return uniqueValues;
    return uniqueValues.filter(v => v.toLowerCase().includes(searchVal.toLowerCase()));
  }, [uniqueValues, searchVal]);

  const activeFilter = columnFilters[column.key];

  const handleCheckboxChange = (value: string) => {
    const currentList = activeFilter ? [...activeFilter] : [...uniqueValues];
    const index = currentList.indexOf(value);
    
    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push(value);
    }

    setColumnFilters((prev) => {
      const next = { ...prev };
      if (currentList.length === uniqueValues.length) {
        delete next[column.key];
      } else {
        next[column.key] = currentList;
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      delete next[column.key];
      return next;
    });
  };

  const handleClearAll = () => {
    setColumnFilters((prev) => ({
      ...prev,
      [column.key]: []
    }));
  };

  const isChecked = (val: string) => {
    if (!activeFilter) return true;
    return activeFilter.includes(val);
  };

  const isSortedAsc = sortKey === column.key && sortDirection === "asc";
  const isSortedDesc = sortKey === column.key && sortDirection === "desc";

  return (
    <div
      id="column-settings-popover"
      style={{
        position: "fixed",
        top: popoverPosition.top,
        left: popoverPosition.left,
        width: popoverPosition.width,
      }}
      className="z-50 rounded-xl border border-border bg-card/95 backdrop-blur-lg p-3 shadow-xl text-left space-y-3 font-sans animate-scale-up"
    >
      {/* 1. Sorting */}
      {column.sortable !== false && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-2">Sort</span>
          <button
            type="button"
            onClick={() => {
              handleSort(column.key, "asc");
              setActivePopover(null);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-secondary/50 transition-colors animate-scale-click",
              isSortedAsc ? "text-orange-500 bg-orange-500/5" : "text-foreground/80 hover:text-foreground"
            )}
          >
            <span>Sort Ascending</span>
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              handleSort(column.key, "desc");
              setActivePopover(null);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-secondary/50 transition-colors animate-scale-click",
              isSortedDesc ? "text-orange-500 bg-orange-500/5" : "text-foreground/80 hover:text-foreground"
            )}
          >
            <span>Sort Descending</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Checklist values filter */}
      {column.filterable !== false && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-2">Filter Values</span>
          
          <div className="relative px-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              placeholder="Search values..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full rounded-md border border-border bg-background/50 pl-8 pr-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/45 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 px-1 py-1 scrollbar-thin">
            {filteredValues.length > 0 ? (
              filteredValues.map((val: string) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleCheckboxChange(val)}
                  className="flex items-center gap-2.5 w-full text-left text-xs text-foreground/80 hover:text-foreground font-semibold animate-scale-click"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-all shrink-0",
                    isChecked(val) 
                      ? "border-orange-500 bg-orange-500 text-white" 
                      : "border-border bg-transparent"
                  )}>
                    {isChecked(val) && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                  <span className="truncate">{val}</span>
                </button>
              ))
            ) : (
              <div className="text-[10px] text-muted-foreground/60 text-center py-2">No values match</div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 text-[10px] px-1 font-bold">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-muted-foreground hover:text-foreground animate-scale-click"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-orange-500 hover:text-orange-600 animate-scale-click"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Combined Table Wrapper component ---

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({ className, columns, data, title, description, defaultSort, actions, emptyState, children, ...props }, ref) => {
    if (columns && data) {
      return (
        <FlexibleTableInternal
          columns={columns}
          data={data}
          title={title}
          description={description}
          defaultSort={defaultSort}
          actions={actions}
          emptyState={emptyState}
          className={className}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full overflow-auto rounded-xl border border-border bg-card/40 backdrop-blur-md">
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

export {
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
