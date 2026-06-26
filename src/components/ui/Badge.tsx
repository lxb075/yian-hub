import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "moss" | "sand" | "alert" | "warn" | "safe" | "info" | "ink";
  variant?: "soft" | "solid" | "outline";
  className?: string;
  icon?: ReactNode;
}

const toneMap: Record<NonNullable<BadgeProps["tone"]>, { soft: string; solid: string; outline: string }> = {
  moss: {
    soft: "bg-moss-50 text-moss-700",
    solid: "bg-moss-700 text-sand-50",
    outline: "border border-moss-200 text-moss-700",
  },
  sand: {
    soft: "bg-sand-100 text-sand-600",
    solid: "bg-sand-400 text-moss-800",
    outline: "border border-sand-300 text-sand-600",
  },
  alert: {
    soft: "bg-alert/10 text-alert",
    solid: "bg-alert text-white",
    outline: "border border-alert/40 text-alert",
  },
  warn: {
    soft: "bg-warn/15 text-warn",
    solid: "bg-warn text-ink-600",
    outline: "border border-warn/40 text-warn",
  },
  safe: {
    soft: "bg-safe/15 text-safe",
    solid: "bg-safe text-white",
    outline: "border border-safe/40 text-safe",
  },
  info: {
    soft: "bg-info/10 text-info",
    solid: "bg-info text-white",
    outline: "border border-info/40 text-info",
  },
  ink: {
    soft: "bg-ink-50 text-ink-500",
    solid: "bg-ink-600 text-white",
    outline: "border border-ink-200 text-ink-500",
  },
};

export function Badge({ children, tone = "moss", variant = "soft", className, icon }: BadgeProps) {
  const m = toneMap[tone][variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
        m,
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function StatusDot({ tone = "moss", pulse = false, className }: { tone?: "moss" | "alert" | "warn" | "safe" | "info" | "ink"; pulse?: boolean; className?: string }) {
  const c = {
    moss: "bg-moss-500",
    alert: "bg-alert",
    warn: "bg-warn",
    safe: "bg-safe",
    info: "bg-info",
    ink: "bg-ink-300",
  }[tone];
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      <span className={cn("absolute inset-0 rounded-full", c, pulse && "animate-ping opacity-60")} />
      <span className={cn("relative inline-block h-2 w-2 rounded-full", c)} />
    </span>
  );
}
