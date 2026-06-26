import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Activity,
  Siren,
  Cpu,
  ClipboardList,
  HeartHandshake,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Building2,
} from "lucide-react";
import { useHub } from "@/store/hub";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "实时仪表盘", icon: LayoutDashboard, group: "运营" },
  { to: "/elderly", label: "长者档案", icon: Users, group: "档案" },
  { to: "/monitor", label: "健康监测", icon: Activity, group: "档案" },
  { to: "/alerts", label: "智能告警", icon: Siren, group: "监护" },
  { to: "/devices", label: "设备物联", icon: Cpu, group: "监护" },
  { to: "/care", label: "照护任务", icon: ClipboardList, group: "服务" },
  { to: "/family", label: "家属互动", icon: HeartHandshake, group: "服务" },
  { to: "/analytics", label: "数据分析", icon: BarChart3, group: "洞察" },
  { to: "/settings", label: "系统设置", icon: Settings, group: "洞察" },
] as const;

const groupOrder = ["运营", "档案", "监护", "服务", "洞察"] as const;

export default function Sidebar() {
  const session = useHub((s) => s.session);
  const logout = useHub((s) => s.logout);
  const loc = useLocation();
  const grouped = groupOrder.map((g) => ({ g, list: items.filter((i) => i.group === g) }));

  return (
    <aside className="hidden lg:flex w-[252px] shrink-0 flex-col border-r border-ink-100/70 bg-sand-50/60 backdrop-blur-sm">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl bg-moss-700 text-sand-100 flex items-center justify-center shadow-soft">
            <Sparkles className="h-5 w-5" />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-sand-400 border-2 border-sand-50" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[20px] font-semibold tracking-tight text-ink-600">颐安云</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-400">YianHub · v1.0</div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="card-flat flex items-center gap-3 px-3 py-2.5">
          <Building2 className="h-4 w-4 text-moss-700" />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-ink-400">颐安养护中心</div>
            <div className="text-[13px] font-medium text-ink-600 truncate">松江院区 · 3F/4F/5F</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {grouped.map(({ g, list }) => (
          <div key={g} className="mt-3">
            <div className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.2em] text-ink-300 font-medium">{g}</div>
            <div className="space-y-0.5">
              {list.map((it) => {
                const Icon = it.icon;
                const active = loc.pathname === it.to || loc.pathname.startsWith(it.to + "/");
                return (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
                      active
                        ? "bg-moss-700 text-sand-50 shadow-soft"
                        : "text-ink-500 hover:bg-ink-50 hover:text-ink-600",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[15px] w-[15px] transition-transform group-hover:scale-110",
                        active ? "text-sand-400" : "text-ink-400 group-hover:text-moss-700",
                      )}
                    />
                    <span className="flex-1 truncate">{it.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-sand-400" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-100/70 p-4">
        <div className="card-flat px-3 py-2.5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sand-300 to-sand-500 flex items-center justify-center text-sand-50 font-display font-semibold text-[15px]">
              {session?.name?.charAt(0) ?? "·"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink-600 truncate">{session?.name ?? "未登录"}</div>
              <div className="text-[11px] text-ink-400 truncate">{session?.title ?? "—"}</div>
            </div>
            <button
              onClick={() => logout()}
              className="rounded-lg p-1.5 text-ink-300 hover:text-alert hover:bg-alert/10 transition"
              title="退出"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
