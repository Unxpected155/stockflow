# StockFlow — Design System Master

> **Source of truth** for all visual decisions in StockFlow.
> When building a page, first check `design-system/stockflow/pages/[page-name].md`. If it exists, its rules override this file. Otherwise, follow this file strictly.
>
> Generated initially via `ui-ux-pro-max --persist`, then hand-tuned to reflect the actual chosen palette (the auto-generated indigo/Fira pairing was rejected — see [[feedback-no-violet]] / [[feedback-ui-workflow]]).

**Project:** StockFlow — Multi-tenant inventory & business dashboard SaaS
**Chosen:** 2026-05-21
**Target audience:** small businesses, startups, local businesses
**Aesthetic target:** polished, enterprise-lite, modern SaaS — inspired by Stripe Dashboard / Linear / Plaid

---

## Palette — Deep Navy + Emerald

Background is slate-tinted (not pure white). Brand primary is deep navy; emerald is the accent surface for "stock_in" / positive analytics.

| Role | Hex | Tailwind ref | OKLch |
|---|---|---|---|
| `--primary` | `#0F172A` | slate-900 | `oklch(0.208 0.042 265.755)` |
| `--primary-foreground` | `#F8FAFC` | slate-50 | `oklch(0.984 0.003 247.858)` |
| `--secondary` (subtle surface) | `#F1F5F9` | slate-100 | `oklch(0.968 0.007 247.896)` |
| `--accent` (shadcn hover surface) | `#F1F5F9` | slate-100 | `oklch(0.968 0.007 247.896)` |
| `--success` / `stock_in` | `#10B981` | emerald-500 | `oklch(0.696 0.17 162.48)` |
| `--warning` / `low_stock` | `#F59E0B` | amber-500 | `oklch(0.769 0.188 70.08)` |
| `--destructive` / `out_of_stock` | `#DC2626` | red-600 | `oklch(0.577 0.245 27.325)` |
| `--info` | `#1E3A8A` | blue-900 | `oklch(0.379 0.146 265.522)` |
| `--background` | `#F8FAFC` | slate-50 | `oklch(0.984 0.003 247.858)` |
| `--card` | `#FFFFFF` | white | `oklch(1 0 0)` |
| `--foreground` | `#020617` | slate-950 | `oklch(0.129 0.042 264.695)` |
| `--muted-foreground` | `#475569` | slate-600 | `oklch(0.446 0.043 257.281)` |
| `--border` / `--input` | `#E2E8F0` | slate-200 | `oklch(0.929 0.013 255.508)` |
| `--ring` | `#0F172A` | slate-900 | `oklch(0.208 0.042 265.755)` |

**Chart palette** (sequential, Recharts-ready):
| Chart token | Color |
|---|---|
| `--chart-1` | navy `#0F172A` |
| `--chart-2` | cyan-500 `#06B6D4` |
| `--chart-3` | emerald-500 `#10B981` |
| `--chart-4` | amber-500 `#F59E0B` |
| `--chart-5` | indigo-400 muted `#818CF8` |

**Architectural note on `--accent`:** kept as a muted slate-100 surface (not emerald) so shadcn's default hover behavior — menu items, dropdowns, etc. — doesn't turn every hover bright green. Use `bg-success` / `text-success` when you want the brand-emerald surface specifically (KPI deltas, "stock_in" badges, positive chart series).

**Anti-patterns** (per Gabriel's explicit preferences):
- ❌ Violet / purple / indigo primary — rejected. See [[feedback-no-violet]].
- ❌ Pure white `#FFFFFF` page background — feels vanilla. Use slate-50.
- ❌ Bright emerald everywhere — reserve for success / positive / accent moments.

---

## Typography

- **Sans (body + headings):** Geist Sans (already loaded in `src/app/layout.tsx`)
- **Mono (code, numerical KPIs):** Geist Mono

Geist was chosen at project init; Fira Code/Sans (suggested by the design-system generator) is **not** adopted. Keep Geist for the entire MVP.

**Type scale:**
| Use | Tailwind class | Notes |
|---|---|---|
| Page H1 (centered card titles, dashboard) | `text-2xl font-semibold` | Avoid `text-3xl bold` — feels heavy in enterprise-lite |
| Section H2 | `text-xl font-semibold` | |
| Card title | `text-lg font-semibold` | |
| Body | `text-sm` | |
| Subdued / helper | `text-sm text-muted-foreground` | |
| Code / numbers | `font-mono` (Geist Mono) | KPI numbers, internal codes |

**Reading rules:**
- Line-height `1.5–1.75` on body.
- Line-length capped at ~65–75ch where applicable.

---

## Spacing

Use Tailwind defaults. Reference values for consistency:

| Token | Tailwind | Usage |
|---|---|---|
| xs | `gap-1` (4px) | Inline icon-text gap |
| sm | `gap-2` (8px) | Tight groupings |
| md | `gap-4` (16px) | Form fields, card sections |
| lg | `gap-6` (24px) | Form sections, card → card |
| xl | `gap-8` (32px) | Major layout regions |
| 2xl | `gap-12` (48px) | Section breaks |

**Forms:** `gap-6` between form sections, `gap-3` between fields, `gap-4` between buttons.

---

## Component specs

### Buttons

Use shadcn `<Button>` from `src/components/ui/button.tsx`. Variants:
- `default` — `bg-primary` (navy) / `text-primary-foreground` (slate-50). Primary CTAs.
- `outline` — `border-input` + `bg-background`. Secondary actions, "Continue with Google".
- `ghost` — for tertiary actions inside dense UIs.
- `destructive` — only for irreversible destructive actions (delete, archive).

**Sizing:** default `h-10`, sm `h-9`, lg `h-11`. Touch target ≥ 44px on mobile is satisfied at `h-10`.

**Loading state:** disable + show spinner inline. Never let user click twice during an async action.

### Cards

Use shadcn `<Card>`. Auth pages: `max-w-md rounded-lg border border-slate-200 bg-card shadow-sm p-8` — the white card lifts off the slate-50 background, no gradient.

### Inputs

Use shadcn `<Input>` + `<Label>` + `<FormField>` composition. Focus ring uses `--ring` (slate-900 navy). Border on default `border-input` (slate-200), focus border darkens.

### Toasts

Sonner via `<Toaster richColors position="top-center" />` in root layout. Use:
- `toast.success("Email sent — check your inbox")` — emerald accent.
- `toast.error("Email or password is incorrect")` — red destructive accent.
- `toast.info(...)` — sparingly, mostly for non-actionable updates.

---

## Motion

- Default transition `transition-colors duration-200` on interactive elements.
- Micro-interactions (hover, focus): 150–200ms ease.
- Page-level animations: skip in MVP, just renders.
- Respect `prefers-reduced-motion` (already wired in `globals.css`).

---

## Pre-delivery checklist

Every page or component PR:

- [ ] No emojis used as icons — Lucide SVGs only.
- [ ] `cursor: pointer` on all clickable elements (the `globals.css` `@layer base` block handles `button` + `[role="button"]` globally).
- [ ] Hover transitions 150–300ms, no layout-shifting scale transforms.
- [ ] Text contrast ≥ 4.5:1 (verified for the chosen palette: slate-950 on slate-50 = 19.5:1 ✓, slate-600 on slate-50 = 6.4:1 ✓, slate-50 on slate-900 = 17.4:1 ✓).
- [ ] Focus states visible — uses `--ring` (slate-900 navy).
- [ ] `prefers-reduced-motion` respected.
- [ ] Responsive at 375 / 768 / 1024 / 1440 px.
- [ ] No horizontal scroll at mobile breakpoint.
- [ ] All inputs have associated `<label htmlFor>`.

---

## Anti-patterns (do NOT use)

- ❌ Violet / purple / indigo as brand primary.
- ❌ Pure white page background.
- ❌ Emojis as icons (`🚀` `⚡` etc).
- ❌ Layout-shifting hover (`hover:scale-105` etc).
- ❌ Bright emerald used everywhere — reserve for success / positive accents.
- ❌ Gradients on auth pages or top-level surfaces (allowed sparingly on marketing landing only).
- ❌ Custom CSS for things shadcn already provides — extend via `cn()`, don't replace.
- ❌ Reading raw `process.env` — go through `src/lib/env.ts`.
- ❌ Direct Supabase calls in feature components — always through `src/lib/auth/`.

---

## Related

- [[../Projects/StockFlow.md|StockFlow project hub]]
- [[../Projects/StockFlow/Design-System.md|Long-form design spec in Obsidian vault]]
- [[../Projects/StockFlow/Components.md|Component inventory]]
- [[../Projects/StockFlow/Auth-Flow.md|Auth flow]]
