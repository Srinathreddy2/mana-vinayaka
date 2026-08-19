"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The house reveal: everything enters once, from 28px below, on scroll.
 * Used for every block that is not a heading.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const Component = motion[as];
  const still = useReducedMotion();

  if (still) return <Component className={className}>{children}</Component>;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  shown: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, delay: i * 0.055, ease: EASE },
  }),
};

/**
 * Masked word reveal for headings.
 *
 * Each word sits inside an overflow-hidden box and slides up from
 * beneath its own baseline, staggered left to right. This is the
 * signature motion of the whole design — used on every h1 and h2.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const words = text.split(" ");
  const still = useReducedMotion();

  if (still) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={wordVariants}
              custom={i + delay * 18}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** The rule–label–rule cluster that opens every section. */
export function Eyebrow({ children, single = false }: { children: ReactNode; single?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="h-px w-8 bg-linear-to-r from-transparent to-brass-500/70" />
      <span className="eyebrow">{children}</span>
      {!single && <span className="h-px w-8 bg-linear-to-l from-transparent to-brass-500/70" />}
    </div>
  );
}
