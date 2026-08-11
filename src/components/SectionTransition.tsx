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
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10%" }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
