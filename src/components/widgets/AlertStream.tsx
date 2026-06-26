import { Siren, ArrowRight, Check, X } from "lucide-react";
import { useHub } from "@/store/hub";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";
import type { AlertItem } from "@/types";
import { useNavigate } from "react-router-dom";

interface AlertStreamProps {
  alerts?: AlertItem[];
  onSelect?: (alert: AlertItem) => void;
  compact?: boolean;
}

export function AlertStream({ alerts, onSelect, compact }: AlertStreamProps) {
  const allAlerts = useHub((s) => s.alerts);
  const elderly = useHub((s) => s.elderly);
  const session = useHub((s) => s.session);
  const resolveAlert = useHub((s) => s.resolveAlert);
  const markFalse = useHub((s) => s.markFalse);
  const nav = useNavigate();
  const list = (alerts ?? allAlerts).filter((a) => a.status === "待处置" || a.status === "处置中").slice(0, compact ? 5 : 8);
  const elderlyMap = new Map(elderly.map((e) => [e.id, e]));

  return (
    <div className="divide-y divide-ink-100/70">
      {list.length === 0 && (
        <div className="py-10 text-center text-[13px] text-ink-400">
          <div className="mx-auto h-10 w-10 rounded-full bg-safe/15 text-safe flex items-center justify-center mb-2">
            <Check className="h-5 w-5" />
          </div>
          所有告警已处置完毕
        </div>
      )}
      {list.map((a) => {
        const e = elderlyMap.get(a.elderlyId);
        const tone = a.level === "critical" ? "alert" : a.level === "warning" ? "warn" : "info";
        return (
          <div
            key={a.id}
            className={cn(
              "group flex items-stretch gap-3 py-3.5 cursor-pointer hover:bg-ink-50/40 -mx-1 px-1 rounded-xl transition",
              a.level === "critical" && "bg-alert/[0.03]",
            )}
            onClick={() => onSelect?.(a)}
          >
            <div
              className={cn(
                "w-1 rounded-full self-stretch",
                a.level === "critical" ? "bg-alert" : a.level === "warning" ? "bg-warn" : "bg-info",
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[12px] text-ink-400">
                <StatusDot tone={tone === "alert" ? "alert" : tone === "warn" ? "warn" : "info"} pulse={a.level === "critical"} />
                <span className="font-mono">{formatRelative(a.createdAt)}</span>
                <span>·</span>
                <span>{a.location}</span>
                <Badge tone={tone as "alert" | "warn" | "info"} className="ml-auto">{a.type}</Badge>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="text-[14px] font-semibold text-ink-600">{e?.name ?? "未知"}</div>
                <div className="text-[12px] text-ink-400">{e?.age} 岁 · {e?.gender}</div>
              </div>
              <div className="mt-1 text-[13px] text-ink-500 line-clamp-1">{a.message}</div>
            </div>
            <div className="flex flex-col items-end gap-1.5 self-center">
              <Badge tone={a.status === "待处置" ? "alert" : "warn"} variant="outline">{a.status}</Badge>
              {!compact && session && (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                  {a.status === "待处置" && (
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        resolveAlert(a.id, session.name, "已到达现场");
                      }}
                      className="h-7 w-7 rounded-lg bg-safe text-white flex items-center justify-center hover:bg-safe/90"
                      title="标记解决"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      markFalse(a.id, session.name);
                    }}
                    className="h-7 w-7 rounded-lg bg-ink-100 text-ink-500 flex items-center justify-center hover:bg-ink-200"
                    title="标记误报"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      nav(`/alerts?id=${a.id}`);
                    }}
                    className="h-7 px-2 rounded-lg bg-moss-700 text-sand-50 text-[11px] font-semibold flex items-center gap-1 hover:bg-moss-800"
                  >
                    处置 <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
