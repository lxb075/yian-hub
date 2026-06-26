import { useMemo, useState } from "react";
import { useHub } from "@/store/hub";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/widgets/ElderCard";
import { X, Check, Phone, Video, MapPin, ChevronRight, Filter, Search, Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime, formatRelative } from "@/utils/format";
import type { AlertItem, AlertLevel, AlertStatus, AlertType } from "@/types";

const levelTone: Record<AlertLevel, "alert" | "warn" | "info"> = {
  critical: "alert",
  warning: "warn",
  info: "info",
};

const statusTone: Record<AlertStatus, "alert" | "warn" | "safe" | "ink"> = {
  待处置: "alert",
  处置中: "warn",
  已解决: "safe",
  误报: "ink",
};

const typeOptions: AlertType[] = ["SOS 紧急呼叫", "跌倒检测", "心率异常", "血压异常", "血氧偏低", "体温异常", "长时间未活动", "用药未确认", "设备离线", "越界离开"];

export default function Alerts() {
  const alerts = useHub((s) => s.alerts);
  const elderly = useHub((s) => s.elderly);
  const staff = useHub((s) => s.staff);
  const session = useHub((s) => s.session);
  const resolveAlert = useHub((s) => s.resolveAlert);
  const markFalse = useHub((s) => s.markFalse);
  const assignAlert = useHub((s) => s.assignAlert);

  const [sp] = useSearchParams();
  const idParam = sp.get("id");
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<AlertLevel | "all">("all");
  const [status, setStatus] = useState<AlertStatus | "all">("all");
  const [type, setType] = useState<AlertType | "all">("all");
  const [openId, setOpenId] = useState<string | null>(idParam);

  const elderlyMap = new Map(elderly.map((e) => [e.id, e]));
  const staffMap = new Map(staff.map((s) => [s.id, s]));

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (level !== "all" && a.level !== level) return false;
      if (status !== "all" && a.status !== status) return false;
      if (type !== "all" && a.type !== type) return false;
      if (q) {
        const e = elderlyMap.get(a.elderlyId);
        if (!`${a.type}${a.message}${e?.name ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [alerts, level, status, type, q, elderlyMap]);

  const opened = openId ? alerts.find((a) => a.id === openId) : null;
  const openedElderly = opened ? elderlyMap.get(opened.elderlyId) : undefined;
  const openedAssignee = opened?.assigneeId ? staffMap.get(opened.assigneeId) : undefined;

  const counts = useMemo(() => {
    return {
      all: alerts.length,
      critical: alerts.filter((a) => a.level === "critical").length,
      warning: alerts.filter((a) => a.level === "warning").length,
      info: alerts.filter((a) => a.level === "info").length,
      pending: alerts.filter((a) => a.status === "待处置").length,
      resolved: alerts.filter((a) => a.status === "已解决").length,
    };
  }, [alerts]);

  return (
    <div className="space-y-5 stagger">
      <div>
        <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">AI Triage Workflow</div>
        <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">智能告警中心</h2>
        <p className="text-[13px] text-ink-500 mt-1">AI 自动分级 · 责任护士派单 · 处置时间线留痕 · 家属自动通知</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-alert/8 to-transparent border-alert/20">
          <div className="text-[12px] uppercase tracking-[0.16em] text-alert">紧急事件</div>
          <div className="mt-1 font-display text-[32px] font-semibold text-ink-600 tabular leading-none">
            {alerts.filter((a) => a.level === "critical" && a.status !== "已解决" && a.status !== "误报").length}
          </div>
          <div className="text-[12px] text-ink-400 mt-1">需立即响应</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-warn">待处置</div>
          <div className="mt-1 font-display text-[32px] font-semibold text-ink-600 tabular leading-none">{counts.pending}</div>
          <div className="text-[12px] text-ink-400 mt-1">30 分钟内闭环</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-info">今日总览</div>
          <div className="mt-1 font-display text-[32px] font-semibold text-ink-600 tabular leading-none">{counts.all}</div>
          <div className="text-[12px] text-ink-400 mt-1">含历史已闭环</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-safe">闭环率</div>
          <div className="mt-1 font-display text-[32px] font-semibold text-ink-600 tabular leading-none">
            {Math.round((counts.resolved / Math.max(1, counts.all)) * 100)}<span className="text-[16px]">%</span>
          </div>
          <div className="text-[12px] text-ink-400 mt-1">平均 6.2 分钟</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center mb-3">
          <label className="flex-1 flex items-center h-10 rounded-xl border border-ink-100 bg-white/60 px-3 focus-within:border-moss-700/60">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索告警类型 / 长者姓名 / 关键词"
              className="ml-2 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-300"
            />
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AlertType | "all")}
            className="h-10 px-3 rounded-xl border border-ink-100 bg-white/60 text-[12.5px] text-ink-500"
          >
            <option value="all">全部类型</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `全部 ${counts.all}` },
            { id: "critical", label: `紧急 ${counts.critical}` },
            { id: "warning", label: `警告 ${counts.warning}` },
            { id: "info", label: `提示 ${counts.info}` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setLevel(f.id as AlertLevel | "all")}
              className={cn(
                "h-9 px-3 rounded-full text-[12.5px] font-medium border transition inline-flex items-center gap-1.5",
                level === f.id
                  ? "bg-moss-700 text-sand-50 border-moss-700"
                  : "bg-white/60 text-ink-500 border-ink-100 hover:border-moss-700/40",
              )}
            >
              {f.id === "critical" && <Siren className="h-3.5 w-3.5" />}
              {f.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {(["all", "待处置", "处置中", "已解决", "误报"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s as AlertStatus | "all")}
                className={cn(
                  "h-8 px-2.5 rounded-lg text-[12px] font-medium transition",
                  status === s ? "bg-sand-100 text-ink-600" : "text-ink-400 hover:text-ink-600",
                )}
              >
                {s === "all" ? "全部状态" : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card noPad className={cn("xl:col-span-2", opened && "xl:col-span-1")}>
          <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-ink-100/70">
            <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">告警列表 · {filtered.length}</div>
            <Button variant="ghost" size="sm" icon={<Filter className="h-3.5 w-3.5" />}>高级筛选</Button>
          </div>
          <div className="divide-y divide-ink-100/70 max-h-[640px] overflow-y-auto">
            {filtered.map((a) => {
              const e = elderlyMap.get(a.elderlyId);
              return (
                <button
                  key={a.id}
                  onClick={() => setOpenId(a.id)}
                  className={cn(
                    "w-full text-left flex items-stretch gap-3 p-4 transition",
                    openId === a.id ? "bg-moss-50/60" : "hover:bg-sand-50/60",
                  )}
                >
                  <div className={cn("w-1 rounded-full self-stretch", a.level === "critical" ? "bg-alert" : a.level === "warning" ? "bg-warn" : "bg-info")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[12px] text-ink-400">
                      <Badge tone={levelTone[a.level]}>{a.type}</Badge>
                      <span className="font-mono">{a.id}</span>
                      <span className="ml-auto font-mono text-[11px]">{formatRelative(a.createdAt)}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-[14px] text-ink-600 font-semibold">
                      <Avatar name={e?.name ?? "·"} size={28} />
                      {e?.name} <span className="text-ink-400 text-[12px] font-normal">{e?.age} 岁</span>
                    </div>
                    <div className="mt-1 text-[13px] text-ink-500 line-clamp-1">{a.message}</div>
                    <div className="mt-1.5 text-[11.5px] text-ink-400 inline-flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> {a.location}
                      {a.assigneeId && (
                        <span>· 责任 {staffMap.get(a.assigneeId)?.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 self-center">
                    <Badge tone={statusTone[a.status]} variant="outline">{a.status}</Badge>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && <div className="py-10 text-center text-ink-400 text-[13px]">没有匹配的告警</div>}
          </div>
        </Card>

        {opened && openedElderly && (
          <Card
            className="xl:col-span-2"
            title={
              <span className="flex items-center gap-2">
                <Siren className="h-4 w-4 text-alert" />
                处置详情 · {opened.id}
              </span>
            }
            description={`${opened.type} · ${formatDateTime(opened.createdAt)}`}
            extra={<button onClick={() => setOpenId(null)} className="h-8 w-8 rounded-lg hover:bg-ink-50 flex items-center justify-center text-ink-400"><X className="h-4 w-4" /></button>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="card-flat p-4 flex items-center gap-3">
                  <Avatar name={openedElderly.name} size={56} ring={openedElderly.riskLevel} />
                  <div>
                    <div className="text-[16px] font-display font-semibold text-ink-600">{openedElderly.name}</div>
                    <div className="text-[12.5px] text-ink-500 mt-0.5">
                      {openedElderly.age} 岁 · {openedElderly.gender} · {openedElderly.roomId}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {openedElderly.chronic.map((c) => (
                        <span key={c} className="rounded-md bg-ink-50 text-ink-500 px-2 py-0.5 text-[11px]">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-[13px] text-ink-600">
                  <KV k="位置" v={opened.location} />
                  <KV k="告警级别" v={<Badge tone={levelTone[opened.level]}>{opened.level === "critical" ? "紧急" : opened.level === "warning" ? "警告" : "提示"}</Badge>} />
                  <KV k="当前状态" v={<Badge tone={statusTone[opened.status]} variant="outline">{opened.status}</Badge>} />
                  <KV k="告警内容" v={opened.message} />
                  <KV k="责任护士" v={openedAssignee ? `${openedAssignee.name} · ${openedAssignee.title}` : "未指派"} />
                </div>
              </div>
              <div>
                <div className="card-flat p-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400 mb-3">处置时间线</div>
                  <div className="space-y-3">
                    {opened.timeline.map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-moss-700 mt-2" />
                        <div>
                          <div className="text-[13px] text-ink-600">{t.action}</div>
                          <div className="text-[11px] text-ink-400 font-mono">{formatDateTime(t.ts)} · {t.actor}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="outline" icon={<Phone className="h-4 w-4" />}>呼叫长者</Button>
                  <Button variant="outline" icon={<Video className="h-4 w-4" />}>视频直连</Button>
                  {opened.status === "待处置" && session && (
                    <Button
                      icon={<Check className="h-4 w-4" />}
                      onClick={() => {
                        resolveAlert(opened.id, session.name, "已现场处置完成");
                      }}
                    >
                      标记已解决
                    </Button>
                  )}
                  {opened.status !== "误报" && session && (
                    <Button
                      variant="danger"
                      icon={<X className="h-4 w-4" />}
                      onClick={() => {
                        markFalse(opened.id, session.name);
                      }}
                    >
                      标记误报
                    </Button>
                  )}
                </div>
                {opened.status === "待处置" && (
                  <div className="mt-3">
                    <div className="text-[12px] text-ink-400 mb-1.5">转派给</div>
                    <div className="flex flex-wrap gap-1.5">
                      {staff.filter((s) => s.online).slice(0, 4).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => session && assignAlert(opened.id, s.id)}
                          className="rounded-full border border-ink-100 px-2.5 py-1 text-[12px] hover:bg-moss-50"
                        >
                          <StatusDot tone="safe" pulse className="mr-1" />
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-ink-100/80 pb-1.5">
      <span className="text-ink-400 text-[12px]">{k}</span>
      <span className="text-ink-600 font-medium">{v}</span>
    </div>
  );
}
