// 全局类型定义
export type Role = "admin" | "nurse" | "doctor" | "family";

export interface UserSession {
  id: string;
  name: string;
  role: Role;
  title: string;
  avatar?: string;
}

export type Gender = "男" | "女";
export type RiskLevel = "high" | "medium" | "low";
export type CareLevel = "特级" | "一级" | "二级" | "三级";

export interface Elderly {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  avatar?: string;
  roomId: string;
  bedNo: string;
  riskLevel: RiskLevel;
  careLevel: CareLevel;
  chronic: string[];
  allergies: string[];
  admissionAt: string;
  emergencyContact: { name: string; relation: string; phone: string };
  primaryDoctor: string;
  primaryNurse: string;
  family: { name: string; relation: string; phone: string }[];
  notes?: string;
}

export interface Room {
  id: string;
  floor: number;
  number: string;
  elderlyId?: string;
  type: "单人间" | "双人间" | "套间";
}

export interface Vitals {
  ts: number;
  heartRate: number;
  spo2: number;
  systolic: number;
  diastolic: number;
  temperature: number;
  respRate: number;
}

export type AlertLevel = "critical" | "warning" | "info";
export type AlertType =
  | "跌倒检测"
  | "SOS 紧急呼叫"
  | "心率异常"
  | "血压异常"
  | "血氧偏低"
  | "体温异常"
  | "长时间未活动"
  | "用药未确认"
  | "设备离线"
  | "越界离开";

export type AlertStatus = "待处置" | "处置中" | "已解决" | "误报";

export interface AlertItem {
  id: string;
  elderlyId: string;
  type: AlertType;
  level: AlertLevel;
  status: AlertStatus;
  message: string;
  location: string;
  assigneeId?: string;
  createdAt: number;
  resolvedAt?: number;
  timeline: { ts: number; action: string; actor: string }[];
}

export type DeviceType =
  | "智能手环"
  | "血压计"
  | "定位信标"
  | "紧急呼叫器"
  | "烟雾传感器"
  | "跌倒检测垫"
  | "睡眠带"
  | "智能药盒";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  elderlyId?: string;
  battery: number;
  online: boolean;
  firmware: string;
  lastHeartbeat: number;
  installedAt: string;
}

export type StaffRole = "护工" | "护士" | "医生" | "康复师" | "管理员";
export type Shift = "白班" | "中班" | "夜班";

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  title: string;
  shift: Shift;
  phone: string;
  online: boolean;
  yearsOfService: number;
  avatar?: string;
}

export type TaskType = "巡房" | "用药" | "量测" | "康复" | "进餐" | "清洁" | "心理";
export type TaskStatus = "待执行" | "进行中" | "已完成" | "已超时";

export interface CareTask {
  id: string;
  elderlyId: string;
  staffId: string;
  type: TaskType;
  title: string;
  scheduledAt: number;
  status: TaskStatus;
  note?: string;
}

export interface MedOrder {
  id: string;
  elderlyId: string;
  name: string;
  dosage: string;
  frequency: string;
  startAt: string;
  endAt?: string;
  doctorId: string;
}

export interface NursingNote {
  id: string;
  elderlyId: string;
  staffId: string;
  type: TaskType;
  content: string;
  createdAt: number;
  photos?: number;
}

export interface Schedule {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  shift: Shift;
}

export interface Message {
  id: string;
  elderlyId: string;
  from: string;
  to: string;
  type: "文字" | "图片" | "日报" | "预约";
  preview: string;
  ts: number;
  read: boolean;
}

export interface VisitBooking {
  id: string;
  elderlyId: string;
  familyName: string;
  date: string; // YYYY-MM-DD
  slot: string; // HH:MM
  duration: number; // minutes
  status: "待确认" | "已确认" | "已完成" | "已取消";
}

export interface HealthTrendPoint {
  date: string;
  heartRate: number;
  systolic: number;
  spo2: number;
  sleep: number; // hours
  steps: number;
}

export interface AuditLog {
  id: string;
  ts: number;
  actor: string;
  role: Role;
  action: string;
  target: string;
  ip: string;
}

export interface FloorStatus {
  floor: number;
  rooms: { id: string; number: string; elderlyId?: string; status: RiskLevel | "empty" }[];
}
