import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartDataItem {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartDataItem[];
  className?: string;
  prefix?: string;
}

export function AreaChart({ data = [], className, prefix = "" }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-muted-foreground">
        No data available
      </div>
    );
  }

  const svgWidth = 600;
  const svgHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.value), 10);
  const minVal = 0;
  const valRange = maxVal - minVal;

  // Generate coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minVal) / valRange) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // SVG Paths
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
    areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Y Axis ticks
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }).map((_, idx) => {
    const val = minVal + (idx / (yTicksCount - 1)) * valRange;
    const y = paddingTop + chartHeight - (idx / (yTicksCount - 1)) * chartHeight;
    return { val, y };
  });

  return (
    <div className={cn("relative w-full select-none", className)}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={paddingLeft}
            y1={tick.y}
            x2={svgWidth - paddingRight}
            y2={tick.y}
            className="stroke-border/30"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Y Axis Labels */}
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={paddingLeft - 10}
            y={tick.y + 4}
            textAnchor="end"
            className="fill-muted-foreground/80 font-bold text-[10px]"
          >
            {prefix}{Math.round(tick.val)}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Line Path */}
        <path
          d={linePath}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X Axis labels */}
        {points.map((p, i) => {
          const mod = Math.max(Math.floor(data.length / 6), 1);
          if (i % mod !== 0 && i !== data.length - 1) return null;

          return (
            <text
              key={i}
              x={p.x}
              y={svgHeight - 15}
              textAnchor="middle"
              className="fill-muted-foreground/80 font-bold text-[10px]"
            >
              {p.label}
            </text>
          );
        })}

        {/* Hover elements */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <>
            {/* Dotted Vertical Line */}
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartHeight}
              className="stroke-orange-500/40"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            {/* Glowing outer circle */}
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].y}
              r="7"
              className="fill-orange-500/20 stroke-orange-500/40"
              strokeWidth="1.5"
            />
            {/* Center dot */}
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].y}
              r="4"
              className="fill-orange-500 stroke-card"
              strokeWidth="1.5"
            />
          </>
        )}

        {/* Invisible columns for hover trigger */}
        {points.map((p, idx) => {
          const colWidth = chartWidth / (data.length - 1 || 1);
          const xStart = p.x - colWidth / 2;
          return (
            <rect
              key={idx}
              x={xStart}
              y={paddingTop}
              width={colWidth}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer font-bold"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>

      {/* Floating HTML Tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute z-10 rounded-lg border border-border bg-card px-3 py-1.5 shadow-xl backdrop-blur-md text-[11px] font-bold text-foreground transition-all duration-100 ease-out pointer-events-none"
          style={{
            left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
            top: `${(points[hoveredIndex].y / svgHeight) * 100 - 20}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5">
            {points[hoveredIndex].label}
          </div>
          <div>
            {prefix}{points[hoveredIndex].value.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

export function BarChart({ data = [], className, prefix = "" }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-muted-foreground">
        No data available
      </div>
    );
  }

  const svgWidth = 600;
  const svgHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.value), 10);
  const minVal = 0;
  const valRange = maxVal - minVal;

  const barGap = 16;
  const totalGapsWidth = barGap * (data.length - 1 || 1);
  const barWidth = (chartWidth - totalGapsWidth) / data.length;

  const bars = data.map((d, index) => {
    const x = paddingLeft + index * (barWidth + barGap);
    const height = ((d.value - minVal) / valRange) * chartHeight;
    const y = paddingTop + chartHeight - height;
    return { x, y, width: barWidth, height, label: d.label, value: d.value };
  });

  const yTicks = Array.from({ length: 4 }).map((_, idx) => {
    const val = minVal + (idx / 3) * valRange;
    const y = paddingTop + chartHeight - (idx / 3) * chartHeight;
    return { val, y };
  });

  return (
    <div className={cn("relative w-full select-none", className)}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={paddingLeft}
            y1={tick.y}
            x2={svgWidth - paddingRight}
            y2={tick.y}
            className="stroke-border/30"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Y Axis Labels */}
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={paddingLeft - 10}
            y={tick.y + 4}
            textAnchor="end"
            className="fill-muted-foreground/80 font-bold text-[10px]"
          >
            {prefix}{Math.round(tick.val)}
          </text>
        ))}

        {/* Render Bars */}
        {bars.map((bar, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g key={idx}>
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={Math.max(bar.height, 4)}
                rx="4"
                fill="url(#barGradient)"
                className="transition-all duration-300 cursor-pointer"
                opacity={hoveredIndex === null || isHovered ? 1 : 0.6}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {isHovered && (
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height="4"
                  rx="2"
                  className="fill-white"
                />
              )}
            </g>
          );
        })}

        {/* X Axis Labels */}
        {bars.map((bar, i) => {
          const mod = Math.max(Math.floor(data.length / 8), 1);
          if (i % mod !== 0 && i !== data.length - 1) return null;

          return (
            <text
              key={i}
              x={bar.x + bar.width / 2}
              y={svgHeight - 15}
              textAnchor="middle"
              className="fill-muted-foreground/80 font-bold text-[10px]"
            >
              {bar.label}
            </text>
          );
        })}
      </svg>

      {/* Floating HTML Tooltip */}
      {hoveredIndex !== null && bars[hoveredIndex] && (
        <div
          className="absolute z-10 rounded-lg border border-border bg-card px-3 py-1.5 shadow-xl backdrop-blur-md text-[11px] font-bold text-foreground transition-all duration-100 ease-out pointer-events-none"
          style={{
            left: `${((bars[hoveredIndex].x + bars[hoveredIndex].width / 2) / svgWidth) * 100}%`,
            top: `${(bars[hoveredIndex].y / svgHeight) * 100 - 15}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5">
            {bars[hoveredIndex].label}
          </div>
          <div>
            {prefix}{bars[hoveredIndex].value.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
