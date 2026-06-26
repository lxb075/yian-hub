import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Siren,
  Users,
  Activity,
  ArrowUpRight,
  ClipboardList,
  Stethoscope,
  BedDouble,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useHub } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/widgets/MetricCard";
import { LineChart } from "@/components/widgets/LineChart";
import { Sparkline } from "@/components/widgets/Sparkline";
import { Ring } from "@/components/widgets/Ring";
import { FloorHeatMap } from "@/components/widgets/FloorHeatMap";
import { AlertStream } from "@/components/widgets/AlertStream";
import { Avatar } from "@/components/widgets/ElderCard";
import { formatRelative, formatTime } from "@/utils/format";
import { getTrend } from "@/store/hub";

export default function Dashboard() {
  const session = useHub((s) => s.session);
  const elderly = useHub((s) => s.elderly);
  const staff = useHub((s) => s.staff);
  const tasks = useHub((s) => s.tasks);
  const alerts = useHub((s) => s.alerts);
  const devices = useHub((s) => s.devices);

  const pendingAlerts = alerts.filter((a) => a.status === "待处置");
  const online = devices.filter((d) => d.online).length;

  const dutyStaff = useMemo(() => staff.filter((s) => s.online && s.shift === "白班").slice(0, 5), [staff]);
  const tasksToday = useMemo(() => {
    const todays = tasks.filter((t) => t.status === "待执行" || t.status === "进行中");
    return todays.slice(0, 6);
  }, [tasks]);

  const trend = getTrend("E001");
  const trendHrSeries = elderly.slice(0, 6).map((e) => {
    const t = getTrend(e.id);
    return t.map((p) => p.heartRate);
  });
  const trendLabels = trend.map((p) => p.date);

  // 综合告警分布
  const alertDist = useMemo(() => {
    const buckets: Record<string, number> = {};
    alerts.forEach((a) => {
      buckets[a.type] = (buckets[a.type] ?? 0) + 1;
    });
    return Object.entries(buckets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [alerts]);

  // 设备电量
  const batteryBuckets = useMemo(() => {
    const arr = devices.filter((d) => d.elderlyId).map((d) => d.battery);
    return {
      lt20: arr.filter((b) => b < 20).length,
      lt50: arr.filter((b) => b >= 20 && b < 50).length,
      gt50: arr.filter((b) => b >= 50).length,
      total: arr.length,
    };
  }, [devices]);

  return (
    <div className="space-y-6 stagger">
      {/* Hero greeting + date strip */}
      <div className="flex flex-col xl:flex-row gap-5">
        <Card className="flex-1 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #C8A45C 0%, transparent 60%)" }}
          />
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-moss-700 animate-pulse" />
            实时监护中 · {formatTime(Date.now(), true)} 同步
          </div>
          <h2 className="mt-2 font-display text-[34px] font-semibold text-ink-600 tracking-tight">
            {greeting()}, <span className="italic text-moss-700">{session?.name?.slice(-2) ?? "伙伴"}</span>。
            <br className="hidden md:block" />
            今日有 <span className="font-mono text-sand-600">{pendingAlerts.length}</span> 项告警待处置。
          </h2>
          <p className="mt-3 text-[13.5px] text-ink-500 max-w-xl">
            系统在 24 小时内已对 8 位长者完成 12,604 次生命体征采样，识别 2 次高风险事件并成功闭环处置。 一切正在被温柔地照看着。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link to="/alerts">
              <Button icon={<Siren className="h-4 w-4" />}>查看告警中心</Button>
            </Link>
            <Link to="/monitor">
              <Button variant="outline" icon={<Activity className="h-4 w-4" />}>实时健康监测</Button>
            </Link>
            <div className="ml-auto hidden md:flex items-center gap-4 text-[12px] text-ink-500">
              <div className="flex items-center gap-1.5"><StatusDot tone="safe" /> 设备在线 {online}/{devices.length}</div>
              <div className="flex items-center gap-1.5"><StatusDot tone="moss" /> 数据流稳定</div>
            </div>
          </div>
        </Card>

        <Card className="xl:w-[360px] flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-[12px] uppercase tracking-[0.18em] text-ink-400 font-medium">今日事件分布</div>
            <Badge tone="moss" variant="outline">最近 24h</Badge>
          </div>
          <div className="mt-3 space-y-2">
            {alertDist.length === 0 ? (
              <div className="text-[13px] text-ink-400 py-6 text-center">暂无事件</div>
            ) : (
              alertDist.map(([type, count], i) => {
                const max = alertDist[0][1] || 1;
                const pct = (count / max) * 100;
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div className="w-[88px] text-[12px] text-ink-500 truncate">{type}</div>
                    <div className="flex-1 h-2 rounded-full bg-ink-50 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: i === 0 ? "#C8553D" : i === 1 ? "#D9A441" : i === 2 ? "#5A6B7B" : "#7FB59C",
                        }}
                      />
                    </div>
                    <div className="w-8 text-right text-[12px] font-mono font-semibold text-ink-600">{count}</div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-ink-100/70 flex items-center justify-between text-[12px] text-ink-500">
            <span>护理工时</span>
            <span className="font-mono text-ink-600 font-semibold">182.5 h</span>
          </div>
        </Card>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="在册长者"
          value={elderly.length}
          unit="位"
          tone="moss"
          trend={2.4}
          series={[8, 8, 8, 8, 8, 8, 8, 8]}
          hint="分布于 3F/4F/5F 共 8 间房"
        />
        <MetricCard
          label="告警待处置"
          value={pendingAlerts.length}
          unit="项"
          tone="alert"
          trend={pendingAlerts.length > 2 ? 12.5 : -8.2}
          series={[3, 5, 4, 6, 3, 2, 4, pendingAlerts.length]}
          hint={`平均响应 ${formatRelative(Date.now() - 3 * 60_000)}`}
        />
        <MetricCard
          label="值班人员"
          value={dutyStaff.length}
          unit="人"
          tone="sand"
          trend={0}
          series={[5, 5, 5, 5, 5, 5, 5, 5]}
          hint="白班 · 含 2 名责任护士"
        />
        <MetricCard
          label="今日活动量"
          value="2,648"
          unit="步"
          tone="safe"
          trend={5.1}
          series={[2200, 2400, 2100, 2500, 2700, 2300, 2600, 2648]}
          hint="步态异常 0 · 离床 26 次"
        />
      </div>

      {/* Main grid: trends + floor heat + alert stream */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          className="xl:col-span-2"
          title="群体健康趋势"
          description="过去 30 天心率 / 血压 / SpO₂ / 睡眠 / 步数 综合"
          extra={
            <div className="flex items-center gap-2 text-[12px] text-ink-500">
              <span className="rounded-md bg-ink-50 px-2 py-1">日维度</span>
              <span className="rounded-md bg-moss-700 text-sand-50 px-2 py-1 font-semibold">周维度</span>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <MiniVital label="平均心率" value="72" unit="bpm" series={trend.map((p) => p.heartRate)} color="#2F4A3A" />
            <MiniVital label="平均收缩压" value="134" unit="mmHg" series={trend.map((p) => p.systolic)} color="#C8553D" />
            <MiniVital label="平均 SpO₂" value="96.4" unit="%" series={trend.map((p) => p.spo2)} color="#5A6B7B" />
            <MiniVital label="平均睡眠" value="6.2" unit="h" series={trend.map((p) => p.sleep)} color="#C8A45C" />
          </div>
          <LineChart
            height={200}
            labels={trendLabels}
            series={[
              { name: "心率 (bpm)", color: "#2F4A3A", data: trend.map((p) => p.heartRate) },
              { name: "收缩压 (mmHg)", color: "#C8553D", data: trend.map((p) => p.systolic) },
            ]}
            showLegend
          />
        </Card>

        <Card title="楼层告警热力" description="颜色越深代表关注度越高" extra={<Link to="/elderly" className="text-[12px] text-moss-700 inline-flex items-center gap-1 hover:underline">查看全部 <ArrowUpRight className="h-3 w-3" /></Link>}>
          <FloorHeatMap />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          className="xl:col-span-2"
          title={
            <span className="flex items-center gap-2">
              <Siren className="h-4 w-4 text-alert" />
              实时告警流
            </span>
          }
          description="按级别与时间倒序展示，自动滚动到最新事件"
          extra={
            <Link to="/alerts" className="text-[12px] text-moss-700 inline-flex items-center gap-1 hover:underline">
              告警中心 <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        >
          <AlertStream />
        </Card>

        <div className="space-y-5">
          <Card title="设备健康" description="在册设备电量与在线状态">
            <div className="flex items-center gap-4">
              <Ring
                value={(online / devices.length) * 100}
                color="#2F4A3A"
                label={`${Math.round((online / devices.length) * 100)}%`}
                sub="在线率"
              />
              <div className="flex-1 space-y-2 text-[12.5px]">
                <Row label="电量 < 20%" value={batteryBuckets.lt20} tone="alert" />
                <Row label="20% – 50%" value={batteryBuckets.lt50} tone="warn" />
                <Row label="电量 > 50%" value={batteryBuckets.gt50} tone="safe" />
                <div className="pt-2 border-t border-ink-100/70 flex items-center justify-between text-ink-500">
                  <span>绑定终端</span>
                  <span className="font-mono font-semibold text-ink-600">{batteryBuckets.total} 台</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="当班 · 责任护士" description="白班 · 在线">
            <div className="space-y-2.5">
              {dutyStaff.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <Avatar name={s.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[13px] text-ink-600">
                      <span className="font-semibold truncate">{s.name}</span>
                      <Badge tone="moss" className="text-[10px]">{s.title.split("·")[0]}</Badge>
                    </div>
                    <div className="text-[11px] text-ink-400">{s.yearsOfService} 年经验 · {s.title}</div>
                  </div>
                  <StatusDot tone="safe" pulse />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Tasks & Snapshot */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          className="xl:col-span-2"
          title={
            <span className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-moss-700" />
              今日照护任务
            </span>
          }
          description="按时段优先级排序"
          extra={<Link to="/care" className="text-[12px] text-moss-700 hover:underline">任务中心 →</Link>}
        >
          <div className="divide-y divide-ink-100/70">
            {tasksToday.map((t) => {
              const e = elderly.find((x) => x.id === t.elderlyId);
              const s = staff.find((x) => x.id === t.staffId);
              return (
                <div key={t.id} className="flex items-center gap-4 py-3">
                  <div className="w-12 text-center">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-ink-400">{new Date(t.scheduledAt).getHours() < 12 ? "上午" : "下午"}</div>
                    <div className="font-display text-[18px] font-semibold text-ink-600 leading-none">{formatTime(t.scheduledAt)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge tone={t.type === "用药" ? "alert" : t.type === "量测" ? "info" : "moss"}>{t.type}</Badge>
                      <span className="text-[14px] text-ink-600 font-medium truncate">{t.title}</span>
                    </div>
                    <div className="text-[12px] text-ink-400 mt-1">
                      关联：{e?.name} · 责任：{s?.name}
                    </div>
                  </div>
                  <Badge tone={t.status === "进行中" ? "warn" : "info"} variant="outline">{t.status}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          title={
            <span className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-moss-700" />
              长者健康摘要
            </span>
          }
          description="需要重点关注的 3 位"
          extra={<Link to="/elderly" className="text-[12px] text-moss-700 hover:underline">查看全部 →</Link>}
        >
          <div className="space-y-3">
            {elderly.filter((e) => e.riskLevel !== "low").slice(0, 3).map((e) => {
              const v = useHub.getState().vitals[e.id];
              return (
                <Link
                  to={`/elderly/${e.id}`}
                  key={e.id}
                  className="card-flat flex items-center gap-3 p-3 hover:bg-sand-100/60 transition"
                >
                  <Avatar name={e.name} size={36} ring={e.riskLevel} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-[14px] font-semibold text-ink-600 truncate">{e.name}</div>
                      <Badge tone={e.riskLevel === "high" ? "alert" : "warn"} className="text-[10px]">
                        {e.riskLevel === "high" ? "高风险" : "关注"}
                      </Badge>
                    </div>
                    <div className="text-[11.5px] text-ink-400 mt-0.5">{e.chronic.join(" · ")}</div>
                    {v && (
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-ink-500">
                        <BedDouble className="h-3 w-3" />
                        {e.roomId.replace("R", "")} · HR {v.heartRate} · {v.systolic}/{v.diastolic}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-300" />
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-ink-100/70 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-1.5 text-safe">
              <CheckCircle2 className="h-3.5 w-3.5" />
              今日闭环 12 项
            </div>
            <div className="flex items-center gap-1.5 text-ink-500">
              <AlertCircle className="h-3.5 w-3.5 text-warn" />
              关注 3 人
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MiniVital({ label, value, unit, series, color }: { label: string; value: string; unit: string; series: number[]; color: string }) {
  return (
    <div className="card-flat p-3">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-ink-400">{label}</div>
        <div className="text-[10px] font-mono text-ink-300">30d</div>
      </div>
      <div className="flex items-end justify-between gap-3 mt-1.5">
        <div className="font-display text-[24px] font-semibold text-ink-600 tabular leading-none">
          {value}
          <span className="text-[12px] text-ink-400 ml-1 font-sans">{unit}</span>
        </div>
        <Sparkline data={series} width={120} height={28} stroke={color} fill={`${color}22`} />
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: number; tone: "alert" | "warn" | "safe" }) {
  const map = {
    alert: "text-alert",
    warn: "text-warn",
    safe: "text-safe",
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={`font-mono font-semibold ${map[tone]}`}>{value} 台</span>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "夜深了";
  if (h < 11) return "早上好";
  if (h < 14) return "中午好";
  if (h < 18) return "下午好";
  return "晚上好";
}
