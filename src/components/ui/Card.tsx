import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  extra?: ReactNode;
  description?: ReactNode;
  noPad?: boolean;
}

export function Card({ children, className, title, extra, description, noPad }: CardProps) {
  return (
    <section className={cn("card p-5", className, noPad && "p-0")}>
      {(title || extra) && (
        <header className="flex items-end justify-between gap-4 mb-4">
          <div>
            {title && <h3 className="font-display text-[17px] font-semibold text-ink-600 tracking-tight">{title}</h3>}
            {description && <p className="text-[12px] text-ink-400 mt-0.5">{description}</p>}
          </div>
          {extra}
        </header>
      )}
      {children}
    </section>
  );
}
