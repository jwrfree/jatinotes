"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { ReactNode } from "react";

/**
 * Lazy-loaded motion wrapper for below-the-fold content
 * Reduces initial bundle size by ~25KB
 */
export function LazyMotionWrapper({ children }: { children: ReactNode }) {
    return (
        <LazyMotion features={domAnimation} strict>
            {children}
        </LazyMotion>
    );
}

/**
 * Lazy motion div component
 * Use this instead of MotionDiv for below-the-fold content
 */
export const LazyMotionDiv = m.div;
export const LazyMotionSection = m.section;
