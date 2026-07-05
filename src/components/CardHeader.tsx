import React from "react";

interface CardHeaderProps {
  label: string;
  badge: string;
}

export function CardHeader({ label, badge }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
        <span className="w-1 h-1 rounded-full bg-blue-500/50" />
        {label}
      </span>
      <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--accent-blue)] uppercase opacity-80">
        {badge}
      </span>
    </div>
  );
}
