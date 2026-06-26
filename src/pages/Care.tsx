import { useMemo, useState } from "react";
import { useHub } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/widgets/ElderCard";
import { Calendar, ChevronLeft, ChevronRight, Check, Clock, Plus, Users } from "lucide-react";
import { dayOfWeekLabel, formatTime } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { Shift, TaskStatus, TaskType } from "@/types";

const shifts: { id: Shift; label: string; color: string }[] = [
  { id: "白班", label: "白班 08:00-16:00", color: "bg-moss-50 text-moss-700" },
  { id: "中班", label: "中班 16:00-00:00", color: "bg-sand-100 text-sand-600" },
  { id: "夜班", label: "夜班 00:00-08:00", color: "bg-info/10 text-info" },
];

const taskTypes: { id: TaskType; label: string }[] = [
  { id: "巡房", label: "巡房" },
  { id: "用药", label: "用药" },
  { id: "量测", label: "量测" },
  { id: "康复", label: "康复" },
  { id: "进餐", label: "进餐" },
  { id: "心理", label: "心理" },
];

const statusTone: Record<TaskStatus, "info" | "warn" | "safe" | "alert"> = {
  待执行: "info",
  进行中: "warn",
  已完成: "safe",
  已超时: "alert",
};

export default function Care() {
  const tasks = useHub((s) => s.tasks);
  const staff = useHub((s) => s.staff);
  const elderly = useHub((s) => s.elderly);
  const updateStatus = useHub((s) => s.updateTaskStatus);
  const addTask = useHub((s) => s.addTask);
  const session = useHub((s) => s.session);

  const [tab, setTab] = useState<"schedule" | "tasks">("tasks");
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const d = new Date();
    const day = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - (day - 1) + weekOffset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const elderlyMap = new Map(elderly.map((e) => [e.id, e]));
  const staffMap = new Map(staff.map((s) => [s.id, s]));

  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "待执行" || t.status === "进行中"), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "已完成"), [tasks]);

  return (
    <div className="space-y-5 stagger">
      <div>
        <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">Shift · Task · Care</div>
        <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">照护任务中心</h2>
        <p className="text-[13px] text-ink-500 mt-1">排班 · 任务执行 · 护理记录留痕 · 工时自动统计</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">今日待执行</div>
          <div className="mt-1 font-display text-[30px] font-semibold text-ink-600 tabular leading-none">{pendingTasks.length}</div>
          <div className="text-[12px] text-ink-400 mt-1">已分配责任人</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-safe">已完成</div>
          <div className="mt-1 font-display text-[30px] font-semibold text-ink-600 tabular leading-none">{doneTasks.length}</div>
          <div className="text-[12px] text-ink-400 mt-1">闭环率 88%</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-alert">已超时</div>
          <div className="mt-1 font-display text-[30px] font-semibold text-ink-600 tabular leading-none">{tasks.filter((t) => t.status === "已超时").length}</div>
          <div className="text-[12px] text-ink-400 mt-1">需立即跟进</div>
        </Card>
        <Card>
          <div className="text-[12px] uppercase tracking-[0.16em] text-info">护理工时</div>
          <div className="mt-1 font-display text-[30px] font-semibold text-ink-600 tabular leading-none">182.5<span className="text-[14px] text-ink-400 ml-0.5">h</span></div>
          <div className="text-[12px] text-ink-400 mt-1">本周已累计</div>
        </Card>
      </div>

      <div className="flex items-center gap-1 border-b border-ink-100">
        {[
          { id: "tasks", label: "任务执行" },
          { id: "schedule", label: "排班总览" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as "tasks" | "schedule")}
            className={cn(
              "relative h-10 px-4 inline-flex items-center gap-1.5 text-[13px] font-medium transition",
              tab === t.id ? "text-moss-700" : "text-ink-400 hover:text-ink-600",
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute left-2 right-2 -bottom-px h-[2px] bg-moss-700 rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "tasks" ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Card
              className="xl:col-span-2"
              title="待执行任务"
              description="按计划时间排序"
              extra={<Button size="sm" icon={<Plus className="h-3.5 w-3.5" />}>新增任务</Button>}
            >
              <div className="space-y-2">
                {pendingTasks.map((t) => {
                  const e = elderlyMap.get(t.elderlyId);
                  const s = staffMap.get(t.staffId);
                  return (
                    <div key={t.id} className="card-flat p-3 flex items-center gap-4">
                      <div className="w-14 text-center">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-ink-400">
                          {new Date(t.scheduledAt).getHours() < 12 ? "上午" : "下午"}
                        </div>
                        <div className="font-display text-[18px] font-semibold text-ink-600 leading-none">{formatTime(t.scheduledAt)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge tone={t.type === "用药" ? "alert" : t.type === "量测" ? "info" : "moss"}>{t.type}</Badge>
                          <span className="text-[13.5px] font-semibold text-ink-600 truncate">{t.title}</span>
                        </div>
                        <div className="text-[12px] text-ink-400 mt-1 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{e?.name}</span>
                          <span>· 责任 {s?.name}</span>
                        </div>
                      </div>
                      <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                      {t.status === "待执行" && (
                        <Button
                          size="sm"
                          icon={<Check className="h-3.5 w-3.5" />}
                          onClick={() => updateStatus(t.id, "已完成")}
                        >
                          完成
                        </Button>
                      )}
                    </div>
                  );
                })}
                {pendingTasks.length === 0 && <div className="text-center py-8 text-ink-400 text-[13px]">无待执行任务</div>}
              </div>
            </Card>

            <Card title="执行进度" description="今日完成情况">
              <div className="text-center">
                <div className="font-display text-[48px] font-semibold text-ink-600 tabular leading-none">
                  {Math.round((doneTasks.length / Math.max(1, tasks.length)) * 100)}<span className="text-[20px]">%</span>
                </div>
                <div className="text-[12px] text-ink-400 mt-1">完成 {doneTasks.length} / 总 {tasks.length}</div>
              </div>
              <div className="mt-4 space-y-2 text-[12.5px]">
                {taskTypes.map((tt) => {
                  const total = tasks.filter((t) => t.type === tt.id).length;
                  const done = tasks.filter((t) => t.type === tt.id && t.status === "已完成").length;
                  const pct = total ? (done / total) * 100 : 0;
                  return (
                    <div key={tt.id}>
                      <div className="flex items-center justify-between text-ink-500">
                        <span>{tt.label}</span>
                        <span className="font-mono text-ink-600">{done}/{total}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-ink-50 overflow-hidden mt-1">
                        <div className="h-full bg-moss-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card title="今日已完成" description="留痕可追溯">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {doneTasks.map((t) => {
                const e = elderlyMap.get(t.elderlyId);
                const s = staffMap.get(t.staffId);
                return (
                  <div key={t.id} className="card-flat p-3 flex items-center gap-3">
                    <Avatar name={s?.name ?? "·"} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-ink-600 truncate">{t.title}</div>
                      <div className="text-[11px] text-ink-400 mt-0.5">{e?.name} · {formatTime(t.scheduledAt)}</div>
                    </div>
                    <Badge tone="safe" variant="outline">
                      <Check className="h-3 w-3" /> 完成
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      ) : (
        <Card
          title={
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-moss-700" />
              排班总览 · 本周
            </span>
          }
          description="支持拖拽调整班次（演示）"
          extra={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" icon={<ChevronLeft className="h-3.5 w-3.5" />} onClick={() => setWeekOffset((o) => o - 1)} />
              <span className="text-[12px] font-mono text-ink-500 w-32 text-center">
                {weekDays[0].toISOString().slice(0, 10)} ~ {weekDays[6].toISOString().slice(0, 10)}
              </span>
              <Button size="sm" variant="ghost" icon={<ChevronRight className="h-3.5 w-3.5" />} onClick={() => setWeekOffset((o) => o + 1)} />
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 min-w-[820px]">
              <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400 px-3 py-2">员工</div>
              {weekDays.map((d) => {
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <div key={d.toISOString()} className={cn("text-center px-3 py-2", isToday ? "bg-moss-50 rounded-xl" : "")}>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-ink-400">周{dayOfWeekLabel(d)}</div>
                    <div className="font-display text-[18px] font-semibold text-ink-600 leading-none">{d.getDate()}</div>
                  </div>
                );
              })}
              {staff.filter((s) => s.role !== "管理员").map((s) => (
                <div key={s.id} className="contents">
                  <div className="flex items-center gap-2 px-3 py-3 border-t border-ink-100/70">
                    <Avatar name={s.name} size={28} />
                    <div>
                      <div className="text-[12.5px] font-semibold text-ink-600">{s.name}</div>
                      <div className="text-[10.5px] text-ink-400">{s.title.split("·")[0]}</div>
                    </div>
                  </div>
                  {weekDays.map((d, di) => {
                    const s_shift = shifts[(di + s.name.length) % 3].id;
                    const c = shifts.find((x) => x.id === s_shift)!;
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <div key={d.toISOString()} className={cn("border-t border-l border-ink-100/70 p-2", isToday && "bg-moss-50/40")}>
                        <div className={cn("rounded-lg px-2 py-1.5 text-[11.5px] font-medium text-center", c.color)}>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {c.label.split(" ")[0]}
                        </div>
                        <div className="mt-1 text-[10.5px] text-ink-400 text-center font-mono">
                          {s_shift === "白班" ? "08 - 16" : s_shift === "中班" ? "16 - 00" : "00 - 08"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
