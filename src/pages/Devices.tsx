import { useMemo, useState } from "react";
import { useHub } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Ring } from "@/components/widgets/Ring";
import { Cpu, Battery, Wifi, WifiOff, RefreshCw, Wrench, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";
import type { DeviceType } from "@/types";

const types: { id: DeviceType | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "智能手环", label: "智能手环" },
  { id: "血压计", label: "血压计" },
  { id: "定位信标", label: "定位信标" },
  { id: "紧急呼叫器", label: "SOS 呼叫器" },
  { id: "睡眠带", label: "睡眠带" },
  { id: "跌倒检测垫", label: "跌倒检测垫" },
  { id: "智能药盒", label: "智能药盒" },
  { id: "烟雾传感器", label: "烟雾" },
];

export default function Devices() {
  const devices = useHub((s) => s.devices);
  const elderly = useHub((s) => s.elderly);
  const [type, setType] = useState<DeviceType | "all">("all");
  const [q, setQ] = useState("");
  const elderlyMap = new Map(elderly.map((e) => [e.id, e]));

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      if (type !== "all" && d.type !== type) return false;
      if (q && !`${d.name}${d.id}${d.model}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [devices, type, q]);

  const online = devices.filter((d) => d.online).length;
  const low = devices.filter((d) => d.elderlyId && d.battery < 25).length;
  const offline = devices.filter((d) => !d.online).length;

  return (
    <div className="space-y-5 stagger">
      <div>
        <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">Edge · Gateway · Cloud</div>
        <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">设备物联管理</h2>
        <p className="text-[13px] text-ink-500 mt-1">智能终端台账 · 电量与心跳 · 失联告警与远程维护</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Ring value={(online / devices.length) * 100} color="#2F4A3A" size={70} stroke={8} sub="在线" />
            <div>
              <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">在线率</div>
              <div className="font-display text-[26px] font-semibold text-ink-600 tabular leading-none">{online}/{devices.length}</div>
              <div className="text-[12px] text-ink-400 mt-1">近 7 天均值 96.4%</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-alert">失联</div>
          <div className="mt-1 font-display text-[32px] font-semibold text-ink-600 tabular leading-none">{offline}</div>
          <div className="text-[12px] text-ink-400 mt-1">需现场处置</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-warn">低电量</div>
          <div className="mt-1 font-display text-[32px] font-semibold text-ink-600 tabular leading-none">{low}</div>
          <div className="text-[12px] text-ink-400 mt-1">&lt; 25% 提示</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-info">固件版本</div>
          <div className="mt-1 font-display text-[20px] font-semibold text-ink-600 leading-none">v2.4.1</div>
          <div className="text-[12px] text-ink-400 mt-1">12 项设备待 OTA</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <label className="flex-1 flex items-center h-10 rounded-xl border border-ink-100 bg-white/60 px-3 focus-within:border-moss-700/60">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索设备 / 型号 / 长者"
              className="ml-2 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-300"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={cn(
                  "h-9 px-3 rounded-full text-[12.5px] font-medium border transition",
                  type === t.id
                    ? "bg-moss-700 text-sand-50 border-moss-700"
                    : "bg-white/60 text-ink-500 border-ink-100 hover:border-moss-700/40",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="text-[11px] uppercase tracking-[0.16em] text-ink-400 bg-sand-100/60">
              <tr>
                <th className="text-left px-5 py-3 font-medium">设备</th>
                <th className="text-left px-5 py-3 font-medium">类型</th>
                <th className="text-left px-5 py-3 font-medium">绑定长者</th>
                <th className="text-left px-5 py-3 font-medium">状态</th>
                <th className="text-left px-5 py-3 font-medium">电量</th>
                <th className="text-left px-5 py-3 font-medium">固件</th>
                <th className="text-left px-5 py-3 font-medium">最后心跳</th>
                <th className="text-right px-5 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100/70">
              {filtered.map((d) => {
                const e = d.elderlyId ? elderlyMap.get(d.elderlyId) : undefined;
                const batteryTone = d.battery < 20 ? "alert" : d.battery < 50 ? "warn" : "safe";
                return (
                  <tr key={d.id} className="hover:bg-sand-50/60 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-moss-50 text-moss-700 flex items-center justify-center">
                          <Cpu className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-ink-600">{d.name}</div>
                          <div className="font-mono text-[11px] text-ink-400">{d.id} · {d.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge tone="ink">{d.type}</Badge></td>
                    <td className="px-5 py-3 text-ink-500">{e ? `${e.name} · ${e.roomId}` : <span className="text-ink-300">—</span>}</td>
                    <td className="px-5 py-3">
                      {d.online ? (
                        <div className="inline-flex items-center gap-1.5 text-safe text-[12px]">
                          <StatusDot tone="safe" pulse /> 在线
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-alert text-[12px]">
                          <StatusDot tone="alert" /> 离线
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Battery className={cn("h-3.5 w-3.5", batteryTone === "alert" ? "text-alert" : batteryTone === "warn" ? "text-warn" : "text-safe")} />
                        <div className="w-20 h-1.5 rounded-full bg-ink-50 overflow-hidden">
                          <div
                            className={cn("h-full", batteryTone === "alert" ? "bg-alert" : batteryTone === "warn" ? "bg-warn" : "bg-safe")}
                            style={{ width: `${d.battery}%` }}
                          />
                        </div>
                        <span className="font-mono text-[12px] text-ink-500 w-8 text-right">{d.battery}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] text-ink-500">{d.firmware}</td>
                    <td className="px-5 py-3 text-[12px] text-ink-400 font-mono">{formatRelative(d.lastHeartbeat)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button variant="ghost" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />}>OTA</Button>
                        <Button variant="ghost" size="sm" icon={<Wrench className="h-3.5 w-3.5" />}>维护</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="健康度排行" description="按在线率与电量综合">
          <div className="space-y-2">
            {devices.filter((d) => d.elderlyId).slice(0, 6).map((d) => {
              const score = Math.round((d.online ? 60 : 0) + d.battery * 0.4);
              return (
                <div key={d.id} className="card-flat p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-moss-50 text-moss-700 flex items-center justify-center">
                    {d.online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4 text-alert" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-ink-600">{d.name}</div>
                    <div className="text-[11px] text-ink-400 font-mono">{d.id}</div>
                  </div>
                  <div className="w-32 h-1.5 rounded-full bg-ink-50 overflow-hidden">
                    <div className="h-full bg-moss-700" style={{ width: `${score}%` }} />
                  </div>
                  <div className="w-10 text-right font-mono text-[12px] text-ink-600">{score}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="接入网关" description="Zigbee · LoRa · 4G/Cat.1 · BLE">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "3F-Gateway", type: "Zigbee 3.0", count: 42 },
              { name: "4F-Gateway", type: "Zigbee 3.0", count: 38 },
              { name: "Outdoor-LoRa", type: "LoRaWAN", count: 12 },
              { name: "Mobile-Cat1", type: "4G/Cat.1", count: 8 },
            ].map((g) => (
              <div key={g.name} className="card-flat p-3">
                <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">Gateway</div>
                <div className="text-[14px] font-semibold text-ink-600 mt-1">{g.name}</div>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-500">
                  <StatusDot tone="safe" pulse />
                  <span className="font-mono">{g.count} 终端</span>
                  <span className="ml-auto text-ink-400">{g.type}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
