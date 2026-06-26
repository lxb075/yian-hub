import { useMemo, useState } from "react";
import { useHub } from "@/store/hub";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/widgets/ElderCard";
import { Video, MessageCircle, Send, Calendar, Phone, Check, Clock, Sparkles, Image as ImageIcon, Mail } from "lucide-react";
import { formatRelative, formatDate } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function Family() {
  const messages = useHub((s) => s.messages);
  const visits = useHub((s) => s.visits);
  const elderly = useHub((s) => s.elderly);
  const readMessage = useHub((s) => s.readMessage);
  const bookVisit = useHub((s) => s.bookVisit);
  const confirmVisit = useHub((s) => s.confirmVisit);

  const [picked, setPicked] = useState<string>(messages[0]?.id ?? "");

  const elderlyMap = new Map(elderly.map((e) => [e.id, e]));
  const cur = messages.find((m) => m.id === picked);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dailyReport = useMemo(() => {
    const e = elderly[0];
    return {
      name: e.name,
      id: e.id,
      meals: { breakfast: "7 分", lunch: "待记录", dinner: "—" },
      vitals: { heartRate: 72, spo2: 96, systolic: 132, diastolic: 80, sleep: 6.4, steps: 1820 },
      mood: "精神良好",
      activities: ["晨间康复训练 20 min", "听戏曲 30 min", "午后棋类活动"],
    };
  }, [elderly]);

  return (
    <div className="space-y-5 stagger">
      <div>
        <div className="text-[12px] uppercase tracking-[0.18em] text-moss-700 font-medium">Family Portal</div>
        <h2 className="font-display text-[28px] font-semibold text-ink-600 mt-1 tracking-tight">家属互动中心</h2>
        <p className="text-[13px] text-ink-500 mt-1">健康日报 · 视频探视预约 · 双向消息 · 缴费与提醒</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          className="xl:col-span-2"
          title="今日健康日报"
          description={`${dailyReport.name} · ${formatDate(today.getTime())}`}
          extra={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon={<Mail className="h-3.5 w-3.5" />}>推送给家属</Button>
              <Button size="sm" icon={<Sparkles className="h-3.5 w-3.5" />}>AI 总结</Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="card-flat p-4">
              <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">生命体征</div>
              <div className="mt-2 space-y-1.5 text-[13px]">
                <Row k="心率" v={`${dailyReport.vitals.heartRate} bpm`} />
                <Row k="血氧" v={`${dailyReport.vitals.spo2} %`} />
                <Row k="血压" v={`${dailyReport.vitals.systolic}/${dailyReport.vitals.diastolic} mmHg`} />
                <Row k="睡眠" v={`${dailyReport.vitals.sleep} h`} />
                <Row k="步数" v={`${dailyReport.vitals.steps}`} />
              </div>
            </div>
            <div className="card-flat p-4">
              <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">进餐情况</div>
              <div className="mt-2 space-y-1.5 text-[13px]">
                <Row k="早餐" v={dailyReport.meals.breakfast} />
                <Row k="午餐" v={dailyReport.meals.lunch} />
                <Row k="晚餐" v={dailyReport.meals.dinner} />
                <Row k="饮水" v="850 ml" />
                <Row k="精神" v={dailyReport.mood} />
              </div>
            </div>
            <div className="card-flat p-4">
              <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">活动安排</div>
              <ul className="mt-2 space-y-1.5 text-[13px] text-ink-600 list-disc pl-4">
                {dailyReport.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 card-flat p-4">
            <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400 mb-2">家属寄语</div>
            <div className="text-[13.5px] text-ink-600 leading-relaxed">
              亲爱的家人们，今日爷爷在康复师阮老师的陪伴下完成了 20 分钟的肢体训练，下午和老伙伴们下了两盘象棋，心情愉悦。 晚饭建议清淡，护工会协助按医嘱用药。
            </div>
            <div className="mt-3 text-[11.5px] text-ink-400">由 责任护士 苏念卿 整理 · AI 摘要润色</div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card
            title={
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4 text-moss-700" />
                视频探视
              </span>
            }
            description="预约与即时连线"
          >
            <div className="aspect-[4/3] card-flat bg-gradient-to-br from-moss-700 to-moss-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0%, transparent 50%)" }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-sand-50">
                <Avatar name="周文澜" size={64} />
                <div className="mt-3 font-display text-[18px]">周文澜</div>
                <div className="text-[12px] text-sand-200 mt-0.5">长子 · 关联 长者 E001</div>
                <div className="mt-3 text-[12px] font-mono">连线中 · 00:06:42</div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" icon={<Phone className="h-3.5 w-3.5" />}>挂断</Button>
                <Button size="sm" variant="secondary" icon={<Video className="h-3.5 w-3.5" />}>切换摄像头</Button>
                <Button size="sm" variant="secondary" icon={<MessageCircle className="h-3.5 w-3.5" />}>字幕</Button>
              </div>
            </div>
            <div className="mt-3 text-[12px] text-ink-500">
              <Calendar className="h-3.5 w-3.5 inline mr-1" /> 下一个预约：沈明玥 · 明日 16:00
            </div>
          </Card>

          <Card title="预约日历" description="未来 7 天视频探视">
            <div className="space-y-2">
              {visits.map((v) => {
                const e = elderlyMap.get(v.elderlyId);
                return (
                  <div key={v.id} className="card-flat p-3 flex items-center gap-3">
                    <div className="w-12 text-center">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-400">{v.date.slice(5, 7)}月</div>
                      <div className="font-display text-[20px] font-semibold text-ink-600 leading-none">{v.date.slice(8, 10)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-ink-600">{v.familyName}</div>
                      <div className="text-[11px] text-ink-400 mt-0.5">{e?.name} · {v.slot} · {v.duration} 分钟</div>
                    </div>
                    <Badge tone={v.status === "已确认" ? "safe" : v.status === "待确认" ? "warn" : v.status === "已完成" ? "ink" : "alert"}>
                      {v.status}
                    </Badge>
                    {v.status === "待确认" && (
                      <Button size="sm" icon={<Check className="h-3.5 w-3.5" />} onClick={() => confirmVisit(v.id)}>确认</Button>
                    )}
                  </div>
                );
              })}
            </div>
            <Button
              className="w-full mt-3"
              variant="outline"
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => bookVisit({ elderlyId: "E001", familyName: "周文澜", date: formatDate(Date.now() + 3 * 86_400_000), slot: "14:30", duration: 30 })}
            >
              快速预约
            </Button>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          className="xl:col-span-2"
          title="消息中心"
          description="家属 · 护工 · 医生 三方消息"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[420px]">
            <div className="md:col-span-1 border border-ink-100 rounded-xl overflow-y-auto bg-sand-50/40">
              {messages.map((m) => {
                const e = elderlyMap.get(m.elderlyId);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setPicked(m.id);
                      readMessage(m.id);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-3 border-b border-ink-100/70 hover:bg-white transition",
                      picked === m.id && "bg-white",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar name={m.from} size={28} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-[12.5px] font-semibold text-ink-600 truncate">{m.from}</div>
                          {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-alert" />}
                        </div>
                        <div className="text-[11px] text-ink-400 mt-0.5 flex items-center gap-1">
                          <span className="rounded bg-ink-50 px-1 text-[10px]">{m.type}</span>
                          {e?.name}
                        </div>
                        <div className="text-[12px] text-ink-500 mt-1 line-clamp-1">{m.preview}</div>
                      </div>
                    </div>
                    <div className="text-[10.5px] text-ink-300 mt-1 font-mono">{formatRelative(m.ts)}</div>
                  </button>
                );
              })}
            </div>
            <div className="md:col-span-2 card-flat p-4 flex flex-col">
              {cur ? (
                <>
                  <div className="flex items-center gap-3 border-b border-ink-100/70 pb-3">
                    <Avatar name={cur.from} size={36} />
                    <div>
                      <div className="text-[14px] font-semibold text-ink-600">{cur.from}</div>
                      <div className="text-[11px] text-ink-400">关联长者：{elderlyMap.get(cur.elderlyId)?.name}</div>
                    </div>
                    <Badge tone="moss" className="ml-auto">
                      <Clock className="h-3 w-3" /> {formatRelative(cur.ts)}
                    </Badge>
                  </div>
                  <div className="flex-1 py-4 space-y-3 text-[13.5px] text-ink-600 leading-relaxed">
                    <p>{cur.preview}</p>
                    {cur.type === "日报" && (
                      <div className="card-flat p-3 text-[12.5px] text-ink-500">
                        包含 12 项生命体征、3 项进餐记录、2 条活动安排，已加密发送给授权家属。
                      </div>
                    )}
                    {cur.type === "预约" && (
                      <div className="card-flat p-3 text-[12.5px] text-ink-500">
                        预约请求已转发给责任护士，状态将在 2 小时内更新。
                      </div>
                    )}
                  </div>
                  <div className="border-t border-ink-100/70 pt-3 flex items-center gap-2">
                    <input
                      placeholder="输入回复..."
                      className="flex-1 h-10 rounded-xl border border-ink-100 bg-white/70 px-3 text-[13px] outline-none focus:border-moss-700/60"
                    />
                    <Button variant="outline" size="sm" icon={<ImageIcon className="h-3.5 w-3.5" />}>图片</Button>
                    <Button size="sm" icon={<Send className="h-3.5 w-3.5" />}>发送</Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-ink-400 text-[13px]">选择左侧消息开始对话</div>
              )}
            </div>
          </div>
        </Card>

        <Card title="家属满意度" description="本月 NPS">
          <div className="text-center">
            <div className="font-display text-[56px] font-semibold text-moss-700 tabular leading-none">+72</div>
            <div className="text-[12px] text-ink-400 mt-1">NPS · 较上月 +6</div>
          </div>
          <div className="mt-4 space-y-2 text-[12.5px]">
            {[
              { k: "响应及时", v: 92 },
              { k: "护理专业", v: 88 },
              { k: "沟通透明", v: 84 },
              { k: "环境舒适", v: 78 },
            ].map((r) => (
              <div key={r.k}>
                <div className="flex items-center justify-between text-ink-500">
                  <span>{r.k}</span>
                  <span className="font-mono">{r.v}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-ink-50 overflow-hidden mt-1">
                  <div className="h-full bg-moss-700" style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{k}</span>
      <span className="font-mono text-ink-600 font-medium">{v}</span>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
