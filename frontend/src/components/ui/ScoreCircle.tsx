interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export function ScoreCircle({ score, maxScore = 1600, size = 160, label, sublabel }: ScoreCircleProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 75) return "text-primary";
    if (percentage >= 50) return "text-accent";
    return "text-error";
  };

  const getStrokeColor = () => {
    if (percentage >= 75) return "#1F245C";
    if (percentage >= 50) return "#F4B300";
    return "#EF4444";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-outline-variant)"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold font-display ${getColor()}`}>{score}</span>
          {maxScore !== 100 && (
            <span className="text-xs text-on-surface-variant font-mono">/ {maxScore}</span>
          )}
        </div>
      </div>
      {label && <div className="text-sm font-semibold text-on-surface">{label}</div>}
      {sublabel && <div className="text-xs text-on-surface-variant">{sublabel}</div>}
    </div>
  );
}
