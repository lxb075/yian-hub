import type {
  Elderly,
  Room,
  Staff,
  Device,
  CareTask,
  MedOrder,
  NursingNote,
  Schedule,
  Message,
  VisitBooking,
  HealthTrendPoint,
  AuditLog,
  FloorStatus,
  Vitals,
  AlertItem,
} from "@/types";

// === 长者档案 ===
export const seedElderly: Elderly[] = [
  {
    id: "E001",
    name: "周锦书",
    age: 82,
    gender: "男",
    roomId: "R301",
    bedNo: "A",
    riskLevel: "high",
    careLevel: "特级",
    chronic: ["高血压", "冠心病", "轻度认知障碍"],
    allergies: ["青霉素"],
    admissionAt: "2021-03-12",
    emergencyContact: { name: "周文澜", relation: "长子", phone: "138-0011-2233" },
    primaryDoctor: "S007",
    primaryNurse: "S003",
    family: [
      { name: "周文澜", relation: "长子", phone: "138-0011-2233" },
      { name: "周清扬", relation: "次女", phone: "139-1144-5566" },
    ],
    notes: "夜间常起夜，床边需设软垫；偏好清淡饮食。",
  },
  {
    id: "E002",
    name: "陆婉清",
    age: 76,
    gender: "女",
    roomId: "R302",
    bedNo: "A",
    riskLevel: "medium",
    careLevel: "一级",
    chronic: ["2 型糖尿病", "骨质疏松"],
    allergies: [],
    admissionAt: "2022-07-04",
    emergencyContact: { name: "陆思源", relation: "女儿", phone: "136-7788-9900" },
    primaryDoctor: "S007",
    primaryNurse: "S003",
    family: [{ name: "陆思源", relation: "女儿", phone: "136-7788-9900" }],
  },
  {
    id: "E003",
    name: "沈伯远",
    age: 88,
    gender: "男",
    roomId: "R303",
    bedNo: "A",
    riskLevel: "high",
    careLevel: "特级",
    chronic: ["脑卒中后遗症", "高血压"],
    allergies: ["磺胺类"],
    admissionAt: "2020-11-20",
    emergencyContact: { name: "沈明玥", relation: "孙女", phone: "135-3322-1100" },
    primaryDoctor: "S007",
    primaryNurse: "S003",
    family: [{ name: "沈明玥", relation: "孙女", phone: "135-3322-1100" }],
    notes: "右侧偏瘫，需协助翻身；每周三次康复训练。",
  },
  {
    id: "E004",
    name: "苏锦瑟",
    age: 79,
    gender: "女",
    roomId: "R305",
    bedNo: "B",
    riskLevel: "low",
    careLevel: "二级",
    chronic: ["轻度贫血"],
    allergies: [],
    admissionAt: "2023-02-15",
    emergencyContact: { name: "苏仲怀", relation: "侄子", phone: "137-6655-4433" },
    primaryDoctor: "S007",
    primaryNurse: "S005",
    family: [{ name: "苏仲怀", relation: "侄子", phone: "137-6655-4433" }],
  },
  {
    id: "E005",
    name: "顾慎之",
    age: 84,
    gender: "男",
    roomId: "R306",
    bedNo: "A",
    riskLevel: "medium",
    careLevel: "一级",
    chronic: ["慢性阻塞性肺病"],
    allergies: ["海鲜"],
    admissionAt: "2021-09-08",
    emergencyContact: { name: "顾晓棠", relation: "女儿", phone: "138-2299-1188" },
    primaryDoctor: "S007",
    primaryNurse: "S005",
    family: [{ name: "顾晓棠", relation: "女儿", phone: "138-2299-1188" }],
  },
  {
    id: "E006",
    name: "韩素珍",
    age: 73,
    gender: "女",
    roomId: "R401",
    bedNo: "A",
    riskLevel: "low",
    careLevel: "三级",
    chronic: ["高血脂"],
    allergies: [],
    admissionAt: "2024-01-12",
    emergencyContact: { name: "韩嘉树", relation: "儿子", phone: "139-1010-2020" },
    primaryDoctor: "S007",
    primaryNurse: "S006",
    family: [{ name: "韩嘉树", relation: "儿子", phone: "139-1010-2020" }],
  },
  {
    id: "E007",
    name: "梁叙白",
    age: 91,
    gender: "男",
    roomId: "R402",
    bedNo: "A",
    riskLevel: "high",
    careLevel: "特级",
    chronic: ["阿尔茨海默症中期", "高血压"],
    allergies: [],
    admissionAt: "2019-05-30",
    emergencyContact: { name: "梁书韵", relation: "女儿", phone: "134-5566-7788" },
    primaryDoctor: "S007",
    primaryNurse: "S006",
    family: [{ name: "梁书韵", relation: "女儿", phone: "134-5566-7788" }],
    notes: "易走失，佩戴定位手环，夜间需床栏保护。",
  },
  {
    id: "E008",
    name: "夏慕云",
    age: 68,
    gender: "女",
    roomId: "R403",
    bedNo: "A",
    riskLevel: "low",
    careLevel: "三级",
    chronic: ["糖尿病前期"],
    allergies: [],
    admissionAt: "2024-06-01",
    emergencyContact: { name: "夏予安", relation: "妹妹", phone: "135-7788-2211" },
    primaryDoctor: "S007",
    primaryNurse: "S006",
    family: [{ name: "夏予安", relation: "妹妹", phone: "135-7788-2211" }],
  },
];

// === 楼层房间 ===
export const seedRooms: Room[] = [
  { id: "R301", floor: 3, number: "301", elderlyId: "E001", type: "单人间" },
  { id: "R302", floor: 3, number: "302", elderlyId: "E002", type: "单人间" },
  { id: "R303", floor: 3, number: "303", elderlyId: "E003", type: "单人间" },
  { id: "R305", floor: 3, number: "305", elderlyId: "E004", type: "双人间" },
  { id: "R306", floor: 3, number: "306", elderlyId: "E005", type: "单人间" },
  { id: "R401", floor: 4, number: "401", elderlyId: "E006", type: "套间" },
  { id: "R402", floor: 4, number: "402", elderlyId: "E007", type: "单人间" },
  { id: "R403", floor: 4, number: "403", elderlyId: "E008", type: "套间" },
  { id: "R308", floor: 3, number: "308", type: "双人间" },
  { id: "R309", floor: 3, number: "309", type: "双人间" },
  { id: "R404", floor: 4, number: "404", type: "双人间" },
  { id: "R405", floor: 4, number: "405", type: "单人间" },
  { id: "R501", floor: 5, number: "501", type: "套间" },
  { id: "R502", floor: 5, number: "502", type: "套间" },
  { id: "R503", floor: 5, number: "503", type: "双人间" },
  { id: "R504", floor: 5, number: "504", type: "双人间" },
];

// === 员工 ===
export const seedStaff: Staff[] = [
  { id: "S001", name: "林若华", role: "管理员", title: "机构院长", shift: "白班", phone: "138-0000-0001", online: true, yearsOfService: 12 },
  { id: "S002", name: "陈知微", role: "护工", title: "高级护工", shift: "白班", phone: "138-0000-0002", online: true, yearsOfService: 6 },
  { id: "S003", name: "苏念卿", role: "护士", title: "责任护士 · 3F", shift: "白班", phone: "138-0000-0003", online: true, yearsOfService: 4 },
  { id: "S004", name: "黎星河", role: "护工", title: "护理员 · 3F", shift: "中班", phone: "138-0000-0004", online: true, yearsOfService: 2 },
  { id: "S005", name: "宋怀瑾", role: "护士", title: "责任护士 · 3F", shift: "中班", phone: "138-0000-0005", online: true, yearsOfService: 5 },
  { id: "S006", name: "谢听澜", role: "护士", title: "责任护士 · 4F", shift: "白班", phone: "138-0000-0006", online: true, yearsOfService: 3 },
  { id: "S007", name: "白霁川", role: "医生", title: "内科主任医师", shift: "白班", phone: "138-0000-0007", online: true, yearsOfService: 18 },
  { id: "S008", name: "阮棠溪", role: "康复师", title: "康复治疗师", shift: "白班", phone: "138-0000-0008", online: false, yearsOfService: 7 },
  { id: "S009", name: "傅书行", role: "护工", title: "护理员 · 4F", shift: "夜班", phone: "138-0000-0009", online: true, yearsOfService: 3 },
  { id: "S010", name: "霍轻尘", role: "护士", title: "夜班护士长", shift: "夜班", phone: "138-0000-0010", online: true, yearsOfService: 9 },
];

// === 设备 ===
export const seedDevices: Device[] = [
  { id: "D001", name: "生命守护手环 V3", type: "智能手环", model: "Care-WB3", elderlyId: "E001", battery: 78, online: true, firmware: "v2.4.1", lastHeartbeat: Date.now() - 12_000, installedAt: "2025-02-12" },
  { id: "D002", name: "上臂式血压计", type: "血压计", model: "BP-700", elderlyId: "E001", battery: 100, online: true, firmware: "v1.2.0", lastHeartbeat: Date.now() - 60_000, installedAt: "2025-01-05" },
  { id: "D003", name: "SOS 呼叫器", type: "紧急呼叫器", model: "SOS-Pendant", elderlyId: "E001", battery: 64, online: true, firmware: "v1.0.6", lastHeartbeat: Date.now() - 8_000, installedAt: "2024-12-20" },
  { id: "D004", name: "生命守护手环 V3", type: "智能手环", model: "Care-WB3", elderlyId: "E002", battery: 42, online: true, firmware: "v2.4.1", lastHeartbeat: Date.now() - 4_000, installedAt: "2025-03-02" },
  { id: "D005", name: "睡眠监测带", type: "睡眠带", model: "SleepBand-Pro", elderlyId: "E002", battery: 88, online: true, firmware: "v1.5.2", lastHeartbeat: Date.now() - 18_000, installedAt: "2025-03-10" },
  { id: "D006", name: "定位信标", type: "定位信标", model: "Beacon-X1", elderlyId: "E003", battery: 21, online: true, firmware: "v1.0.3", lastHeartbeat: Date.now() - 5_000, installedAt: "2024-11-08" },
  { id: "D007", name: "跌倒检测垫", type: "跌倒检测垫", model: "Fall-Mat", elderlyId: "E003", battery: 96, online: true, firmware: "v1.1.1", lastHeartbeat: Date.now() - 9_000, installedAt: "2024-10-15" },
  { id: "D008", name: "生命守护手环 V3", type: "智能手环", model: "Care-WB3", elderlyId: "E004", battery: 15, online: true, firmware: "v2.4.1", lastHeartbeat: Date.now() - 6_000, installedAt: "2025-04-18" },
  { id: "D009", name: "智能药盒", type: "智能药盒", model: "PillBox-3", elderlyId: "E005", battery: 72, online: true, firmware: "v1.3.0", lastHeartbeat: Date.now() - 22_000, installedAt: "2025-02-22" },
  { id: "D010", name: "生命守护手环 V3", type: "智能手环", model: "Care-WB3", elderlyId: "E005", battery: 0, online: false, firmware: "v2.3.9", lastHeartbeat: Date.now() - 1_260_000, installedAt: "2024-08-12" },
  { id: "D011", name: "SOS 呼叫器", type: "紧急呼叫器", model: "SOS-Pendant", elderlyId: "E007", battery: 54, online: true, firmware: "v1.0.6", lastHeartbeat: Date.now() - 11_000, installedAt: "2024-07-30" },
  { id: "D012", name: "生命守护手环 V3", type: "智能手环", model: "Care-WB3", elderlyId: "E007", battery: 36, online: true, firmware: "v2.4.1", lastHeartbeat: Date.now() - 3_000, installedAt: "2025-05-04" },
  { id: "D013", name: "烟雾传感器", type: "烟雾传感器", model: "Smoke-2", battery: 100, online: true, firmware: "v1.0.0", lastHeartbeat: Date.now() - 30_000, installedAt: "2024-01-10" },
  { id: "D014", name: "烟雾传感器", type: "烟雾传感器", model: "Smoke-2", battery: 100, online: true, firmware: "v1.0.0", lastHeartbeat: Date.now() - 30_000, installedAt: "2024-01-10" },
  { id: "D015", name: "生命守护手环 V3", type: "智能手环", model: "Care-WB3", elderlyId: "E006", battery: 80, online: true, firmware: "v2.4.1", lastHeartbeat: Date.now() - 7_000, installedAt: "2025-06-01" },
  { id: "D016", name: "生命守护手环 V3", type: "智能手环", model: "Care-WB3", elderlyId: "E008", battery: 67, online: true, firmware: "v2.4.1", lastHeartbeat: Date.now() - 6_000, installedAt: "2025-06-12" },
];

// === 医嘱用药 ===
export const seedMeds: MedOrder[] = [
  { id: "M001", elderlyId: "E001", name: "苯磺酸氨氯地平片", dosage: "5mg", frequency: "每日 1 次 · 早 8:00", startAt: "2025-01-04", doctorId: "S007" },
  { id: "M002", elderlyId: "E001", name: "阿司匹林肠溶片", dosage: "100mg", frequency: "每日 1 次 · 晚 8:00", startAt: "2024-08-21", doctorId: "S007" },
  { id: "M003", elderlyId: "E002", name: "盐酸二甲双胍片", dosage: "0.5g", frequency: "每日 2 次 · 早晚餐", startAt: "2024-09-15", doctorId: "S007" },
  { id: "M004", elderlyId: "E003", name: "阿托伐他汀钙片", dosage: "20mg", frequency: "每日 1 次 · 睡前", startAt: "2024-12-04", doctorId: "S007" },
  { id: "M005", elderlyId: "E005", name: "沙美特罗吸入剂", dosage: "50/250μg", frequency: "每日 2 次", startAt: "2024-05-20", doctorId: "S007" },
  { id: "M006", elderlyId: "E007", name: "多奈哌齐片", dosage: "5mg", frequency: "每日 1 次 · 睡前", startAt: "2024-03-10", doctorId: "S007" },
];

// === 照护任务 ===
const now = Date.now();
export const seedTasks: CareTask[] = [
  { id: "T001", elderlyId: "E001", staffId: "S003", type: "用药", title: "早间用药 · 苯磺酸氨氯地平", scheduledAt: now + 30 * 60_000, status: "待执行" },
  { id: "T002", elderlyId: "E001", staffId: "S003", type: "量测", title: "血压心率复测", scheduledAt: now + 90 * 60_000, status: "待执行" },
  { id: "T003", elderlyId: "E002", staffId: "S003", type: "用药", title: "二甲双胍 · 早餐前", scheduledAt: now - 30 * 60_000, status: "进行中" },
  { id: "T004", elderlyId: "E003", staffId: "S004", type: "巡房", title: "翻身拍背 · 防压疮", scheduledAt: now - 60 * 60_000, status: "已完成" },
  { id: "T005", elderlyId: "E003", staffId: "S008", type: "康复", title: "右侧肢体被动训练", scheduledAt: now + 2 * 60 * 60_000, status: "待执行" },
  { id: "T006", elderlyId: "E005", staffId: "S005", type: "用药", title: "沙美特罗吸入剂", scheduledAt: now - 5 * 60_000, status: "进行中" },
  { id: "T007", elderlyId: "E007", staffId: "S006", type: "巡房", title: "认知唤醒互动", scheduledAt: now + 60 * 60_000, status: "待执行" },
  { id: "T008", elderlyId: "E004", staffId: "S005", type: "进餐", title: "协助午餐", scheduledAt: now + 4 * 60 * 60_000, status: "待执行" },
  { id: "T009", elderlyId: "E006", staffId: "S006", type: "量测", title: "体重测量 · 周记录", scheduledAt: now - 3 * 60 * 60_000, status: "已超时" },
  { id: "T010", elderlyId: "E008", staffId: "S006", type: "心理", title: "周末文娱活动", scheduledAt: now + 24 * 60 * 60_000, status: "待执行" },
];

// === 护理记录 ===
export const seedNotes: NursingNote[] = [
  { id: "N001", elderlyId: "E001", staffId: "S003", type: "量测", content: "上午血压 138/86 mmHg，心率 76 次/分，诉偶有头晕，已提醒坐起缓慢。", createdAt: now - 2 * 60 * 60_000 },
  { id: "N002", elderlyId: "E001", staffId: "S003", type: "用药", content: "氨氯地平 5mg 已于 8:00 服用，配合温水送服。", createdAt: now - 6 * 60 * 60_000 },
  { id: "N003", elderlyId: "E003", staffId: "S004", type: "巡房", content: "夜间每 2 小时翻身 1 次，皮肤无红斑，右踝轻度浮肿。", createdAt: now - 8 * 60 * 60_000 },
  { id: "N004", elderlyId: "E002", staffId: "S003", type: "进餐", content: "早餐进食七分，豆浆 200ml，无噎食。", createdAt: now - 4 * 60 * 60_000 },
  { id: "N005", elderlyId: "E005", staffId: "S005", type: "量测", content: "SpO2 94%，建议增加雾化次数并汇报医生。", createdAt: now - 1 * 60 * 60_000, photos: 1 },
];

// === 排班 ===
export const seedSchedules: Schedule[] = (() => {
  const list: Schedule[] = [];
  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - 3 + d);
    const date = dt.toISOString().slice(0, 10);
    ["S003", "S004", "S005", "S006", "S009", "S010"].forEach((sid, i) => {
      const shift = (["白班", "中班", "夜班"] as const)[(d + i) % 3];
      list.push({ id: `SCH${d}-${sid}`, staffId: sid, date, shift });
    });
  }
  return list;
})();

// === 消息 ===
export const seedMessages: Message[] = [
  { id: "MSG001", elderlyId: "E001", from: "周文澜", to: "S003", type: "文字", preview: "父亲今天胃口怎么样？麻烦您多关照", ts: now - 30 * 60_000, read: false },
  { id: "MSG002", elderlyId: "E003", from: "沈明玥", to: "S003", type: "日报", preview: "【颐安日报】12/05 血压 142/88，神志清醒，进食良好", ts: now - 4 * 60 * 60_000, read: true },
  { id: "MSG003", elderlyId: "E007", from: "梁书韵", to: "S006", type: "预约", preview: "希望预约 12/06 上午 10:00 视频探视", ts: now - 12 * 60 * 60_000, read: true },
  { id: "MSG004", elderlyId: "E002", from: "陆思源", to: "S003", type: "图片", preview: "[图片] 妈妈上个月的相册", ts: now - 26 * 60 * 60_000, read: true },
  { id: "MSG005", elderlyId: "E005", from: "顾晓棠", to: "S005", type: "文字", preview: "雾化机滤芯该换了，麻烦确认", ts: now - 50 * 60_000, read: false },
];

// === 视频探视预约 ===
export const seedVisits: VisitBooking[] = [
  { id: "V001", elderlyId: "E001", familyName: "周文澜", date: formatDate(new Date(Date.now() + 86_400_000)), slot: "10:00", duration: 30, status: "已确认" },
  { id: "V002", elderlyId: "E007", familyName: "梁书韵", date: formatDate(new Date(Date.now() + 2 * 86_400_000)), slot: "15:30", duration: 20, status: "待确认" },
  { id: "V003", elderlyId: "E003", familyName: "沈明玥", date: formatDate(new Date(Date.now() + 86_400_000)), slot: "16:00", duration: 30, status: "已确认" },
  { id: "V004", elderlyId: "E002", familyName: "陆思源", date: formatDate(new Date(Date.now() - 86_400_000)), slot: "10:30", duration: 30, status: "已完成" },
];

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// === 楼层状态（热力） ===
export const seedFloorStatus: FloorStatus[] = [
  {
    floor: 5,
    rooms: seedRooms
      .filter((r) => r.floor === 5)
      .map((r) => ({ id: r.id, number: r.number, elderlyId: r.elderlyId, status: r.elderlyId ? "low" : "empty" })),
  },
  {
    floor: 4,
    rooms: seedRooms
      .filter((r) => r.floor === 4)
      .map((r) => ({ id: r.id, number: r.number, elderlyId: r.elderlyId, status: r.elderlyId ? "medium" : "empty" })),
  },
  {
    floor: 3,
    rooms: seedRooms
      .filter((r) => r.floor === 3)
      .map((r) => ({
        id: r.id,
        number: r.number,
        elderlyId: r.elderlyId,
        status: r.elderlyId === "E001" || r.elderlyId === "E003" || r.elderlyId === "E005" ? "high" : "medium",
      })),
  },
];

// === 健康趋势（30 天 mock） ===
export function buildHealthTrend(): HealthTrendPoint[] {
  const out: HealthTrendPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toISOString().slice(5, 10),
      heartRate: 68 + Math.round(Math.sin(i / 3) * 6 + (Math.random() - 0.5) * 4),
      systolic: 132 + Math.round(Math.sin(i / 4) * 8 + (Math.random() - 0.5) * 6),
      spo2: 95 + Math.round((Math.random() - 0.3) * 4),
      sleep: 5.8 + Math.sin(i / 2.5) * 1.4 + (Math.random() - 0.5) * 0.6,
      steps: 1800 + Math.round(Math.cos(i / 2) * 600 + Math.random() * 800),
    });
  }
  return out;
}

// === 实时生命体征（mock） ===
export function buildInitialVitals(): Record<string, Vitals> {
  const map: Record<string, Vitals> = {};
  seedElderly.forEach((e) => {
    map[e.id] = {
      ts: Date.now(),
      heartRate: 70 + Math.round(Math.random() * 8),
      spo2: 95 + Math.round(Math.random() * 3),
      systolic: 128 + Math.round(Math.random() * 8),
      diastolic: 78 + Math.round(Math.random() * 5),
      temperature: 36.4 + Math.random() * 0.4,
      respRate: 16 + Math.round(Math.random() * 3),
    };
  });
  return map;
}

// === 初始告警 ===
export function buildInitialAlerts(): AlertItem[] {
  const baseTime = Date.now();
  return [
    {
      id: "A001",
      elderlyId: "E001",
      type: "心率异常",
      level: "warning",
      status: "待处置",
      message: "心率 102 bpm，超出基线 30%，持续 2 分钟",
      location: "3F · 301",
      assigneeId: "S003",
      createdAt: baseTime - 5 * 60_000,
      timeline: [
        { ts: baseTime - 5 * 60_000, action: "系统识别异常，自动生成告警", actor: "AI Engine" },
      ],
    },
    {
      id: "A002",
      elderlyId: "E003",
      type: "跌倒检测",
      level: "critical",
      status: "处置中",
      message: "跌倒检测垫触发，房间内无活动信号",
      location: "3F · 303",
      assigneeId: "S004",
      createdAt: baseTime - 12 * 60_000,
      timeline: [
        { ts: baseTime - 12 * 60_000, action: "检测到跌倒冲击", actor: "Fall-Mat" },
        { ts: baseTime - 11 * 60_000, action: "派单至 黎星河 (护工)", actor: "Dispatch" },
        { ts: baseTime - 9 * 60_000, action: "已到达现场，老人清醒", actor: "黎星河" },
      ],
    },
    {
      id: "A003",
      elderlyId: "E005",
      type: "血氧偏低",
      level: "warning",
      status: "待处置",
      message: "SpO2 持续低于 92%，已 4 分钟",
      location: "3F · 306",
      assigneeId: "S005",
      createdAt: baseTime - 18 * 60_000,
      timeline: [{ ts: baseTime - 18 * 60_000, action: "持续低值告警", actor: "AI Engine" }],
    },
    {
      id: "A004",
      elderlyId: "E002",
      type: "用药未确认",
      level: "info",
      status: "待处置",
      message: "二甲双胍 8:00 用药未在 30 分钟内确认",
      location: "3F · 302",
      createdAt: baseTime - 35 * 60_000,
      timeline: [{ ts: baseTime - 35 * 60_000, action: "智能药盒未检测到开盖动作", actor: "PillBox" }],
    },
    {
      id: "A005",
      elderlyId: "E005",
      type: "设备离线",
      level: "info",
      status: "已解决",
      message: "手环 D010 离线超过 20 分钟",
      location: "3F · 306",
      assigneeId: "S005",
      createdAt: baseTime - 2 * 60 * 60_000,
      resolvedAt: baseTime - 60 * 60_000,
      timeline: [
        { ts: baseTime - 2 * 60 * 60_000, action: "设备离线告警", actor: "IoT Hub" },
        { ts: baseTime - 60 * 60_000, action: "更换手环电池，已恢复", actor: "S005" },
      ],
    },
  ];
}

// === 审计日志 ===
export const seedAudit: AuditLog[] = [
  { id: "AU001", ts: now - 18 * 60_000, actor: "林若华", role: "admin", action: "导出月度护理工时表", target: "report · 2025-12", ip: "10.0.4.18" },
  { id: "AU002", ts: now - 42 * 60_000, actor: "白霁川", role: "doctor", action: "新增医嘱", target: "E005 · 沙美特罗吸入剂", ip: "10.0.4.7" },
  { id: "AU003", ts: now - 90 * 60_000, actor: "苏念卿", role: "nurse", action: "处置告警", target: "A002 · E003 跌倒", ip: "10.0.4.31" },
  { id: "AU004", ts: now - 3 * 60 * 60_000, actor: "宋怀瑾", role: "nurse", action: "更新护理记录", target: "N005 · E005 SpO2", ip: "10.0.4.32" },
  { id: "AU005", ts: now - 5 * 60 * 60_000, actor: "林若华", role: "admin", action: "权限调整", target: "霍轻尘 · 夜班护士长", ip: "10.0.4.18" },
];
