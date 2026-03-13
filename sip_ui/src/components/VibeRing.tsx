interface VibeRingProps {
  score: number;
}

export function VibeRing({ score }: VibeRingProps) {
  const percent = Math.round(score);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="hsl(var(--coffee-latte))"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-[10px] font-body font-semibold text-foreground">
        {percent}%
      </span>
    </div>
  );
}
