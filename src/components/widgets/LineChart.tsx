import { useMemo } from "react";

interface LineChartProps {
  series: { name: string; color: string; data: number[] }[];
  labels: string[];
  height?: number;
  yMin?: number;
  yMax?: number;
  unit?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function LineChart({
  series,
  labels,
  height = 220,
  yMin,
  yMax,
  showGrid = true,
  showLegend = true,
}: LineChartProps) {
  const W = 600;
  const H = height;
  const padL = 36;
  const padR = 12;
  const padT = 14;
  const padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const { allMin, allMax } = useMemo(() => {
    const all = series.flatMap((s) => s.data);
    return {
      allMin: yMin ?? Math.min(...all),
      allMax: yMax ?? Math.max(...all),
    };
  }, [series, yMin, yMax]);

  const range = allMax - allMin || 1;
  const xStep = innerW / Math.max(1, (labels.length - 1));

  const yPos = (v: number) => padT + innerH - ((v - allMin) / range) * innerH;
  const xPos = (i: number) => padL + i * xStep;

  const gridLines = 4;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" className="block">
        {/* Grid */}
        {showGrid &&
          Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = padT + (innerH / gridLines) * i;
            const value = allMax - (range / gridLines) * i;
            return (
              <g key={i}>
                <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#E2E4E1" strokeDasharray="2 4" strokeWidth={1} />
                <text x={padL - 6} y={y + 3} fontSize="9" textAnchor="end" fill="#8E9489" fontFamily="JetBrains Mono">
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

        {/* X labels */}
        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 6) === 0 ? (
            <text
              key={i}
              x={xPos(i)}
              y={H - 6}
              fontSize="9"
              textAnchor="middle"
              fill="#8E9489"
              fontFamily="JetBrains Mono"
            >
              {l}
            </text>
          ) : null,
        )}

        {/* Series */}
        {series.map((s, si) => {
          const path = s.data
            .map((v, i) => `${i === 0 ? "M" : "L"} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`)
            .join(" ");
          return (
            <g key={si}>
              <path d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {s.data.length > 0 && (
                <circle
                  cx={xPos(s.data.length - 1)}
                  cy={yPos(s.data[s.data.length - 1])}
                  r={3}
                  fill={s.color}
                  stroke="white"
                  strokeWidth={1.5}
                />
              )}
            </g>
          );
        })}
      </svg>

      {showLegend && (
        <div className="flex flex-wrap gap-4 px-2 pt-1 text-[12px] text-ink-500">
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
