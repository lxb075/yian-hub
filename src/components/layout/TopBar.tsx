import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Search, ChevronDown, Sun, Moon, Stethoscope, HeartPulse, Briefcase, Users } from "lucide-react";
import { useHub } from "@/store/hub";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";
import type { Role } from "@/types";
import { useLocation } from "react-router-dom";

const roleMeta: Record<Role, { label: string; icon: React.ComponentType<{ className?: string }>; chip: string }> = {
  admin: { label: "机构管理员", icon: Briefcase, chip: "bg-moss-700 text-sand-50" },
  doctor: { label: "值班医生", icon: Stethoscope, chip: "bg-sand-400 text-moss-800" },
  nurse: { label: "责任护士", icon: HeartPulse, chip: "bg-moss-100 text-moss-800" },
  family: { label: "家属", icon: Users, chip: "bg-info/15 text-info" },
};

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "实时仪表盘", sub: "Multi-modal telemetry · 24/7" },
  "/elderly": { title: "长者档案", sub: "Resident profile · 全周期健康档案" },
  "/monitor": { title: "健康监测", sub: "Vital signs & behavioral signal" },
  "/alerts": { title: "智能告警中心", sub: "AI-driven triage workflow" },
  "/devices": { title: "设备物联", sub: "Edge · Gateway · Cloud 三级架构" },
  "/care": { title: "照护任务", sub: "Shift · Task · Care path" },
  "/family": { title: "家属互动", sub: "Daily report & visit reservation" },
  "/analytics": { title: "数据分析", sub: "Population health insights" },
  "/settings": { title: "系统设置", sub: "Tenant · Role · Audit" },
};

export default function TopBar() {
  const session = useHub((s) => s.session);
  const switchRole = useHub((s) => s.switchRole);
  const alerts = useHub((s) => s.alerts);
  const messages = useHub((s) => s.messages);
  const loc = useLocation();

  const [showRole, setShowRole] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [dark, setDark] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRole(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const pendingAlerts = useMemo(() => alerts.filter((a) => a.status === "待处置" || a.status === "处置中").slice(0, 6), [alerts]);
  const unreadMsgs = useMemo(() => messages.filter((m) => !m.read).slice(0, 4), [messages]);

  const meta = session ? roleMeta[session.role] : null;
  const RoleIcon = meta?.icon ?? Users;
  const pageKey = Object.keys(pageTitles).find((k) => loc.pathname === k || loc.pathname.startsWith(k + "/"));
  const page = pageKey ? pageTitles[pageKey] : { title: "颐安云 Hub", sub: "Smart eldercare orchestration" };

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100/70 bg-sand-50/80 backdrop-blur-md">
      <div className="flex h-[68px] items-center gap-5 px-7">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink-600">{page.title}</h1>
            <span className="rounded-full border border-ink-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ink-400">
              {page.sub}
            </span>
          </div>
        </div>

        {/* Search */}
        <label className="relative hidden md:flex items-center w-[300px] h-10 rounded-xl border border-ink-100 bg-white/60 px-3 focus-within:border-moss-700/60 focus-within:bg-white transition">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            placeholder="搜索长者 / 房间 / 设备 ID"
            className="ml-2 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-300"
          />
          <kbd className="rounded border border-ink-100 px-1.5 text-[10px] text-ink-400 font-mono">⌘ K</kbd>
        </label>

        <button
          onClick={() => setDark((d) => !d)}
          className="h-10 w-10 rounded-xl border border-ink-100 bg-white/60 text-ink-500 flex items-center justify-center hover:bg-white transition"
          title="切换主题"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative h-10 w-10 rounded-xl border border-ink-100 bg-white/60 text-ink-500 flex items-center justify-center hover:bg-white transition"
          >
            <Bell className="h-4 w-4" />
            {(pendingAlerts.length + unreadMsgs.length) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-alert text-[10px] text-white font-mono font-semibold flex items-center justify-center">
                {pendingAlerts.length + unreadMsgs.length}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-[360px] rounded-2xl border border-ink-100 bg-white shadow-soft p-2 animate-rise">
              <div className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-ink-400">待办中心</div>
              {pendingAlerts.length === 0 && unreadMsgs.length === 0 && (
                <div className="px-3 py-6 text-center text-[13px] text-ink-400">一切安宁</div>
              )}
              {pendingAlerts.map((a) => (
                <div key={a.id} className="rounded-xl px-3 py-2 hover:bg-ink-50 transition cursor-pointer">
                  <div className="flex items-center gap-2 text-[12px] text-ink-400">
                    <span className={cn("h-1.5 w-1.5 rounded-full", a.level === "critical" ? "bg-alert animate-pulse-ring" : a.level === "warning" ? "bg-warn" : "bg-info")} />
                    {a.type} · {a.location}
                  </div>
                  <div className="text-[13px] text-ink-600 mt-0.5 truncate">{a.message}</div>
                  <div className="text-[11px] text-ink-300 mt-0.5">{formatRelative(a.createdAt)}</div>
                </div>
              ))}
              {unreadMsgs.map((m) => (
                <div key={m.id} className="rounded-xl px-3 py-2 hover:bg-ink-50 transition cursor-pointer">
                  <div className="text-[12px] text-ink-400">{m.from} · {m.type}</div>
                  <div className="text-[13px] text-ink-600 mt-0.5 truncate">{m.preview}</div>
                  <div className="text-[11px] text-ink-300 mt-0.5">{formatRelative(m.ts)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setShowRole((v) => !v)}
            className="flex items-center gap-3 h-10 pl-1.5 pr-3 rounded-xl border border-ink-100 bg-white/60 hover:bg-white transition"
          >
            {session ? (
              <>
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", meta?.chip)}>
                  <RoleIcon className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[12.5px] font-semibold text-ink-600 leading-tight">{session.name}</div>
                  <div className="text-[10px] text-ink-400 leading-tight">{meta?.label}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-ink-300" />
              </>
            ) : (
              <span className="text-[13px] text-ink-400 px-2">未登录</span>
            )}
          </button>
          {showRole && (
            <div className="absolute right-0 top-12 w-[260px] rounded-2xl border border-ink-100 bg-white shadow-soft p-2 animate-rise">
              <div className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-ink-400">切换演示身份</div>
              {(Object.keys(roleMeta) as Role[]).map((r) => {
                const m = roleMeta[r];
                const Icon = m.icon;
                const active = session?.role === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRole(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition",
                      active ? "bg-moss-700 text-sand-50" : "hover:bg-ink-50 text-ink-600",
                    )}
                  >
                    <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", m.chip, active && "ring-2 ring-sand-400/60")}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold">{m.label}</div>
                      <div className={cn("text-[10px]", active ? "text-sand-200" : "text-ink-400")}>
                        {r === "admin" && "全部模块与设置"}
                        {r === "nurse" && "照护任务、告警处置"}
                        {r === "doctor" && "健康监测、医嘱"}
                        {r === "family" && "关联长者健康概览"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
