import { useHub } from "@/store/hub";
import { Link } from "react-router-dom";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { initials } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const ringByRisk: Record<RiskLevel, string> = {
  high: "ring-alert/40 border-alert/30",
  medium: "ring-warn/40 border-warn/30",
  low: "ring-safe/40 border-safe/30",
};

const chipByRisk: Record<RiskLevel, "alert" | "warn" | "safe"> = {
  high: "alert",
  medium: "warn",
  low: "safe",
};

interface AvatarProps {
  name: string;
  size?: number;
  ring?: RiskLevel;
  className?: string;
}

export function Avatar({ name, size = 40, ring, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl font-display font-semibold text-sand-50 bg-gradient-to-br from-moss-500 to-moss-700",
        ring && `ring-2 border-2 ${ringByRisk[ring]}`,
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initials(name)}
    </div>
  );
}

interface ElderCardProps {
  id: string;
  to?: string;
  showVitals?: boolean;
}

export function ElderCard({ id, to = `/elderly/${id}`, showVitals = true }: ElderCardProps) {
  const e = useHub((s) => s.elderly.find((x) => x.id === id));
  const v = useHub((s) => s.vitals[id]);
  if (!e) return null;
  return (
    <Link
      to={to}
      className="card p-4 flex items-center gap-3 hover:shadow-soft transition hover:-translate-y-0.5 duration-200"
    >
      <Avatar name={e.name} size={48} ring={e.riskLevel} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-[14.5px] text-ink-600 truncate">{e.name}</div>
          <Badge tone={chipByRisk[e.riskLevel]} className="text-[10px]">
            <StatusDot tone={e.riskLevel === "high" ? "alert" : e.riskLevel === "medium" ? "warn" : "safe"} />
            {e.riskLevel === "high" ? "高风险" : e.riskLevel === "medium" ? "关注" : "稳定"}
          </Badge>
        </div>
        <div className="text-[12px] text-ink-400 mt-0.5">
          {e.age} 岁 · {e.gender} · {e.careLevel} · {e.chronic[0] ?? "无慢病"}
        </div>
        {showVitals && v && (
          <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-ink-500">
            <span className="rounded-md bg-ink-50 px-1.5 py-0.5">HR {v.heartRate}</span>
            <span className="rounded-md bg-ink-50 px-1.5 py-0.5">SpO₂ {v.spo2}</span>
            <span className="rounded-md bg-ink-50 px-1.5 py-0.5">BP {v.systolic}/{v.diastolic}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
