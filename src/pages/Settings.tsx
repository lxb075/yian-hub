import { useState } from "react";
import { useHub } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/widgets/ElderCard";
import { formatRelative, formatDateTime } from "@/utils/format";
import { Building2, KeyRound, ScrollText, Bell, Users, Cog, Plus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const tabs = [
  { id: "tenant", label: "机构信息", icon: Building2 },
  { id: "role", label: "角色权限", icon: KeyRound },
  { id: "notify", label: "消息通道", icon: Bell },
  { id: "staff", label: "员工管理", icon: Users },
  { id: "audit", label: "操作审计", icon: ScrollText },
] as const;

const matrix: { role: Role; name: string; color: string }[] = [
  { role: "admin", name: "机构管理员", color: "bg-moss-700 text-sand-50" },
  { role: "doctor", name: "值班医生", color: "bg-sand-400 text-moss-800" },
  { role: "nurse", name: "责任护士", color: "bg-moss-100 text-moss-700" },
  { role: "family", name: "家属", color: "bg-info/15 text-info" },
];

const modules = [
  "实时仪表盘",
  "长者档案",
  "健康监测",
  "智能告警",
  "设备物联",
  "照护任务",
  "家属互动",
  "数据分析",
  "系统设置",
];

export default function Settings() {
  const audit = useHub((s) => s.audit);
  const staff = useHub((s) => s.staff);
  const elderly = useHub((s) => s.elderly);
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("tenant");

  const perms: Record<Role, boolean[]> = {
    admin: modules.map(() => true),
    doctor: [true, true, true, true, true, true, false, true, false],
    nurse: [true, true, true, true, true, true, true, false, false],
    family: [true, true, true, false, false, false, true, false, false],
  };

  return (
    <div className="space-y-5 stagger">
      <div>
        <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">Tenant · Role · Audit</div>
        <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">系统设置</h2>
        <p className="text-[13px] text-ink-500 mt-1">多租户配置 · 角色权限矩阵 · 操作审计</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <Card className="xl:col-span-1" noPad>
          <div className="p-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    active ? "bg-moss-700 text-sand-50" : "hover:bg-ink-50 text-ink-600",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-sand-400" : "text-ink-400")} />
                  <span className="text-[13px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="xl:col-span-3 space-y-5">
          {tab === "tenant" && (
            <Card title="机构信息" description="松江院区基础信息">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="机构名称" value="颐安养护中心" />
                <Field label="院区" value="松江院区" />
                <Field label="床位总数" value="120" />
                <Field label="在住长者" value={`${elderly.length} 位`} />
                <Field label="楼层" value="3F / 4F / 5F" />
                <Field label="入驻时间" value="2018-06-12" />
                <Field label="机构地址" value="上海市松江区洞泾镇 · 长兴东路 88 号" />
                <Field label="联系电话" value="021-5768-0018" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-500">
                <ShieldCheck className="h-3.5 w-3.5 text-moss-700" />
                所有数据均经过等保三级加密，权限矩阵遵循最小授权原则。
              </div>
            </Card>
          )}

          {tab === "role" && (
            <Card title="角色权限矩阵" description="按模块与角色配置">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="text-[11px] uppercase tracking-[0.16em] text-ink-400">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">模块</th>
                      {matrix.map((m) => (
                        <th key={m.role} className="text-left px-3 py-2 font-medium">
                          <div className="flex items-center gap-2">
                            <span className={cn("h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-mono", m.color)}>
                              {m.name.charAt(0)}
                            </span>
                            {m.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100/70">
                    {modules.map((mod, i) => (
                      <tr key={mod} className="hover:bg-sand-50/60">
                        <td className="px-3 py-2.5 text-ink-600 font-medium">{mod}</td>
                        {matrix.map((m) => (
                          <td key={m.role} className="px-3 py-2.5">
                            <Switch checked={perms[m.role][i]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="outline">恢复默认</Button>
                <Button icon={<ShieldCheck className="h-4 w-4" />}>保存权限变更</Button>
              </div>
            </Card>
          )}

          {tab === "notify" && (
            <Card title="消息通道" description="告警与日报推送">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: "短信网关 · 阿里云", type: "SMS", enabled: true, count: 28 },
                  { name: "企业微信机器人", type: "WeCom", enabled: true, count: 12 },
                  { name: "钉钉工作通知", type: "DingTalk", enabled: true, count: 8 },
                  { name: "App 推送 · 个推", type: "Push", enabled: true, count: 142 },
                  { name: "邮件 SMTP", type: "Email", enabled: false, count: 0 },
                  { name: "语音外呼", type: "Voice", enabled: true, count: 3 },
                ].map((c) => (
                  <div key={c.name} className="card-flat p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">{c.type}</div>
                      <Switch checked={c.enabled} />
                    </div>
                    <div className="mt-2 text-[14px] font-semibold text-ink-600">{c.name}</div>
                    <div className="mt-2 text-[12px] text-ink-400">本月发送 <span className="font-mono text-ink-600 font-semibold">{c.count}</span> 条</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "staff" && (
            <Card
              title="员工管理"
              description={`共 ${staff.length} 名 · 在线 ${staff.filter((s) => s.online).length} 人`}
              extra={<Button size="sm" icon={<Plus className="h-3.5 w-3.5" />}>添加员工</Button>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {staff.map((s) => (
                  <div key={s.id} className="card-flat p-3 flex items-center gap-3">
                    <Avatar name={s.name} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink-600 truncate">{s.name}</div>
                      <div className="text-[11.5px] text-ink-400 mt-0.5">{s.title}</div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge tone="ink" className="text-[10px]">{s.role}</Badge>
                        <span className="text-[10.5px] text-ink-400 font-mono">{s.yearsOfService} 年</span>
                        <StatusDot tone={s.online ? "safe" : "ink"} pulse={s.online} className="ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "audit" && (
            <Card title="操作审计" description="实时记录 · 可导出">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="text-[11px] uppercase tracking-[0.16em] text-ink-400">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">时间</th>
                      <th className="text-left px-3 py-2 font-medium">操作人</th>
                      <th className="text-left px-3 py-2 font-medium">角色</th>
                      <th className="text-left px-3 py-2 font-medium">行为</th>
                      <th className="text-left px-3 py-2 font-medium">目标</th>
                      <th className="text-left px-3 py-2 font-medium">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100/70">
                    {audit.slice(0, 12).map((l) => (
                      <tr key={l.id} className="hover:bg-sand-50/60">
                        <td className="px-3 py-2.5 font-mono text-[12px] text-ink-500">{formatRelative(l.ts)}</td>
                        <td className="px-3 py-2.5 text-ink-600 font-medium">{l.actor}</td>
                        <td className="px-3 py-2.5">
                          <Badge tone={l.role === "admin" ? "moss" : l.role === "doctor" ? "sand" : l.role === "nurse" ? "info" : "ink"}>
                            {l.role}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-ink-600">{l.action}</td>
                        <td className="px-3 py-2.5 text-ink-500 font-mono text-[12px]">{l.target}</td>
                        <td className="px-3 py-2.5 text-ink-400 font-mono text-[12px]">{l.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-flat p-3.5">
      <div className="text-[12px] text-ink-400">{label}</div>
      <div className="mt-1 text-[14px] text-ink-600 font-medium">{value}</div>
    </div>
  );
}

function Switch({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-9 items-center rounded-full p-0.5 transition",
        checked ? "bg-moss-700" : "bg-ink-200",
      )}
    >
      <span className={cn("h-4 w-4 rounded-full bg-white shadow transition", checked ? "translate-x-4" : "translate-x-0")} />
    </span>
  );
}
