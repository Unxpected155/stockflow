import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { BrandPane } from "@/features/auth/components/brand-pane";
import { Wordmark } from "@/features/auth/components/wordmark";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.membership ? "/dashboard" : "/onboarding");
  }

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-12">
      {/* Form pane (always visible) — shares texture & ambient color with the
          brand pane so the seam feels atmospheric, not abrupt. */}
      <section className="relative isolate flex flex-col px-4 py-8 sm:px-6 lg:col-span-5 lg:p-10 xl:p-14">
        {/* Echo of the brand pane's dot grid — lighter so it reads as
            "same world, light side". */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(15 23 42 / 0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Horizontal gradient: slate-50 left → slightly darker right, so the
            edge meeting the brand pane reads as "near the dark side". */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgb(241 245 249 / 0.55) 100%)",
          }}
        />

        {/* Mirror emerald glow — same hue as the brand pane's main glow, but
            barely visible (5%). Positioned bottom-right, near the seam. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-emerald-500/[0.06] blur-3xl"
        />

        {/* Content layer */}
        <div className="relative flex flex-1 flex-col">
          {/* Form-pane wordmark — only shown on mobile, where the brand pane
              is hidden. On lg+ the brand pane carries the wordmark instead,
              so showing it here would duplicate. */}
          <div
            className="animate-rise lg:hidden"
            style={{ animationDelay: "160ms" }}
          >
            <Wordmark size="md" />
          </div>
          <div className="flex flex-1 items-center justify-center py-10">
            {/* Grid-break: on desktop the card translates 48px into the brand
                pane, making the seam a point of visual tension rather than a
                hard cut. Outer wrapper carries the static layout transform;
                inner wrapper carries the animation transform. */}
            <div className="relative z-10 w-full max-w-md lg:translate-x-12">
              {/* Card shadow upgraded: navy-tinted, larger spread → feels like
                  the card lives in the same atmospheric world as the brand
                  pane. Delay 480ms = lands last, "te toca a vos" moment. */}
              <div
                className="animate-card-in [&_[data-slot=card]]:shadow-[0_22px_60px_-20px_rgb(15_23_42_/_0.32)] [&_[data-slot=card]]:ring-1 [&_[data-slot=card]]:ring-slate-900/5"
                style={{ animationDelay: "480ms" }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand pane (desktop only) */}
      <BrandPane className="hidden lg:col-span-7 lg:flex" />
    </main>
  );
}
