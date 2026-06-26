import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
  showDots?: boolean;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  stroke = "#2F4A3A",
  fill = "rgba(47,74,58,0.12)",
  className,
  showDots = false,
}: SparklineProps) {
  const { path, area, last } = useMemo(() => {
    if (!data.length) return { path: "", area: "", last: { x: 0, y: 0 } };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1 || 1);
    const points = data.map((v, i) => ({
      x: i * stepX,
      y: height - ((v - min) / range) * (height - 4) - 2,
    }));
    const path = points
      .map((p, i) => (i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`))
      .join(" ");
    const area = `${path} L ${width.toFixed(1)} ${height.toFixed(1)} L 0 ${height.toFixed(1)} Z`;
    return { path, area, last: points[points.length - 1] };
  }, [data, width, height]);

  return (
    <svg width={width} height={height} className={cn("overflow-visible", className)}>
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {showDots && <circle cx={last.x} cy={last.y} r={2.5} fill={stroke} />}
    </svg>
  );
}
