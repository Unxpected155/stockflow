import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { text: string; dot: string; gap: string }> = {
  sm: { text: "text-base", dot: "size-1.5", gap: "gap-1" },
  md: { text: "text-xl", dot: "size-2", gap: "gap-1.5" },
  lg: { text: "text-3xl", dot: "size-2.5", gap: "gap-2" },
};

/**
 * Brand wordmark — "Stock▪Flow" with an emerald square between the two halves.
 * The square is a deliberate micro-signature that repeats across the product
 * (also used in favicons, loading states, empty states later).
 *
 * Pure server component. No JS.
 */
export function Wordmark({
  size = "md",
  tone = "light",
  className,
}: {
  size?: Size;
  tone?: "light" | "dark";
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      aria-label="StockFlow"
      className={cn(
        "inline-flex items-center font-bold tracking-tight",
        s.text,
        s.gap,
        tone === "dark" ? "text-slate-50" : "text-foreground",
        className,
      )}
    >
      <span>Stock</span>
      <span
        aria-hidden="true"
        className={cn("bg-emerald-500", s.dot, "rounded-[2px]")}
      />
      <span>Flow</span>
    </span>
  );
}
