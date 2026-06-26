interface RingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: React.ReactNode;
  sub?: React.ReactNode;
}

export function Ring({ value, size = 120, stroke = 10, color = "#2F4A3A", trackColor = "#E2E4E1", label, sub }: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-[24px] font-semibold text-ink-600 tabular leading-none">{label ?? `${Math.round(value)}%`}</div>
        {sub && <div className="text-[10px] text-ink-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}
