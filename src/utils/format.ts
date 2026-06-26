import { type ClassValue } from "clsx";

export function formatTime(ts: number, withSecond = false): string {
  const d = new Date(ts);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}${withSecond ? ":" + pad(d.getSeconds()) : ""}`;
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatRelative(ts: number, now = Date.now()): string {
  const diff = now - ts;
  if (diff < 0) {
    const ahead = -diff;
    if (ahead < 60_000) return "即将";
    if (ahead < 3_600_000) return `${Math.round(ahead / 60_000)} 分钟后`;
    if (ahead < 86_400_000) return `${Math.round(ahead / 3_600_000)} 小时后`;
    return `${Math.round(ahead / 86_400_000)} 天后`;
  }
  if (diff < 60_000) return `${Math.max(1, Math.round(diff / 1000))} 秒前`;
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)} 小时前`;
  return `${Math.round(diff / 86_400_000)} 天前`;
}

export function formatDate(ts: number | string): string {
  const d = typeof ts === "string" ? new Date(ts) : new Date(ts);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function initials(name: string): string {
  if (!name) return "·";
  return name.charAt(0);
}

export function dayOfWeekLabel(date: Date): string {
  return ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
}

export function durationMin(scheduledAt: number, now = Date.now()): number {
  return Math.round((scheduledAt - now) / 60_000);
}

export function isToday(ts: number): boolean {
  const d = new Date(ts);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}
