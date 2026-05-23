import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  invert?: boolean;
  speed?: "normal" | "slow";
}

export function Marquee({ items, className, invert = false, speed = "normal" }: MarqueeProps) {
  const duplicated = [...items, ...items, ...items, ...items];
  return (
    <div
      className={cn(
        "w-full overflow-hidden border-y",
        invert ? "bg-ink text-bone border-ink" : "bg-coral text-ink border-coral",
        className
      )}
    >
      <div
        className={cn(
          "marquee-track py-2.5",
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee"
        )}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-6 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold whitespace-nowrap"
          >
            <span>{item}</span>
            <span className="opacity-50">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
