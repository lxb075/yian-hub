import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-14 px-6", className)}>
      <div className="h-12 w-12 rounded-2xl bg-sand-100 text-moss-700 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="text-[15px] font-semibold text-ink-600">{title}</div>
      {description && <p className="text-[13px] text-ink-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
