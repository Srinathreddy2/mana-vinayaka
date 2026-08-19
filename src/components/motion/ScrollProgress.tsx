"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline brass progress bar pinned under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-linear-to-r from-brass-600 via-brass-300 to-brass-600"
    />
  );
}
