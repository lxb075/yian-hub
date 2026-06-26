import { useEffect, useState } from "react";
import { useHub } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/widgets/ElderCard";
import { RealTimeECG } from "@/components/widgets/RealTimeECG";
import { LineChart } from "@/components/widgets/LineChart";
import { Heart, Wind, Droplet, Thermometer, Activity, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Monitor() {
  const elderly = useHub((s) => s.elderly);
  const vitals = useHub((s) => s.vitals);
  const history = useHub((s) => s.vitalsHistory);
  const [picked, setPicked] = useState<string>(elderly[0]?.id ?? "");
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const filtered = elderly.filter((e) => !q || `${e.name}${e.id}`.toLowerCase().includes(q.toLowerCase()));
  const cur = picked ? vitals[picked] : undefined;
  const hist = picked ? history[picked] ?? [] : [];
  const last30 = hist.slice(-30);

  return (
    <div className="space-y-5 stagger">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">Vital Sign Monitor</div>
          <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">实时健康监测</h2>
          <p className="text-[13px] text-ink-500 mt-1">多模态传感器以 ≥ 1Hz 频率回传心电、SpO₂、血压、体温、呼吸等关键体征。</p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-ink-500">
          <StatusDot tone="safe" pulse /> 数据流正常 · 第 <span className="font-mono text-ink-600 ml-1">{tick}</span> 秒
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Elderly picker */}
        <Card className="xl:col-span-1" title="长者" description="选择查看对象">
          <label className="flex items-center h-9 rounded-xl border border-ink-100 bg-white/60 px-2.5 mb-3 focus-within:border-moss-700/60">
            <Search className="h-3.5 w-3.5 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索"
              className="ml-2 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-ink-300"
            />
          </label>
          <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map((e) => {
              const v = vitals[e.id];
              const active = picked === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setPicked(e.id)}
                  className={cn(
                    "w-full text-left rounded-xl p-2.5 flex items-center gap-3 transition border",
                    active ? "bg-moss-700 text-sand-50 border-moss-700 shadow-soft" : "border-transparent hover:bg-ink-50",
                  )}
                >
                  <Avatar name={e.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-[13px] font-semibold truncate", active ? "text-sand-50" : "text-ink-600")}>{e.name}</div>
                    <div className={cn("text-[11px] font-mono", active ? "text-sand-200" : "text-ink-400")}>
                      HR {v?.heartRate} · SpO₂ {v?.spo2}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Vitals + ECG */}
        <div className="xl:col-span-3 space-y-5">
          {picked && cur ? (
            <>
              <Card className="relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -right-12 -top-10 h-44 w-44 rounded-full opacity-30"
                  style={{ background: "radial-gradient(circle, #C8A45C 0%, transparent 60%)" }}
                />
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-ink-400 font-medium">Live · 实时体征</div>
                  <StatusDot tone="safe" pulse />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <VitalBig icon={<Heart className="h-4 w-4" />} label="心率" value={cur.heartRate} unit="bpm" tone="alert" range="60-100" v={cur.heartRate} />
                  <VitalBig icon={<Droplet className="h-4 w-4" />} label="血氧" value={cur.spo2} unit="%" tone="info" range=">=95" v={cur.spo2} />
                  <VitalBig icon={<Activity className="h-4 w-4" />} label="收缩压" value={cur.systolic} unit="mmHg" tone="warn" range="<140" v={cur.systolic} />
                  <VitalBig icon={<Activity className="h-4 w-4" />} label="舒张压" value={cur.diastolic} unit="mmHg" tone="warn" range="<90" v={cur.diastolic} />
                  <VitalBig icon={<Thermometer className="h-4 w-4" />} label="体温" value={cur.temperature.toFixed(1)} unit="°C" tone="moss" range="36.0-37.2" v={cur.temperature} />
                </div>
              </Card>

              <Card title="心电实时波形" description={`Lead II · 来自 ${elderly.find((e) => e.id === picked)?.name} 的生命手环`} extra={<Badge tone="moss">实时</Badge>}>
                <div className="card-flat p-4">
                  <RealTimeECG bpm={cur.heartRate} color="#C8553D" height={150} width={760} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[12px] text-ink-500">
                  <span>采样率 250 Hz · 滤波 0.5–40 Hz</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span>QRS {Math.round(cur.heartRate * 0.04)} ms</span>
                    <span>HRV {(40 + Math.random() * 30).toFixed(0)} ms</span>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card title="血压趋势（30 帧）" description="收缩压 / 舒张压">
                  <LineChart
                    height={170}
                    labels={last30.map((_, i) => `${30 - i}s`)}
                    series={[
                      { name: "收缩压", color: "#C8553D", data: last30.map((h) => h.systolic) },
                      { name: "舒张压", color: "#D9A441", data: last30.map((h) => h.diastolic) },
                    ]}
                    showLegend
                  />
                </Card>
                <Card title="血氧与呼吸" description="SpO₂ / 呼吸频率">
                  <LineChart
                    height={170}
                    labels={last30.map((_, i) => `${30 - i}s`)}
                    yMin={85}
                    yMax={100}
                    series={[
                      { name: "SpO₂", color: "#5A6B7B", data: last30.map((h) => h.spo2) },
                      { name: "呼吸", color: "#2F4A3A", data: last30.map((h) => h.respRate + 80) },
                    ]}
                    showLegend
                  />
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card title="AI 解读" description="基于 30 秒数据">
                  <div className="space-y-3 text-[13px] text-ink-600">
                    <Insight tone="safe" text="心率在正常范围内，节律规则，未检出房颤特征。" />
                    <Insight tone="safe" text="SpO₂ 维持在 96% 以上，血氧饱和度良好。" />
                    <Insight tone="warn" text="收缩压偏高 132 mmHg，建议每 4 小时复测并汇报医生。" />
                  </div>
                </Card>
                <Card title="设备接入" description="实时通道">
                  <div className="space-y-2">
                    <DeviceRow name="生命守护手环 V3" id="Care-WB3" status="在线" battery={78} />
                    <DeviceRow name="上臂式血压计" id="BP-700" status="在线" battery={100} />
                    <DeviceRow name="SOS 呼叫器" id="SOS-Pendant" status="在线" battery={64} />
                  </div>
                </Card>
                <Card title="操作" description="处置与互动">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">发起视频</Button>
                    <Button variant="outline">呼叫家属</Button>
                    <Button variant="outline">标记健康</Button>
                    <Button>推送医嘱</Button>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <div className="py-16 text-center text-ink-400 text-[14px]">请选择左侧长者开始实时监测</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function VitalBig({ icon, label, value, unit, tone, range, v }: { icon: React.ReactNode; label: string; value: number | string; unit: string; tone: "moss" | "alert" | "warn" | "safe" | "info"; range: string; v?: number }) {
  const color = {
    moss: "text-moss-700",
    alert: "text-alert",
    warn: "text-warn",
    safe: "text-safe",
    info: "text-info",
  }[tone];
  return (
    <div className="card-flat p-4 relative">
      <div className="flex items-center justify-between text-[12px] text-ink-400">
        <span className="inline-flex items-center gap-1.5">{icon} {label}</span>
        <span className="text-[10px] font-mono">参考 {range}</span>
      </div>
      <div className={`mt-2 font-display text-[40px] font-semibold tabular leading-none ${color}`}>
        {value}
        <span className="text-[12px] text-ink-400 ml-1 font-sans">{unit}</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-ink-50 overflow-hidden">
        <div className={cn("h-full", tone === "alert" ? "bg-alert" : tone === "warn" ? "bg-warn" : tone === "info" ? "bg-info" : "bg-moss-700")} style={{ width: `${typeof v === "number" ? Math.min(100, (v / 200) * 100) : 50}%` }} />
      </div>
    </div>
  );
}

function Insight({ tone, text }: { tone: "safe" | "warn" | "alert"; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className={cn("h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5", tone === "safe" ? "bg-safe" : tone === "warn" ? "bg-warn text-ink-600" : "bg-alert")}>
        {tone === "safe" ? "✓" : tone === "warn" ? "!" : "×"}
      </div>
      <div className="text-[13px] text-ink-600 leading-relaxed">{text}</div>
    </div>
  );
}

function DeviceRow({ name, id, status, battery }: { name: string; id: string; status: string; battery: number }) {
  return (
    <div className="card-flat p-2.5 flex items-center gap-3">
      <div className="h-7 w-7 rounded-lg bg-moss-50 text-moss-700 flex items-center justify-center">
        <Wind className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold text-ink-600 truncate">{name}</div>
        <div className="font-mono text-[10.5px] text-ink-400">{id}</div>
      </div>
      <div className="text-right">
        <div className="text-[11px] text-safe font-mono">{status}</div>
        <div className="text-[10.5px] text-ink-400 font-mono">电量 {battery}%</div>
      </div>
    </div>
  );
}
