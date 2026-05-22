import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { Wordmark } from "./wordmark";

function CornerMark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={cn("pointer-events-none absolute text-emerald-400/65", className)}
      style={style}
    >
      <path
        d="M 6 1 L 6 11 M 1 6 L 11 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The right-side brand pane on the auth route group. Visible only on lg+
 * screens (mobile collapses to form-only). Pure server component — no JS.
 *
 * Visual stack (back to front):
 *   1. slate-900 base
 *   2. dot grid (24px radial gradient pattern, low-opacity white)
 *   3. emerald drift glow (top-left, large blur, slow ambient animation)
 *   4. blue ambient glow (bottom-right, static, very low opacity)
 *   5. SVG fractal noise overlay (3.5% opacity, mix-blend-overlay)
 *   6. content layer (wordmark, editorial tagline, version mark)
 */
export function BrandPane({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "relative isolate overflow-hidden bg-slate-900 text-slate-50",
        className,
      )}
    >
      {/* Dot grid — blueprint paper feel */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(255 255 255 / 0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Emerald drift glow — the main "alive" element */}
      <div
        aria-hidden="true"
        className="animate-glow-drift absolute -left-40 top-1/4 size-[44rem] rounded-full bg-emerald-500/20 blur-3xl"
      />

      {/* Secondary blue glow — adds depth in the opposite corner */}
      <div
        aria-hidden="true"
        className="absolute -right-48 -bottom-32 size-[40rem] rounded-full bg-blue-700/12 blur-3xl"
      />

      {/* Fractal noise — texture grain, mix-blend-overlay for cohesion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Left-edge inner shadow — photographic depth: the pane appears to
          recede into shadow at its own boundary, so the seam with the form
          pane reads as "atmospheric edge" rather than "hard cut". */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950/50 via-slate-950/20 to-transparent"
      />

      {/* Blueprint corner markers — thin '+' registration marks at the four
          inner corners. Reinforces the technical-drawing identity at zero
          content cost. */}
      <CornerMark className="animate-rise top-5 left-5" style={{ animationDelay: "120ms" }} />
      <CornerMark className="animate-rise top-5 right-5" style={{ animationDelay: "180ms" }} />
      <CornerMark className="animate-rise bottom-5 left-5" style={{ animationDelay: "240ms" }} />
      <CornerMark className="animate-rise right-5 bottom-5" style={{ animationDelay: "300ms" }} />

      {/* Vertical edge label — reads like a technical-drawing spine label.
          writing-mode: vertical-rl makes characters stand upright and flow
          top-to-bottom along the right edge. */}
      <div
        aria-hidden="true"
        className="animate-rise pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[0.6rem] tracking-[0.45em] text-slate-500/55 uppercase select-none"
        style={{ writingMode: "vertical-rl", animationDelay: "520ms" }}
      >
        StockFlow · Auth · v0.1.0
      </div>

      {/* Abstract chart artifact — decorative line chart trending up. Not a
          literal screenshot of the product, but an allusion to inventory
          analytics. Lives behind the tagline at low opacity. */}
      <div
        aria-hidden="true"
        className="animate-rise pointer-events-none absolute inset-x-0 top-[28%] h-[44%] opacity-[0.14]"
        style={{ animationDelay: "160ms" }}
      >
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          className="size-full text-slate-50"
        >
          <defs>
            <linearGradient id="brand-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="brand-chart-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Area fill below the line */}
          <path
            d="M 0 158 C 70 152, 130 168, 200 138 S 320 110, 380 102 S 500 70, 560 54 L 600 44 L 600 200 L 0 200 Z"
            fill="url(#brand-chart-fill)"
          />

          {/* Main trend line */}
          <path
            d="M 0 158 C 70 152, 130 168, 200 138 S 320 110, 380 102 S 500 70, 560 54 L 600 44"
            fill="none"
            stroke="url(#brand-chart-line)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data point dots at inflection points */}
          <g fill="rgb(16 185 129)" opacity="0.9">
            <circle cx="200" cy="138" r="2.5" />
            <circle cx="380" cy="102" r="2.5" />
            <circle cx="560" cy="54" r="2.5" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
        <div
          className="animate-rise"
          style={{ animationDelay: "80ms" }}
        >
          <Wordmark size="lg" tone="dark" />
        </div>

        <div className="max-w-2xl">
          <h2
            className="animate-rise font-display text-balance text-5xl leading-[1.05] xl:text-7xl xl:leading-[1.02]"
            style={{ animationDelay: "240ms" }}
          >
            Inventory you can{" "}
            <em className="text-emerald-400">finally see</em>.
          </h2>
          <p
            className="animate-rise mt-7 max-w-md text-base leading-relaxed text-slate-300"
            style={{ animationDelay: "340ms" }}
          >
            Multi-tenant inventory and business dashboards for small teams that
            outgrew spreadsheets — without enterprise weight.
          </p>
        </div>

        <div
          className="animate-rise flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-slate-500"
          style={{ animationDelay: "440ms" }}
        >
          <span>v0.1 · 2026</span>
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-emerald-500" />
            <span>Status: building</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
