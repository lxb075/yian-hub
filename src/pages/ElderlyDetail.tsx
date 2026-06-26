import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, FileText, Activity, Pill, ClipboardList, Heart, Camera, MapPin, Calendar } from "lucide-react";
import { useHub, getTrend } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/widgets/ElderCard";
import { LineChart } from "@/components/widgets/LineChart";
import { Sparkline } from "@/components/widgets/Sparkline";
import { RealTimeECG } from "@/components/widgets/RealTimeECG";
import { Ring } from "@/components/widgets/Ring";
import { formatDate, formatRelative } from "@/utils/format";

const tabs = [
  { id: "trend", label: "健康趋势", icon: Activity },
  { id: "vitals", label: "实时监测", icon: Heart },
  { id: "meds", label: "医嘱用药", icon: Pill },
  { id: "notes", label: "护理记录", icon: ClipboardList },
  { id: "profile", label: "基础信息", icon: FileText },
] as const;

export default function ElderlyDetail() {
  const { id = "" } = useParams();
  const elderlyList = useHub((s) => s.elderly);
  const allVitals = useHub((s) => s.vitals);
  const allVitalsHistory = useHub((s) => s.vitalsHistory);
  const allMeds = useHub((s) => s.meds);
  const allNotes = useHub((s) => s.notes);
  const allDevices = useHub((s) => s.devices);
  const allTasks = useHub((s) => s.tasks);
  const staff = useHub((s) => s.staff);
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("trend");

  const e = useMemo(() => elderlyList.find((x) => x.id === id), [elderlyList, id]);
  const vitals = useMemo(() => allVitals[id], [allVitals, id]);
  const history = useMemo(() => allVitalsHistory[id] ?? [], [allVitalsHistory, id]);
  const meds = useMemo(() => allMeds.filter((m) => m.elderlyId === id), [allMeds, id]);
  const notes = useMemo(() => allNotes.filter((n) => n.elderlyId === id), [allNotes, id]);
  const devices = useMemo(() => allDevices.filter((d) => d.elderlyId === id), [allDevices, id]);
  const tasks = useMemo(() => allTasks.filter((t) => t.elderlyId === id), [allTasks, id]);

  const trend = useMemo(() => (e ? getTrend(e.id) : []), [e]);

  if (!e) {
    return (
      <div className="text-center py-20">
        <div className="text-[14px] text-ink-500">长者不存在或已迁出</div>
        <Link to="/elderly" className="text-moss-700 mt-2 inline-block hover:underline">返回档案列表</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 stagger">
      <div className="flex items-center justify-between">
        <Link to="/elderly" className="inline-flex items-center gap-2 text-[13px] text-ink-500 hover:text-moss-700">
          <ArrowLeft className="h-4 w-4" /> 返回档案列表
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<Camera className="h-4 w-4" />}>添加记录</Button>
          <Button icon={<FileText className="h-4 w-4" />}>生成健康报告</Button>
        </div>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #C8A45C 0%, transparent 60%)" }} />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-5">
            <Avatar name={e.name} size={84} ring={e.riskLevel} />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-[32px] font-semibold text-ink-600 leading-none">{e.name}</h2>
                <Badge tone={e.riskLevel === "high" ? "alert" : e.riskLevel === "medium" ? "warn" : "safe"}>
                  {e.riskLevel === "high" ? "高风险" : e.riskLevel === "medium" ? "关注" : "稳定"}
                </Badge>
                <Badge tone="ink">护理等级 {e.careLevel}</Badge>
              </div>
              <div className="text-[13.5px] text-ink-500 mt-2">
                {e.age} 岁 · {e.gender} · 房间 {e.roomId.replace("R", "")} 床位 {e.bedNo} · 入住 {e.admissionAt}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {e.chronic.map((c) => (
                  <span key={c} className="rounded-md bg-moss-50 text-moss-700 px-2 py-0.5 text-[11.5px] font-medium">{c}</span>
                ))}
                {e.allergies.length > 0 && (
                  <span className="rounded-md bg-alert/10 text-alert px-2 py-0.5 text-[11.5px] font-medium">过敏 · {e.allergies.join("、")}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Vital label="心率" value={vitals?.heartRate} unit="bpm" series={history.slice(-30).map((h) => h.heartRate)} color="#C8553D" />
            <Vital label="SpO₂" value={vitals?.spo2} unit="%" series={history.slice(-30).map((h) => h.spo2)} color="#5A6B7B" />
            <Vital label="收缩压" value={vitals?.systolic} unit="mmHg" series={history.slice(-30).map((h) => h.systolic)} color="#D9A441" />
            <Vital label="体温" value={vitals?.temperature?.toFixed(1)} unit="°C" series={history.slice(-30).map((h) => h.temperature)} color="#7FB59C" />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-1 border-b border-ink-100">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative h-10 px-4 inline-flex items-center gap-1.5 text-[13px] font-medium transition ${tab === t.id ? "text-moss-700" : "text-ink-400 hover:text-ink-600"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {tab === t.id && <span className="absolute left-2 right-2 -bottom-px h-[2px] bg-moss-700 rounded-full" />}
            </button>
          );
        })}
      </div>

      {tab === "trend" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card className="xl:col-span-2" title="30 天体征趋势" description="关键健康指标变化">
            <LineChart
              height={240}
              labels={trend.map((p) => p.date)}
              series={[
                { name: "心率 (bpm)", color: "#2F4A3A", data: trend.map((p) => p.heartRate) },
                { name: "收缩压 (mmHg)", color: "#C8553D", data: trend.map((p) => p.systolic) },
              ]}
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <LineChart
                height={140}
                labels={trend.map((p) => p.date)}
                showLegend={false}
                showGrid={false}
                yMin={90}
                yMax={100}
                series={[{ name: "SpO₂", color: "#5A6B7B", data: trend.map((p) => p.spo2) }]}
              />
              <LineChart
                height={140}
                labels={trend.map((p) => p.date)}
                showLegend={false}
                showGrid={false}
                series={[{ name: "步数", color: "#C8A45C", data: trend.map((p) => p.steps) }]}
              />
            </div>
          </Card>
          <div className="space-y-5">
            <Card title="健康评分" description="AI 综合评估">
              <div className="flex items-center gap-4">
                <Ring value={e.riskLevel === "high" ? 62 : e.riskLevel === "medium" ? 78 : 88} color="#2F4A3A" sub="综合" />
                <div className="flex-1 space-y-2 text-[13px]">
                  <ScoreRow label="心血管" value={e.chronic.includes("高血压") ? 64 : 82} />
                  <ScoreRow label="呼吸系统" value={e.chronic.includes("慢性阻塞性肺病") ? 60 : 86} />
                  <ScoreRow label="认知与情绪" value={e.chronic.includes("阿尔茨海默症中期") ? 55 : 88} />
                  <ScoreRow label="活动能力" value={e.chronic.includes("脑卒中后遗症") ? 58 : 85} />
                </div>
              </div>
            </Card>
            <Card title="今日步态轨迹" description="毫米波雷达 + 定位信标">
              <div className="relative h-32 card-flat overflow-hidden">
                <svg viewBox="0 0 300 130" className="w-full h-full">
                  <rect x="0" y="0" width="300" height="130" fill="#F4EFE6" />
                  <path d="M 0 80 L 300 80" stroke="#E2E4E1" strokeDasharray="4 4" />
                  <path d="M 30 100 Q 80 50 120 70 T 220 30 T 290 60" stroke="#2F4A3A" fill="none" strokeWidth="2" />
                  {[30, 70, 110, 150, 190, 230, 270].map((x, i) => (
                    <circle key={i} cx={x} cy={i % 2 === 0 ? 80 - i * 5 : 60 + i * 3} r="3" fill="#C8A45C" />
                  ))}
                </svg>
                <div className="absolute top-2 left-2 text-[10px] text-ink-400 font-mono">走廊 1F · 1h 24m</div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px]">
                <Step label="活动距离" value="312 m" />
                <Step label="有效步数" value="486" />
                <Step label="久坐提醒" value="2 次" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "vitals" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Card title="心电实时波形" description={`心率 ${vitals?.heartRate ?? "—"} bpm · 来自 智能手环 ${devices.find((d) => d.type === "智能手环")?.id ?? "—"}`}>
            <RealTimeECG bpm={vitals?.heartRate ?? 72} color="#C8553D" height={140} width={620} />
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Vital label="呼吸" value={vitals?.respRate} unit="次/分" series={history.slice(-30).map((h) => h.respRate)} color="#2F4A3A" />
              <Vital label="体温" value={vitals?.temperature?.toFixed(1)} unit="°C" series={history.slice(-30).map((h) => h.temperature)} color="#7FB59C" />
              <Vital label="舒张压" value={vitals?.diastolic} unit="mmHg" series={history.slice(-30).map((h) => h.diastolic)} color="#D9A441" />
            </div>
          </Card>
          <Card title="睡眠监测" description="过去 7 天">
            <SleepMock />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <Step label="平均睡眠" value="6.2 h" />
              <Step label="深睡占比" value="22%" />
              <Step label="觉醒次数" value="4.3" />
            </div>
          </Card>
        </div>
      )}

      {tab === "meds" && (
        <Card title="长期医嘱" description={`${meds.length} 项在用 · 主诊医生：白霁川`}>
          <div className="divide-y divide-ink-100/70">
            {meds.map((m) => (
              <div key={m.id} className="flex items-center gap-4 py-3">
                <div className="h-10 w-10 rounded-xl bg-moss-50 text-moss-700 flex items-center justify-center">
                  <Pill className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-ink-600">{m.name} <span className="font-mono text-ink-500 text-[12px]">{m.dosage}</span></div>
                  <div className="text-[12px] text-ink-400 mt-0.5">{m.frequency}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-ink-400">起始</div>
                  <div className="font-mono text-[12px] text-ink-500">{m.startAt}</div>
                </div>
              </div>
            ))}
            {meds.length === 0 && <div className="py-6 text-center text-ink-400 text-[13px]">暂无长期医嘱</div>}
          </div>
        </Card>
      )}

      {tab === "notes" && (
        <Card title="护理记录" description={`累计 ${notes.length} 条`}>
          <div className="space-y-3">
            {notes.map((n) => {
              const s = staff.find((x) => x.id === n.staffId);
              return (
                <div key={n.id} className="card-flat p-4 flex items-start gap-3">
                  <Avatar name={s?.name ?? "·"} size={36} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
                      <span className="font-semibold text-ink-600">{s?.name}</span>
                      <Badge tone="moss">{n.type}</Badge>
                      {n.photos && <Badge tone="info">📷 {n.photos}</Badge>}
                      <span className="ml-auto font-mono text-[11px] text-ink-300">{formatRelative(n.createdAt)}</span>
                    </div>
                    <div className="mt-1.5 text-[13.5px] text-ink-600 leading-relaxed">{n.content}</div>
                  </div>
                </div>
              );
            })}
            {notes.length === 0 && <div className="py-6 text-center text-ink-400 text-[13px]">暂无护理记录</div>}
          </div>
        </Card>
      )}

      {tab === "profile" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card title="紧急联系人" description="按优先级排列">
            <div className="space-y-3">
              {[e.emergencyContact, ...e.family].map((c, i) => (
                <div key={i} className="card-flat p-3 flex items-center gap-3">
                  <Avatar name={c.name} size={36} />
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-ink-600">{c.name} <span className="text-ink-400 text-[12px] ml-1">{c.relation}</span></div>
                    <div className="font-mono text-[12px] text-ink-500 mt-0.5 inline-flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="入住与房间" description="基本信息">
            <div className="space-y-3 text-[13px] text-ink-600">
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="入住日期" value={e.admissionAt} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="房间" value={`${e.roomId.replace("R", "")} 床位 ${e.bedNo}`} />
              <InfoRow icon={<Heart className="h-4 w-4" />} label="慢病管理" value={e.chronic.join("、") || "无"} />
              <InfoRow icon={<Pill className="h-4 w-4" />} label="过敏史" value={e.allergies.join("、") || "无"} />
              <InfoRow icon={<FileText className="h-4 w-4" />} label="护理备注" value={e.notes ?? "—"} />
            </div>
          </Card>
          <Card title="关联照护任务" description="进行中与待执行">
            <div className="space-y-2">
              {tasks.slice(0, 5).map((t) => (
                <div key={t.id} className="card-flat p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-ink-600">{t.title}</div>
                    <div className="text-[11px] text-ink-400 mt-0.5">{formatDate(t.scheduledAt)}</div>
                  </div>
                  <Badge tone={t.status === "进行中" ? "warn" : t.status === "已完成" ? "safe" : "info"}>{t.status}</Badge>
                </div>
              ))}
              {tasks.length === 0 && <div className="text-center py-6 text-ink-400 text-[13px]">无任务</div>}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Vital({ label, value, unit, series, color }: { label: string; value?: number | string; unit: string; series: number[]; color: string }) {
  return (
    <div className="card-flat p-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400">{label}</div>
      <div className="flex items-end justify-between gap-2 mt-1">
        <div className="font-display text-[20px] font-semibold text-ink-600 tabular leading-none">
          {value ?? "—"}
          <span className="text-[10px] text-ink-400 ml-0.5 font-sans">{unit}</span>
        </div>
        <Sparkline data={series} width={90} height={22} stroke={color} fill={`${color}22`} />
      </div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] text-ink-500">
        <span>{label}</span>
        <span className="font-mono font-semibold text-ink-600">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-ink-50 mt-1 overflow-hidden">
        <div className="h-full rounded-full bg-moss-700" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Step({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-flat p-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-400">{label}</div>
      <div className="font-display text-[18px] font-semibold text-ink-600 tabular leading-tight">{value}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-moss-50 text-moss-700 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <div className="text-[12px] text-ink-400">{label}</div>
        <div className="text-[14px] text-ink-600 font-medium">{value}</div>
      </div>
    </div>
  );
}

function SleepMock() {
  // 7 列睡眠柱
  return (
    <div className="space-y-3">
      {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((d, i) => {
        const total = 6 + Math.sin(i) * 0.7;
        const deep = 1.4 + Math.cos(i) * 0.3;
        const light = total - deep - 0.4;
        return (
          <div key={d} className="flex items-center gap-3 text-[12px]">
            <div className="w-10 text-ink-400">{d}</div>
            <div className="flex-1 h-5 rounded-full bg-ink-50 overflow-hidden flex">
              <div className="h-full bg-moss-700" style={{ width: `${(deep / total) * 100}%` }} />
              <div className="h-full bg-sand-400" style={{ width: `${(light / total) * 100}%` }} />
            </div>
            <div className="w-14 text-right font-mono text-ink-500">{total.toFixed(1)} h</div>
          </div>
        );
      })}
      <div className="flex items-center gap-3 text-[11px] text-ink-400 pt-1">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-moss-700" />深睡</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sand-400" />浅睡</span>
      </div>
    </div>
  );
}
