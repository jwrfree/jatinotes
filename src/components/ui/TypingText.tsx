"use client";

import { m, Variants } from "framer-motion";

interface TypingTextProps {
  text: string;
  className?: string;
}

export default function TypingText({ text, className = "" }: TypingTextProps) {
  const characters = text.split("");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -10,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <m.span
      style={{ display: "inline-flex", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {characters.map((char, index) => (
        <m.span
          variants={child}
          key={index}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </m.span>
      ))}
    </m.span>
  );
}
