"use client";

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
}

export default function ScoreRing({ score, size = 140 }: ScoreRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.3
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? "#00e5a0" // green
      : score >= 50
      ? "#ffd166" // yellow
      : "#ff4d6d"; // red

  const label =
    score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Weak Match";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 120 120">
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#1e1e2e"
          strokeWidth="10"
        />
        {/* Score ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="score-ring"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        {/* Score text */}
        <text
          x="60"
          y="54"
          textAnchor="middle"
          fill={color}
          fontSize="26"
          fontWeight="700"
          fontFamily="'Syne', sans-serif"
        >
          {score}
        </text>
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fill="#6b6b8a"
          fontSize="10"
          fontFamily="'JetBrains Mono', monospace"
        >
          / 100
        </text>
      </svg>
      <span
        className="text-xs font-mono px-2.5 py-1 rounded-full border"
        style={{
          color,
          borderColor: `${color}30`,
          backgroundColor: `${color}10`,
        }}
      >
        {label}
      </span>
    </div>
  );
}
