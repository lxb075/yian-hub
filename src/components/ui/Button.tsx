import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

const variants = {
  primary: "bg-moss-700 text-sand-50 hover:bg-moss-800 active:translate-y-[1px] shadow-soft",
  secondary: "bg-sand-100 text-ink-600 hover:bg-sand-200",
  ghost: "text-ink-500 hover:bg-ink-50 hover:text-ink-600",
  outline: "border border-ink-200 text-ink-600 hover:border-moss-700 hover:text-moss-700 bg-white/60",
  danger: "bg-alert text-white hover:bg-alert/90 active:translate-y-[1px] shadow-soft",
};

const sizes = {
  sm: "h-8 px-3 text-[12.5px]",
  md: "h-9 px-3.5 text-[13px]",
  lg: "h-11 px-5 text-[14px]",
};

export function Button({ variant = "primary", size = "md", icon, className, children, ...rest }: BtnProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
