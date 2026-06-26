import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Grid3x3, List, Filter, ChevronRight } from "lucide-react";
import { useHub } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/widgets/ElderCard";
import { cn } from "@/lib/utils";
import type { CareLevel, RiskLevel } from "@/types";

const riskFilters: { id: RiskLevel | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "high", label: "高风险" },
  { id: "medium", label: "关注" },
  { id: "low", label: "稳定" },
];

const careFilters: { id: CareLevel | "all"; label: string }[] = [
  { id: "all", label: "全部护理等级" },
  { id: "特级", label: "特级" },
  { id: "一级", label: "一级" },
  { id: "二级", label: "二级" },
  { id: "三级", label: "三级" },
];

export default function ElderlyList() {
  const elderly = useHub((s) => s.elderly);
  const vitals = useHub((s) => s.vitals);
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState<RiskLevel | "all">("all");
  const [care, setCare] = useState<CareLevel | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return elderly.filter((e) => {
      if (q && !`${e.name}${e.id}${e.chronic.join("")}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (risk !== "all" && e.riskLevel !== risk) return false;
      if (care !== "all" && e.careLevel !== care) return false;
      return true;
    });
  }, [elderly, q, risk, care]);

  return (
    <div className="space-y-5 stagger">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">Resident Profile</div>
          <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">
            颐养在册 · <span className="italic">{filtered.length}</span> 位长者
          </h2>
          <p className="text-[13px] text-ink-500 mt-1">每位长者均配有专属责任护士与值班医生，健康档案自动沉淀。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<Filter className="h-4 w-4" />}>导出</Button>
          <Button icon={<Plus className="h-4 w-4" />}>新增入住</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <label className="flex-1 flex items-center h-10 rounded-xl border border-ink-100 bg-white/60 px-3 focus-within:border-moss-700/60">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索姓名 / 编号 / 慢病"
              className="ml-2 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-300"
            />
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {riskFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setRisk(f.id)}
                className={cn(
                  "h-9 px-3 rounded-full text-[12.5px] font-medium border transition",
                  risk === f.id
                    ? "bg-moss-700 text-sand-50 border-moss-700"
                    : "bg-white/60 text-ink-500 border-ink-100 hover:border-moss-700/40",
                )}
              >
                {f.label}
              </button>
            ))}
            <select
              value={care}
              onChange={(e) => setCare(e.target.value as CareLevel | "all")}
              className="h-9 px-3 rounded-full text-[12.5px] border border-ink-100 bg-white/60 text-ink-500 focus:outline-none focus:border-moss-700/40"
            >
              {careFilters.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <div className="ml-auto flex items-center gap-1 rounded-xl border border-ink-100 bg-white/60 p-1">
              <button
                onClick={() => setView("grid")}
                className={cn("h-7 w-7 rounded-lg flex items-center justify-center", view === "grid" ? "bg-moss-700 text-sand-50" : "text-ink-400")}
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("h-7 w-7 rounded-lg flex items-center justify-center", view === "list" ? "bg-moss-700 text-sand-50" : "text-ink-400")}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => {
            const v = vitals[e.id];
            return (
              <Link
                key={e.id}
                to={`/elderly/${e.id}`}
                className="card p-5 hover:shadow-soft transition hover:-translate-y-0.5 duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <Avatar name={e.name} size={56} ring={e.riskLevel} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-display text-[20px] font-semibold text-ink-600 leading-none">{e.name}</div>
                      <Badge tone={e.riskLevel === "high" ? "alert" : e.riskLevel === "medium" ? "warn" : "safe"}>
                        {e.riskLevel === "high" ? "高风险" : e.riskLevel === "medium" ? "关注" : "稳定"}
                      </Badge>
                      <Badge tone="ink" className="ml-auto">{e.id}</Badge>
                    </div>
                    <div className="text-[12.5px] text-ink-500 mt-1">
                      {e.age} 岁 · {e.gender} · 房间 {e.roomId.replace("R", "")} 床位 {e.bedNo}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.chronic.map((c) => (
                        <span key={c} className="rounded-md bg-ink-50 px-2 py-0.5 text-[11px] text-ink-500">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-ink-100/70 grid grid-cols-3 gap-3 text-center">
                  <Stat label="心率" value={v?.heartRate} unit="bpm" />
                  <Stat label="SpO₂" value={v?.spo2} unit="%" />
                  <Stat label="血压" value={v ? `${v.systolic}/${v.diastolic}` : "—"} unit="mmHg" />
                </div>
                <div className="mt-3 flex items-center justify-between text-[12px]">
                  <span className="text-ink-400">护理等级 · {e.careLevel}</span>
                  <span className="text-moss-700 inline-flex items-center gap-1 group-hover:underline">
                    详细档案 <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card noPad>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[11px] uppercase tracking-[0.16em] text-ink-400 bg-sand-100/60">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">长者</th>
                  <th className="text-left px-4 py-3 font-medium">风险/护理</th>
                  <th className="text-left px-4 py-3 font-medium">房间</th>
                  <th className="text-left px-4 py-3 font-medium">实时体征</th>
                  <th className="text-left px-4 py-3 font-medium">责任医生 / 护士</th>
                  <th className="text-left px-4 py-3 font-medium">入住时间</th>
                  <th className="text-right px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100/70">
                {filtered.map((e) => {
                  const v = vitals[e.id];
                  return (
                    <tr key={e.id} className="hover:bg-sand-50/60 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={e.name} size={36} />
                          <div>
                            <div className="font-semibold text-ink-600">{e.name}</div>
                            <div className="text-[11px] text-ink-400">{e.age} 岁 · {e.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge tone={e.riskLevel === "high" ? "alert" : e.riskLevel === "medium" ? "warn" : "safe"}>
                            {e.riskLevel === "high" ? "高风险" : e.riskLevel === "medium" ? "关注" : "稳定"}
                          </Badge>
                          <span className="text-[11px] text-ink-400">{e.careLevel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-ink-500">
                        {e.roomId.replace("R", "")} · {e.bedNo}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-[12px] text-ink-600">
                          HR {v?.heartRate} · SpO₂ {v?.spo2} · BP {v?.systolic}/{v?.diastolic}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-500 text-[12.5px]">
                        医 S007 · 护 {e.primaryNurse.replace("S", "")}
                      </td>
                      <td className="px-4 py-3 text-ink-500 font-mono text-[12px]">{e.admissionAt}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/elderly/${e.id}`} className="text-moss-700 inline-flex items-center gap-1 hover:underline">
                          档案 <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value?: number | string; unit: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-400">{label}</div>
      <div className="font-display text-[18px] font-semibold text-ink-600 tabular leading-tight">
        {value ?? "—"}
        <span className="text-[10px] text-ink-400 ml-0.5 font-sans">{unit}</span>
      </div>
    </div>
  );
}
