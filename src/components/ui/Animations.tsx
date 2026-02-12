"use client";

import { forwardRef } from "react";
import { m, HTMLMotionProps } from "framer-motion";

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const MotionDiv = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(({ children, ...props }, ref) => {
  return <m.div ref={ref} {...props}>{children}</m.div>;
});
MotionDiv.displayName = "MotionDiv";

export const MotionSection = forwardRef<HTMLElement, HTMLMotionProps<"section">>(({ children, ...props }, ref) => {
  return <m.section ref={ref} {...props}>{children}</m.section>;
});
MotionSection.displayName = "MotionSection";
