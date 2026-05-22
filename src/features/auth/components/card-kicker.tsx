import { cn } from "@/lib/utils";

/**
 * Editorial kicker — small mono uppercase line that sits above each auth
 * card's title. Gives each page a "technical manual" voice (e.g. "/LOGIN",
 * "/RECOVERY") and reinforces the blueprint/engineering aesthetic of the
 * brand pane on the right.
 */
export function CardKicker({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 self-center font-mono text-[0.65rem] tracking-[0.22em] text-muted-foreground uppercase",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-[1px] bg-emerald-500"
      />
      {label}
    </span>
  );
}
