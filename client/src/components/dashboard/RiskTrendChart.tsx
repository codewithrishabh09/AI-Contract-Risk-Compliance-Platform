import { useMemo, useState } from "react";

import type { DashboardTrendPoint } from "../../types/dashboard";

interface RiskTrendChartProps {
  data: DashboardTrendPoint[];
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  date: string;
}

const WIDTH = 760;
const HEIGHT = 240;

const PADDING = {
  top: 20,
  right: 20,
  bottom: 36,
  left: 42,
};

const CHART_WIDTH =
  WIDTH - PADDING.left - PADDING.right;

const CHART_HEIGHT =
  HEIGHT - PADDING.top - PADDING.bottom;

const GRID_LINES = [0, 25, 50, 75, 100];

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function RiskTrendChart({
  data,
}: RiskTrendChartProps) {
  const [activePoint, setActivePoint] =
    useState<ChartPoint | null>(null);

  const chartPoints = useMemo<ChartPoint[]>(() => {
    if (data.length === 0) {
      return [];
    }

    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    );

    return sortedData.map((point, index) => {
      const x =
        sortedData.length === 1
          ? PADDING.left + CHART_WIDTH / 2
          : PADDING.left +
            (index / (sortedData.length - 1)) *
              CHART_WIDTH;

      const clampedScore = Math.max(
        0,
        Math.min(100, point.risk_score),
      );

      const y =
        PADDING.top +
        CHART_HEIGHT -
        (clampedScore / 100) * CHART_HEIGHT;

      return {
        x,
        y,
        value: clampedScore,
        date: point.date,
      };
    });
  }, [data]);

  const linePath = useMemo(() => {
    if (chartPoints.length === 0) {
      return "";
    }

    if (chartPoints.length === 1) {
      return `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    }

    return chartPoints
      .map((point, index) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`;
        }

        return `L ${point.x} ${point.y}`;
      })
      .join(" ");
  }, [chartPoints]);

  const areaPath = useMemo(() => {
    if (chartPoints.length < 2) {
      return "";
    }

    const firstPoint = chartPoints[0];
    const lastPoint =
      chartPoints[chartPoints.length - 1];

    return [
      `M ${firstPoint.x} ${
        PADDING.top + CHART_HEIGHT
      }`,
      `L ${firstPoint.x} ${firstPoint.y}`,
      chartPoints
        .slice(1)
        .map(
          (point) =>
            `L ${point.x} ${point.y}`,
        )
        .join(" "),
      `L ${lastPoint.x} ${
        PADDING.top + CHART_HEIGHT
      }`,
      "Z",
    ].join(" ");
  }, [chartPoints]);

  if (data.length === 0) {
    return (
      <div
        className="
          flex h-60 items-center justify-center
          rounded-[14px]
          border border-dashed border-[#d8d9d0]
          bg-[#f8f7f2]
        "
      >
        <div className="text-center">
          <p className="text-xs font-semibold text-[#687268]">
            No risk trend data available
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#8a9188]">
            Risk activity will appear here after contracts are analyzed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="
          relative h-60 w-full overflow-hidden
          rounded-[14px]
          border border-[#e2e1d8]
          bg-[#faf9f5]
        "
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          role="img"
          aria-label="Contract risk score trend"
        >
          <defs>
            <linearGradient
              id="risk-area-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="rgba(113, 128, 96, 0.20)"
              />

              <stop
                offset="100%"
                stopColor="rgba(113, 128, 96, 0)"
              />
            </linearGradient>
          </defs>

          {/* Horizontal grid */}
          {GRID_LINES.map((value) => {
            const y =
              PADDING.top +
              CHART_HEIGHT -
              (value / 100) * CHART_HEIGHT;

            return (
              <g key={value}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(36, 48, 39, 0.08)"
                  strokeDasharray="3 5"
                />

                <text
                  x={PADDING.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#8a9188"
                  fontSize="9"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area */}
          {areaPath ? (
            <path
              d={areaPath}
              fill="url(#risk-area-gradient)"
            />
          ) : null}

          {/* Trend line */}
          {linePath ? (
            <path
              d={linePath}
              fill="none"
              stroke="#718060"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Points */}
          {chartPoints.map((point, index) => (
            <g key={`${point.date}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() =>
                  setActivePoint(point)
                }
                onMouseLeave={() =>
                  setActivePoint(null)
                }
              />

              <circle
                cx={point.x}
                cy={point.y}
                r="3.5"
                fill="#718060"
                stroke="#faf9f5"
                strokeWidth="2"
                className="pointer-events-none"
              />
            </g>
          ))}

          {/* Date labels */}
          {chartPoints.map((point, index) => {
            const shouldShow =
              chartPoints.length <= 6 ||
              index === 0 ||
              index ===
                chartPoints.length - 1 ||
              index % 2 === 0;

            if (!shouldShow) {
              return null;
            }

            return (
              <text
                key={`date-${point.date}-${index}`}
                x={point.x}
                y={HEIGHT - 10}
                textAnchor="middle"
                fill="#8a9188"
                fontSize="9"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {activePoint ? (
          <div
            className="
              pointer-events-none absolute z-10
              rounded-[10px]
              border border-[#d7d9d0]
              bg-[#fffefa]
              px-3 py-2
              shadow-[0_12px_30px_rgba(36,48,39,0.12)]
            "
            style={{
              left: `${(activePoint.x / WIDTH) * 100}%`,
              top: `${(activePoint.y / HEIGHT) * 100}%`,
              transform: "translate(-50%, -115%)",
            }}
          >
            <div className="text-[10px] font-medium text-[#7a8379]">
              {formatDate(activePoint.date)}
            </div>

            <div className="mt-0.5 text-sm font-semibold text-[#243027]">
              Risk score: {activePoint.value}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#718060]" />

          <span className="text-[10px] text-[#7a8379]">
            Average risk score
          </span>
        </div>

        <span className="text-[10px] text-[#8a9188]">
          Scale: 0–100
        </span>
      </div>
    </div>
  );
}

export default RiskTrendChart;