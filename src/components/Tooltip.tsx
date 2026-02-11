"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";

interface TooltipProps {
  text: string;
  content: string;
  className?: string;
}

export default function Tooltip({ text, content, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({
    tooltip: { left: "50%", transform: "translateX(-50%)", right: "auto" },
    arrow: { left: "50%", transform: "translateX(-50%)", right: "auto" }
  });

  const handleOpen = (e: React.SyntheticEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const screenW = window.innerWidth;
    const threshold = 100; // px from edge to trigger snap

    let newTooltipStyle = { left: "50%", transform: "translateX(-50%)", right: "auto" };
    let newArrowStyle = { left: "50%", transform: "translateX(-50%)", right: "auto" };

    if (rect.left < threshold) {
      // Align Left
      newTooltipStyle = { left: "0", transform: "none", right: "auto" };
      newArrowStyle = { left: `${rect.width / 2}px`, transform: "translateX(-50%)", right: "auto" };
    } else if (screenW - rect.right < threshold) {
      // Align Right
      newTooltipStyle = { right: "0", left: "auto", transform: "none" };
      newArrowStyle = { right: `${rect.width / 2}px`, transform: "translateX(50%)", left: "auto" };
    }

    setCoords({ tooltip: newTooltipStyle, arrow: newArrowStyle });
    setIsVisible(true);
  };

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleOpen}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span 
        className="cursor-help font-medium text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30 rounded px-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        tabIndex={0}
        role="button"
        onFocus={handleOpen}
        onBlur={() => setIsVisible(false)}
        onClick={handleOpen}
      >
        {text}
      </span>
      
      <AnimatePresence>
        {isVisible && (
          <m.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={coords.tooltip}
            className="absolute z-50 bottom-full mb-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-200 text-zinc-900 text-xs rounded-lg shadow-xl border border-zinc-200 pointer-events-none min-w-[150px] md:w-max max-w-[min(90vw,250px)] md:max-w-[600px]"
          >
            {content}
            {/* Arrow */}
            <span 
              style={coords.arrow}
              className="absolute top-full -mt-1 border-4 border-transparent border-t-zinc-100 dark:border-t-zinc-200" 
            />
          </m.span>
        )}
      </AnimatePresence>
    </span>
  );
}
