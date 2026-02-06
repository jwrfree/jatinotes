"use client";

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

export function MotionDiv({ children, ...props }: HTMLMotionProps<"div">) {
  return <m.div {...props}>{children}</m.div>;
}

export function MotionSection({ children, ...props }: HTMLMotionProps<"section">) {
  return <m.section {...props}>{children}</m.section>;
}
