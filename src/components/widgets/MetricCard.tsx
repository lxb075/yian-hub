import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Sparkline } from "./Sparkline";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  trend?: number; // percent
  series?: number[];
  tone?: "moss" | "sand" | "alert" | "warn" | "safe" | "info";
  hint?: string;
}

const toneToColor: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  moss: "#2F4A3A",
  sand: "#C8A45C",
  alert: "#C8553D",
  warn: "#D9A441",
  safe: "#7FB59C",
  info: "#5A6B7B",
};

export function MetricCard({ label, value, unit, trend, series, tone = "moss", hint }: MetricCardProps) {
  const color = toneToColor[tone];
  const up = (trend ?? 0) >= 0;
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center justify-between">
        <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400 font-medium">{label}</div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-[11px] font-mono font-medium",
              up ? "text-safe" : "text-alert",
            )}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-display text-[42px] font-semibold text-ink-600 tabular leading-none">{value}</span>
        {unit && <span className="text-[13px] text-ink-400 font-mono">{unit}</span>}
      </div>
      {hint && <div className="mt-1 text-[12px] text-ink-400">{hint}</div>}
      {series && series.length > 1 && (
        <div className="mt-3 -mb-1">
          <Sparkline data={series} width={220} height={32} stroke={color} fill={`${color}22`} />
        </div>
      )}
    </Card>
  );
}
