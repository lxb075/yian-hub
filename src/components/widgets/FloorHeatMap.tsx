import { useHub } from "@/store/hub";
import { cn } from "@/lib/utils";

const colorByStatus: Record<string, { bg: string; text: string; ring: string }> = {
  high: { bg: "bg-alert/85", text: "text-white", ring: "ring-alert/30" },
  medium: { bg: "bg-warn/80", text: "text-ink-600", ring: "ring-warn/30" },
  low: { bg: "bg-safe/70", text: "text-white", ring: "ring-safe/30" },
  empty: { bg: "bg-ink-50", text: "text-ink-300", ring: "ring-ink-100" },
};

export function FloorHeatMap() {
  const floors = useHub((s) => s.floorStatus);
  const elderly = useHub((s) => s.elderly);
  const elderlyMap = new Map(elderly.map((e) => [e.id, e]));

  return (
    <div className="space-y-5">
      {floors.map((f) => (
        <div key={f.floor} className="flex items-stretch gap-3">
          <div className="w-12 shrink-0 flex flex-col items-center justify-center text-ink-400">
            <div className="text-[10px] uppercase tracking-[0.18em]">FLOOR</div>
            <div className="font-display text-[28px] font-semibold text-ink-600 leading-none">{f.floor}</div>
            <div className="mt-1 text-[10px] text-ink-400 font-mono">{f.rooms.filter((r) => r.elderlyId).length} 位</div>
          </div>
          <div className="flex-1 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {f.rooms.map((r) => {
              const status = (r.status as keyof typeof colorByStatus) ?? "empty";
              const c = colorByStatus[status];
              const e = r.elderlyId ? elderlyMap.get(r.elderlyId) : undefined;
              return (
                <div
                  key={r.id}
                  className={cn(
                    "relative rounded-xl p-2.5 min-h-[72px] transition hover:scale-[1.02]",
                    c.bg,
                    c.text,
                    status !== "empty" && "shadow-card",
                  )}
                  title={e ? `${e.name} · ${e.roomId}` : "空置"}
                >
                  <div className="text-[10px] font-mono opacity-70">{r.number}</div>
                  {e ? (
                    <div className="mt-1">
                      <div className="text-[13px] font-semibold leading-tight truncate">{e.name}</div>
                      <div className="text-[10px] opacity-80">{e.careLevel} · {e.chronic[0] ?? "无慢病"}</div>
                    </div>
                  ) : (
                    <div className="text-[12px] mt-2 opacity-50">空</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
