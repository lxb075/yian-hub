import { useEffect, useRef, useState } from "react";

interface ECGProps {
  bpm: number;
  color?: string;
  height?: number;
  width?: number;
  duration?: number; // seconds visible
}

export function RealTimeECG({ bpm, color = "#C8553D", height = 110, width = 360, duration = 4 }: ECGProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 80);
    return () => window.clearInterval(id);
  }, []);

  // 生成 ECG 波形: 一组 PQRST 复合波
  const cycleSec = 60 / Math.max(40, Math.min(140, bpm));
  const samplesPerSec = 60;
  const total = duration * samplesPerSec;
  const cycleSamples = cycleSec * samplesPerSec;

  const points: number[] = [];
  for (let i = 0; i < total; i++) {
    const phase = (i % cycleSamples) / cycleSamples; // 0..1
    let v = 0;
    // P wave
    if (phase < 0.1) v = Math.sin((phase / 0.1) * Math.PI) * 0.18;
    // PR segment
    else if (phase < 0.16) v = 0;
    // Q
    else if (phase < 0.18) v = -0.15;
    // R
    else if (phase < 0.21) v = 0.95 - (phase - 0.18) * 8;
    // S
    else if (phase < 0.24) v = -0.25 + (phase - 0.21) * 5;
    // ST
    else if (phase < 0.32) v = 0;
    // T
    else if (phase < 0.5) v = Math.sin(((phase - 0.32) / 0.18) * Math.PI) * 0.3;
    else v = 0;
    points.push(v + (Math.random() - 0.5) * 0.04);
  }

  const yMid = height / 2;
  const stepX = width / (total - 1);

  // 持续滚动
  const offset = (tick * 4) % width;

  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i * stepX).toFixed(1)} ${(yMid - v * height * 0.4).toFixed(1)}`)
    .join(" ");

  return (
    <svg ref={ref} width={width} height={height} className="overflow-hidden">
      <defs>
        <linearGradient id="ecg-fade" x1="0" x2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="ecg-mask">
          <rect width={width} height={height} fill="white" />
          <rect x={width - 50} y="0" width="50" height={height} fill="url(#ecg-fade)" />
        </mask>
      </defs>
      <line x1={0} x2={width} y1={yMid} y2={yMid} stroke="#E2E4E1" strokeDasharray="2 4" />
      <g mask="url(#ecg-mask)">
        <g transform={`translate(${(-offset).toFixed(1)} 0)`}>
          <path d={path} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          {/* repeat for seamless loop */}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${width} 0)`}
            opacity={0.5}
          />
        </g>
      </g>
    </svg>
  );
}
