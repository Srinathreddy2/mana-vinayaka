"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEscape, useScrollLock } from "@/lib/hooks";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  /** Lightbox mode: no panel chrome, deeper backdrop. */
  dark?: boolean;
  width?: string;
}

/**
 * Modal surface.
 *
 * A centred panel on desktop, a bottom sheet on phones, on a blurred ink
 * backdrop — matching the reference's lightbox behaviour and easing.
 */
export function Sheet({ open, onClose, children, label, dark = false, width = "max-w-2xl" }: Props) {
  useScrollLock(open);
  useEscape(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center sm:p-6"
        >
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 backdrop-blur-md ${dark ? "bg-ink-950/94" : "bg-ink-950/80"}`}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden ${width} ${
              dark
                ? "bg-transparent"
                : "hairline rounded-t-3xl bg-ink-900 shadow-[0_-20px_80px_-30px_rgb(0_0_0/1)] sm:rounded-3xl"
            }`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function SheetHeader({
  title,
  onClose,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-brass-500/12 px-6 pt-6 pb-5 sm:px-8 sm:pt-7">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="hairline mt-1 grid size-8 shrink-0 place-items-center rounded-full text-bone-300 transition-colors hover:border-brass-400/60 hover:text-brass-300"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m14 6-6 6 6 6" />
          </svg>
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-[1.5rem] leading-tight text-bone-50 sm:text-[1.75rem]">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-[0.9375rem] text-bone-400">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="hairline mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-bone-300 transition-colors hover:border-brass-400/60 hover:text-brass-300"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
