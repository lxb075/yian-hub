import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  seedElderly,
  seedRooms,
  seedStaff,
  seedDevices,
  seedMeds,
  seedTasks,
  seedNotes,
  seedSchedules,
  seedMessages,
  seedVisits,
  seedFloorStatus,
  buildHealthTrend,
  buildInitialVitals,
  buildInitialAlerts,
  seedAudit,
} from "@/data/seed";
import type {
  AlertItem,
  AuditLog,
  CareTask,
  Device,
  Elderly,
  FloorStatus,
  HealthTrendPoint,
  MedOrder,
  Message,
  NursingNote,
  Room,
  Schedule,
  Staff,
  UserSession,
  VisitBooking,
  Vitals,
  Role,
} from "@/types";

interface HubState {
  // 身份
  session: UserSession | null;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;

  // 业务数据
  elderly: Elderly[];
  rooms: Room[];
  staff: Staff[];
  devices: Device[];
  meds: MedOrder[];
  tasks: CareTask[];
  notes: NursingNote[];
  schedules: Schedule[];
  messages: Message[];
  visits: VisitBooking[];
  floorStatus: FloorStatus[];
  audit: AuditLog[];

  vitals: Record<string, Vitals>;
  vitalsHistory: Record<string, Vitals[]>;
  alerts: AlertItem[];

  // 操作
  assignAlert: (alertId: string, staffId: string) => void;
  resolveAlert: (alertId: string, actor: string, note?: string) => void;
  markFalse: (alertId: string, actor: string) => void;
  addTask: (task: Omit<CareTask, "id">) => void;
  updateTaskStatus: (taskId: string, status: CareTask["status"]) => void;
  addNote: (note: Omit<NursingNote, "id" | "createdAt">) => void;
  readMessage: (id: string) => void;
  bookVisit: (v: Omit<VisitBooking, "id" | "status">) => void;
  confirmVisit: (id: string) => void;
  updateVitals: (elderlyId: string, v: Vitals) => void;
  pushVitalPoint: (elderlyId: string, v: Vitals) => void;
  addAlert: (alert: AlertItem) => void;
  appendAudit: (log: Omit<AuditLog, "id" | "ts">) => void;
}

const trendCache: Record<string, HealthTrendPoint[]> = {};
function getTrend(elderlyId: string) {
  if (!trendCache[elderlyId]) {
    trendCache[elderlyId] = buildHealthTrend();
  }
  return trendCache[elderlyId];
}

export const useHub = create<HubState>()(
  persist(
    (set, get) => ({
      session: null,

      login: (role) => {
        const profiles: Record<Role, UserSession> = {
          admin: { id: "S001", name: "林若华", role, title: "机构院长 · 总台" },
          nurse: { id: "S003", name: "苏念卿", role, title: "责任护士 · 3F 白班" },
          doctor: { id: "S007", name: "白霁川", role, title: "内科主任医师" },
          family: { id: "F001", name: "周文澜", role, title: "家属 · 长子（关联 E001）" },
        };
        set({ session: profiles[role] });
        get().appendAudit({ actor: profiles[role].name, role, action: "登录系统", target: "/dashboard", ip: "10.0.4.18" });
      },
      logout: () => set({ session: null }),
      switchRole: (role) => {
        get().login(role);
      },

      elderly: seedElderly,
      rooms: seedRooms,
      staff: seedStaff,
      devices: seedDevices,
      meds: seedMeds,
      tasks: seedTasks,
      notes: seedNotes,
      schedules: seedSchedules,
      messages: seedMessages,
      visits: seedVisits,
      floorStatus: seedFloorStatus,
      audit: seedAudit,

      vitals: buildInitialVitals(),
      vitalsHistory: (() => {
        const out: Record<string, Vitals[]> = {};
        seedElderly.forEach((e) => {
          out[e.id] = [];
          for (let i = 60; i >= 1; i--) {
            out[e.id].push({
              ts: Date.now() - i * 1000,
              heartRate: 70 + Math.round(Math.sin(i / 5) * 5 + Math.random() * 3),
              spo2: 95 + Math.round(Math.random() * 3),
              systolic: 128 + Math.round(Math.sin(i / 4) * 6 + Math.random() * 4),
              diastolic: 78 + Math.round(Math.sin(i / 6) * 3 + Math.random() * 2),
              temperature: 36.5 + Math.random() * 0.4,
              respRate: 16 + Math.round(Math.random() * 3),
            });
          }
        });
        return out;
      })(),
      alerts: buildInitialAlerts(),

      assignAlert: (alertId, staffId) => {
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === alertId
              ? {
                  ...a,
                  status: "处置中",
                  assigneeId: staffId,
                  timeline: [...a.timeline, { ts: Date.now(), action: `派单至 ${staffId}`, actor: get().session?.name ?? "系统" }],
                }
              : a,
          ),
        }));
      },
      resolveAlert: (alertId, actor, note) => {
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === alertId
              ? {
                  ...a,
                  status: "已解决",
                  resolvedAt: Date.now(),
                  timeline: [
                    ...a.timeline,
                    { ts: Date.now(), action: note ? `处置完成：${note}` : "处置完成", actor },
                  ],
                }
              : a,
          ),
        }));
        get().appendAudit({ actor, role: get().session?.role ?? "nurse", action: "解决告警", target: alertId, ip: "10.0.4.18" });
      },
      markFalse: (alertId, actor) => {
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === alertId
              ? {
                  ...a,
                  status: "误报",
                  resolvedAt: Date.now(),
                  timeline: [...a.timeline, { ts: Date.now(), action: "标记为误报", actor }],
                }
              : a,
          ),
        }));
      },
      addTask: (task) => {
        set((s) => ({ tasks: [{ ...task, id: `T${Date.now()}` }, ...s.tasks] }));
      },
      updateTaskStatus: (taskId, status) => {
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) }));
      },
      addNote: (note) => {
        set((s) => ({ notes: [{ ...note, id: `N${Date.now()}`, createdAt: Date.now() }, ...s.notes] }));
      },
      readMessage: (id) => {
        set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) }));
      },
      bookVisit: (v) => {
        set((s) => ({ visits: [{ ...v, id: `V${Date.now()}`, status: "待确认" }, ...s.visits] }));
      },
      confirmVisit: (id) => {
        set((s) => ({ visits: s.visits.map((v) => (v.id === id ? { ...v, status: "已确认" } : v)) }));
      },

      updateVitals: (elderlyId, v) => {
        set((s) => ({ vitals: { ...s.vitals, [elderlyId]: v } }));
      },
      pushVitalPoint: (elderlyId, v) => {
        set((s) => {
          const arr = s.vitalsHistory[elderlyId] ?? [];
          const next = [...arr, v].slice(-120);
          return { vitalsHistory: { ...s.vitalsHistory, [elderlyId]: next } };
        });
      },

      addAlert: (alert) => {
        set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 80) }));
      },

      appendAudit: (log) => {
        set((s) => ({ audit: [{ ...log, id: `AU${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: Date.now() }, ...s.audit].slice(0, 200) }));
      },
    }),
    {
      name: "yian-hub",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        session: s.session,
        tasks: s.tasks,
        notes: s.notes,
        alerts: s.alerts,
        messages: s.messages,
        visits: s.visits,
        audit: s.audit,
      }),
    },
  ),
);

export { getTrend };
