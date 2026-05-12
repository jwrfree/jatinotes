"use client";

import { useRef, ReactNode } from "react";
import { m, useScroll, useTransform, MotionStyle } from "framer-motion";

interface ScrollReveal3DProps {
  children: ReactNode;
  className?: string;
  /**
   * Starting rotateX angle (degrees). Element starts "flipped back" like a book page.
   * Default: -60
   */
  rotateXFrom?: number;
  /**
   * Ending rotateX angle. Default: 0 (flat)
   */
  rotateXTo?: number;
  /**
   * Starting scale. Default: 0.85
   */
  scaleFrom?: number;
  /**
   * Starting Y offset (px). Default: 80
   */
  yFrom?: number;
  /**
   * Scroll offset range for the animation trigger.
   * Default: ["start end", "center center"]
   */
  offset?: [string, string];
  /**
   * Transform origin. Default: "bottom center"
   */
  origin?: string;
  /**
   * Whether to also fade in. Default: true
   */
  fade?: boolean;
  /**
   * Additional motion style overrides
   */
  style?: MotionStyle;
}

export default function ScrollReveal3D({
  children,
  className = "",
  rotateXFrom = -60,
  rotateXTo = 0,
  scaleFrom = 0.85,
  yFrom = 80,
  offset = ["start end", "center center"],
  origin = "bottom center",
  fade = true,
  style,
}: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [rotateXFrom, rotateXTo]);
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [yFrom, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={`perspective-[1200px] ${className}`}>
      <m.div
        style={{
          rotateX,
          scale,
          y,
          opacity: fade ? opacity : 1,
          transformOrigin: origin,
          ...style,
        }}
      >
        {children}
      </m.div>
    </div>
  );
}
