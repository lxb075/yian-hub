import { useMemo } from "react";
import { useHub } from "@/store/hub";
import { getTrend } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LineChart } from "@/components/widgets/LineChart";
import { Ring } from "@/components/widgets/Ring";
import { Sparkline } from "@/components/widgets/Sparkline";

export default function Analytics() {
  const elderly = useHub((s) => s.elderly);
  const alerts = useHub((s) => s.alerts);
  const tasks = useHub((s) => s.tasks);
  const devices = useHub((s) => s.devices);
  const staff = useHub((s) => s.staff);

  const allTrend = useMemo(() => {
    return elderly.map((e) => ({ e, t: getTrend(e.id) }));
  }, [elderly]);

  const labels = allTrend[0]?.t.map((p) => p.date) ?? [];

  const avgHr = allTrend.map((x) => Math.round(x.t.reduce((s, p) => s + p.heartRate, 0) / x.t.length));
  const avgSystolic = allTrend.map((x) => Math.round(x.t.reduce((s, p) => s + p.systolic, 0) / x.t.length));
  const avgSpo2 = allTrend.map((x) => +(allTrend[0].t.length > 0 ? (x.t.reduce((s, p) => s + p.spo2, 0) / x.t.length).toFixed(1) : 0));
  const avgSleep = allTrend.map((x) => +(x.t.reduce((s, p) => s + p.sleep, 0) / x.t.length).toFixed(1));

  const alertByType = useMemo(() => {
    const m: Record<string, number> = {};
    alerts.forEach((a) => (m[a.type] = (m[a.type] ?? 0) + 1));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [alerts]);

  const alertByLevel = useMemo(() => {
    return [
      { name: "紧急", color: "#C8553D", value: alerts.filter((a) => a.level === "critical").length },
      { name: "警告", color: "#D9A441", value: alerts.filter((a) => a.level === "warning").length },
      { name: "提示", color: "#5A6B7B", value: alerts.filter((a) => a.level === "info").length },
    ];
  }, [alerts]);

  const workHours = staff.map((s) => ({ name: s.name, hours: 24 + Math.round(Math.random() * 24) }));

  return (
    <div className="space-y-5 stagger">
      <div>
        <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">Population Health Insights</div>
        <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">数据分析</h2>
        <p className="text-[13px] text-ink-500 mt-1">群体健康趋势 · 告警分布 · 护理工时 · 设备健康度</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2" title="群体健康趋势" description="过去 30 天 · 各长者平均">
          <LineChart
            height={220}
            labels={labels}
            series={[
              { name: "心率", color: "#2F4A3A", data: avgHr },
              { name: "收缩压", color: "#C8553D", data: avgSystolic },
            ]}
            showLegend
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <LineChart
              height={140}
              labels={labels}
              showLegend={false}
              yMin={90}
              yMax={100}
              series={[{ name: "SpO₂", color: "#5A6B7B", data: avgSpo2 }]}
            />
            <LineChart
              height={140}
              labels={labels}
              showLegend={false}
              series={[{ name: "睡眠", color: "#C8A45C", data: avgSleep }]}
            />
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="告警级别分布">
            <div className="flex items-center gap-4">
              <Ring
                value={(alertByLevel[0].value / Math.max(1, alerts.length)) * 100}
                color="#C8553D"
                label={`${alerts.length}`}
                sub="总告警"
              />
              <div className="flex-1 space-y-2 text-[13px]">
                {alertByLevel.map((b) => (
                  <div key={b.name} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                    <span className="flex-1 text-ink-500">{b.name}</span>
                    <span className="font-mono font-semibold">{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card title="告警类型" description="Top 5">
            <div className="space-y-2">
              {alertByType.slice(0, 5).map(([t, c], i) => {
                const max = alertByType[0]?.[1] || 1;
                return (
                  <div key={t}>
                    <div className="flex items-center justify-between text-[12.5px] text-ink-500">
                      <span>{t}</span>
                      <span className="font-mono">{c}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink-50 mt-1 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(c / max) * 100}%`,
                          background: i === 0 ? "#C8553D" : i === 1 ? "#D9A441" : i === 2 ? "#5A6B7B" : "#7FB59C",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          className="xl:col-span-2"
          title="护理工时"
          description="本月累计"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {workHours.map((w) => (
              <div key={w.name} className="card-flat p-3">
                <div className="text-[12px] text-ink-400">{w.name}</div>
                <div className="font-display text-[24px] font-semibold text-ink-600 tabular leading-none mt-1">
                  {w.hours}
                  <span className="text-[12px] text-ink-400 ml-1">h</span>
                </div>
                <div className="mt-2">
                  <Sparkline data={Array.from({ length: 14 }, (_, i) => w.hours - 12 + Math.sin(i + w.name.length) * 4 + Math.random() * 3)} width={140} height={26} stroke="#2F4A3A" fill="rgba(47,74,58,0.16)" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="设备健康度" description="本月">
          <div className="space-y-3 text-[13px]">
            <Row label="平均在线率" value="96.4%" sub="+1.2%" tone="safe" />
            <Row label="低电量告警" value="3" sub="-2" tone="warn" />
            <Row label="失联事件" value="1" sub="-3" tone="alert" />
            <Row label="OTA 升级完成" value="18" sub="100%" tone="safe" />
            <Row label="平均电量" value="68%" sub="+4%" tone="moss" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card title="任务执行" description="本月统计">
          <div className="grid grid-cols-2 gap-3">
            <div className="card-flat p-3 text-center">
              <div className="text-[12px] text-ink-400">已完成</div>
              <div className="font-display text-[28px] font-semibold text-safe tabular leading-none mt-1">{tasks.filter((t) => t.status === "已完成").length}</div>
            </div>
            <div className="card-flat p-3 text-center">
              <div className="text-[12px] text-ink-400">进行中</div>
              <div className="font-display text-[28px] font-semibold text-warn tabular leading-none mt-1">{tasks.filter((t) => t.status === "进行中").length}</div>
            </div>
            <div className="card-flat p-3 text-center">
              <div className="text-[12px] text-ink-400">待执行</div>
              <div className="font-display text-[28px] font-semibold text-info tabular leading-none mt-1">{tasks.filter((t) => t.status === "待执行").length}</div>
            </div>
            <div className="card-flat p-3 text-center">
              <div className="text-[12px] text-ink-400">已超时</div>
              <div className="font-display text-[28px] font-semibold text-alert tabular leading-none mt-1">{tasks.filter((t) => t.status === "已超时").length}</div>
            </div>
          </div>
        </Card>
        <Card title="慢病分布" description="长者主要慢病">
          <div className="space-y-2">
            {(() => {
              const m: Record<string, number> = {};
              elderly.forEach((e) => e.chronic.forEach((c) => (m[c] = (m[c] ?? 0) + 1)));
              const arr = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6);
              const max = arr[0]?.[1] || 1;
              return arr.map(([k, v], i) => (
                <div key={k}>
                  <div className="flex items-center justify-between text-[12.5px] text-ink-500">
                    <span>{k}</span>
                    <span className="font-mono">{v} 人</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-50 mt-1 overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${(v / max) * 100}%`,
                        background: i === 0 ? "#C8553D" : i === 1 ? "#D9A441" : i === 2 ? "#5A6B7B" : "#7FB59C",
                      }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </Card>
        <Card title="满意度趋势" description="NPS · 近 6 月">
          <LineChart
            height={180}
            labels={["5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]}
            series={[{ name: "NPS", color: "#C8A45C", data: [54, 58, 60, 64, 66, 68, 70, 72] }]}
            showLegend={false}
            yMin={40}
            yMax={80}
          />
        </Card>
      </div>

      <Card title="设备分布" description="按类型统计">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(() => {
            const m: Record<string, number> = {};
            devices.forEach((d) => (m[d.type] = (m[d.type] ?? 0) + 1));
            return Object.entries(m).map(([t, c]) => (
              <div key={t} className="card-flat p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-moss-50 text-moss-700 flex items-center justify-center">
                  <Badge tone="moss" className="text-[10px]">{c}</Badge>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink-600">{t}</div>
                  <div className="text-[11px] text-ink-400">在网 {c} 台</div>
                </div>
              </div>
            ));
          })()}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "moss" | "alert" | "warn" | "safe" }) {
  const c = { moss: "text-moss-700", alert: "text-alert", warn: "text-warn", safe: "text-safe" }[tone];
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-ink-500">{label}</div>
        <div className={`text-[10.5px] ${c}`}>较上月 {sub}</div>
      </div>
      <div className="font-display text-[20px] font-semibold text-ink-600 tabular">{value}</div>
    </div>
  );
}
