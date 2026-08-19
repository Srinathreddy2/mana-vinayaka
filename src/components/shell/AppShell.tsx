"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Composer } from "@/components/add/Composer";
import { MemoryViewer } from "@/components/memory/MemoryViewer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Marquee, CHANT } from "@/components/ui/Marquee";
import { SiteHeader } from "./Nav";
import { TabTitleScroller } from "./TabTitleScroller";

export function AppShell({ children }: { children: ReactNode }) {
  const { toast } = useStore();

  return (
    <>
      <TabTitleScroller />
      <SmoothScroll />
      <ScrollProgress />
      <div className="relative flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>

      <Composer />
      <MemoryViewer />
      <span className="grain" aria-hidden="true" />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass hairline pointer-events-none fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 rounded-full px-6 py-3.5 text-[0.875rem] text-bone-50 shadow-[0_18px_50px_-20px_rgb(0_0_0/0.9)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const FOOTER_LINKS = [
  { title: "The book", links: [
    { href: "/", label: "Home" },
    { href: "/years", label: "Years" },
    { href: "/memories", label: "Memories" },
  ] },
  { title: "Browse", links: [
    { href: "/memories?view=people", label: "People" },
    { href: "/memories", label: "Photos & stories" },
    { href: "/film", label: "Memory film" },
  ] },
];

function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-brass-500/12 bg-ink-950">
      <div className="border-b border-brass-500/12 py-6">
        <Marquee items={CHANT} size="lg" speed={50} />
      </div>

      <div className="gutter py-16 md:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <p className="font-display text-title leading-[1.05] text-bone-50">Mana Vinayaka</p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-bone-400">
              A memory book for Vinayaka Chavithi. Photos, stories, voices and the people who
              were there — kept for the years when we want to remember.
            </p>
            <p className="mt-6 font-deva text-brass-400/80">గణపతి బాప్పా మోరియా</p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="micro">{group.title}</p>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[0.9375rem] text-bone-300 transition-colors duration-300 hover:text-brass-300"
                    >
                      <span className="h-px w-0 bg-brass-400 transition-all duration-500 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="shell mt-14 flex flex-col gap-3 border-t border-brass-500/12 pt-8 text-[0.8125rem] text-bone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built with love. Shared with everyone. -{" "}
            <span className="font-signature text-[1.125rem] leading-none text-brass-400/80">
              Srinath
            </span>
          </p>
          <p className="tracking-[0.14em] uppercase">Our celebrations · Our memories</p>
        </div>

        <div className="shell mt-10 flex flex-col gap-4 border-t border-brass-500/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-bone-500">
            © 2026 Yerraballi Committee Kurrollu.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}

/** Scrolls back to the top using Lenis' easing, with a native fallback. */
function BackToTop() {
  const toTop = () => {
    const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className="group flex items-center gap-4 text-[0.6875rem] font-semibold tracking-[0.24em] text-bone-400 uppercase transition-colors duration-300 hover:text-brass-300"
    >
      Back to top
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-brass-500/25 text-bone-300 transition-colors duration-300 group-hover:border-brass-400/60 group-hover:text-brass-300">
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
    </button>
  );
}
