import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  number?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  number,
  title,
  description,
  link,
  align = "left",
  invert = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between gap-y-6",
        align === "center" && "lg:flex-col lg:items-center text-center",
        className
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {(eyebrow || number) && (
          <div
            className={cn(
              "flex items-center gap-3 mb-3 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase",
              invert ? "text-bone/60" : "text-ink/60"
            )}
          >
            {number && (
              <span
                className={cn(
                  "inline-flex items-center justify-center w-6 h-6 border text-[10px]",
                  invert ? "border-bone/30 text-bone" : "border-ink/30 text-ink"
                )}
              >
                {number}
              </span>
            )}
            {eyebrow && <span>{eyebrow}</span>}
          </div>
        )}
        <h2
          className={cn(
            "font-display font-bold tracking-tight leading-[0.95]",
            "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 text-base lg:text-lg max-w-2xl",
              invert ? "text-bone/70" : "text-ink/70"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={cn(
            "self-start inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase pb-1 border-b",
            invert
              ? "border-bone hover:text-coral hover:border-coral"
              : "border-ink hover:text-coral hover:border-coral"
          )}
        >
          {link.label}
          <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  );
}
