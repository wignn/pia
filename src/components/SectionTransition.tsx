"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type SectionTransitionProps = {
  children: ReactNode;
  className?: string;
};

export function SectionTransition({ children, className }: SectionTransitionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`section-transition${className ? ` ${className}` : ""}`}
      initial={reducedMotion ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -12%" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
