"use client";

import { motion } from "framer-motion";

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

export function MotionDiv({ children, ...props }: any) {
  return <motion.div {...props}>{children}</motion.div>;
}

export function MotionSection({ children, ...props }: any) {
  return <motion.section {...props}>{children}</motion.section>;
}
