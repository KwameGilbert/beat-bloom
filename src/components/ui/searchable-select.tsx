import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string | number;
  label: string;
  [key: string]: any;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  emptyMessage?: string;
}

const SearchableSelect = React.forwardRef<HTMLDivElement, SearchableSelectProps>(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      label,
      helperText,
      error,
      disabled = false,
      clearable = true,
      className,
      emptyMessage = "No results found.",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    // Selected option object
    const selectedOption = React.useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value]
    );

    // Filtered options based on search query
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    // Close dropdown on click outside
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset highlighted index when options change
    React.useEffect(() => {
      setHighlightedIndex(0);
    }, [filteredOptions]);

    // Focus input when dropdown opens
    React.useEffect(() => {
      if (isOpen && inputRef.current) {
        // Delay slightly for transition animation
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        setSearchQuery("");
      }
    }, [isOpen]);

    const handleSelect = React.useCallback(
      (val: string | number) => {
        if (onChange) {
          onChange(val);
        }
        setIsOpen(false);
      },
      [onChange]
    );

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onChange) {
          onChange("");
        }
      },
      [onChange]
    );

    // Keyboard handlers
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev + 1 < filteredOptions.length ? prev + 1 : prev
          );
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (isOpen) {
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
        } else {
          setIsOpen(true);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (isOpen && listRef.current) {
        const listEl = listRef.current;
        const highlightedEl = listEl.children[highlightedIndex] as HTMLElement;

        if (highlightedEl) {
          const listHeight = listEl.clientHeight;
          const listScrollTop = listEl.scrollTop;
          const elHeight = highlightedEl.clientHeight;
          const elOffsetTop = highlightedEl.offsetTop;

          if (elOffsetTop < listScrollTop) {
            listEl.scrollTop = elOffsetTop;
          } else if (elOffsetTop + elHeight > listScrollTop + listHeight) {
            listEl.scrollTop = elOffsetTop + elHeight - listHeight;
          }
        }
      }
    }, [highlightedIndex, isOpen]);

    return (
      <div
        ref={containerRef}
        className={cn("w-full space-y-1.5 text-left relative", className)}
        onKeyDown={handleKeyDown}
      >
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {/* Dropdown Trigger */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full flex items-center justify-between rounded-lg border bg-card/40 py-3 pl-4 pr-10 text-sm text-left transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50",
              isOpen ? "border-orange-500 ring-2 ring-orange-500/20" : "border-border",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
              !selectedOption ? "text-muted-foreground/60" : "text-foreground"
            )}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground/85">
              {clearable && selectedOption && !disabled && (
                <span
                  onClick={handleClear}
                  className="p-0.5 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen ? "rotate-180 text-orange-500" : ""
                )}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1.5 w-full rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-100 overflow-hidden">
              {/* Search Bar */}
              <div className="flex items-center border-b border-border px-3.5 py-2.5">
                <Search className="h-4 w-4 mr-2.5 text-muted-foreground/70 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:cursor-not-allowed"
                />
              </div>

              {/* Options List */}
              <div
                ref={listRef}
                className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground/80 italic text-center">
                    {emptyMessage}
                  </div>
                ) : (
                  filteredOptions.map((opt, index) => {
                    const isSelected = opt.value === value;
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors",
                          isSelected
                            ? "bg-orange-500/10 text-orange-500 font-medium"
                            : "text-foreground",
                          isHighlighted && !isSelected
                            ? "bg-secondary/70 text-foreground"
                            : "",
                          isHighlighted && isSelected ? "bg-orange-500/15" : ""
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-orange-500 shrink-0 ml-2 animate-in fade-in zoom-in-90 duration-150" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground/80">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";

export { SearchableSelect };
