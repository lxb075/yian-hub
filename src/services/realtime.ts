import { useHub } from "@/store/hub";
import type { AlertItem, AlertLevel, AlertType, Vitals } from "@/types";

let timer: number | null = null;
let alertTimer: number | null = null;

const typeForLevel: Record<AlertLevel, AlertType[]> = {
  critical: ["SOS 紧急呼叫", "跌倒检测"],
  warning: ["心率异常", "血压异常", "血氧偏低", "体温异常"],
  info: ["设备离线", "用药未确认", "长时间未活动"],
};

function pickType(level: AlertLevel): AlertType {
  const list = typeForLevel[level];
  return list[Math.floor(Math.random() * list.length)];
}

function makeMessage(type: AlertType, vital?: Vitals): string {
  switch (type) {
    case "心率异常":
      return vital ? `心率 ${vital.heartRate} bpm，超出基线 30%` : "心率持续异常";
    case "血氧偏低":
      return vital ? `SpO2 ${vital.spo2}%，持续低于 92%` : "血氧持续偏低";
    case "血压异常":
      return vital ? `血压 ${vital.systolic}/${vital.diastolic} mmHg 异常` : "血压异常";
    case "体温异常":
      return vital ? `体温 ${vital.temperature.toFixed(1)}°C 异常` : "体温异常";
    case "跌倒检测":
      return "跌倒检测传感器触发";
    case "SOS 紧急呼叫":
      return "SOS 按钮被按下";
    case "设备离线":
      return "生命手环离线超过 20 分钟";
    case "用药未确认":
      return "智能药盒 30 分钟内未确认";
    case "长时间未活动":
      return "房间内 2 小时无活动信号";
    default:
      return "异常告警";
  }
}

export function startRealtimeSimulation() {
  const hub = useHub.getState();
  if (hub.session == null) return;

  if (timer) window.clearInterval(timer);
  timer = window.setInterval(() => {
    const s = useHub.getState();
    if (!s.session) return;
    const next: Record<string, Vitals> = { ...s.vitals };
    s.elderly.forEach((e) => {
      const cur = s.vitals[e.id];
      if (!cur) return;
      // 简单随机游走
      const drift = (base: number, range: number, drift: number) =>
        Math.max(0, Math.round(base + (Math.random() - 0.5) * range + drift));

      const hr = drift(cur.heartRate, 4, e.riskLevel === "high" ? (Math.random() - 0.6) * 0.4 : (Math.random() - 0.5) * 0.2);
      const spo2 = Math.min(100, Math.max(85, cur.spo2 + Math.round((Math.random() - 0.5) * 1.4)));
      const sys = drift(cur.systolic, 3, e.riskLevel === "high" ? (Math.random() - 0.55) * 0.3 : 0);
      const dia = drift(cur.diastolic, 2, 0);
      const temp = Math.max(35.8, Math.min(38.2, cur.temperature + (Math.random() - 0.5) * 0.05));
      const resp = drift(cur.respRate, 2, 0);
      const vital: Vitals = {
        ts: Date.now(),
        heartRate: hr,
        spo2,
        systolic: sys,
        diastolic: dia,
        temperature: Number(temp.toFixed(1)),
        respRate: resp,
      };
      next[e.id] = vital;
      s.pushVitalPoint(e.id, vital);
    });
    useHub.setState({ vitals: next });
  }, 1500);

  if (alertTimer) window.clearInterval(alertTimer);
  alertTimer = window.setInterval(() => {
    const s = useHub.getState();
    if (!s.session) return;
    if (Math.random() > 0.35) return; // 降低频率
    const e = s.elderly[Math.floor(Math.random() * s.elderly.length)];
    const level: AlertLevel = Math.random() < 0.12 ? "critical" : Math.random() < 0.5 ? "warning" : "info";
    const type = pickType(level);
    const vital = s.vitals[e.id];
    const id = `A${Date.now().toString(36).toUpperCase()}`;
    const alert: AlertItem = {
      id,
      elderlyId: e.id,
      type,
      level,
      status: "待处置",
      message: makeMessage(type, vital),
      location: `${Math.floor(parseInt(e.roomId.slice(1)) / 100)}F · ${e.roomId.replace("R", "")}`,
      assigneeId: e.primaryNurse,
      createdAt: Date.now(),
      timeline: [{ ts: Date.now(), action: "系统识别异常，自动生成告警", actor: "AI Engine" }],
    };
    s.addAlert(alert);
  }, 14_000);
}

export function stopRealtimeSimulation() {
  if (timer) window.clearInterval(timer);
  if (alertTimer) window.clearInterval(alertTimer);
  timer = null;
  alertTimer = null;
}
