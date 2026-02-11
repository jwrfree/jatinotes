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
        className="cursor-help border-b-2 border-dotted border-amber-500/80 dark:border-amber-400/80 hover:border-transparent hover:bg-amber-200 dark:hover:bg-amber-500/30 hover:text-amber-900 dark:hover:text-amber-100 focus:border-transparent focus:bg-amber-200 dark:focus:bg-amber-500/30 focus:text-amber-900 dark:focus:text-amber-100 transition-all duration-200 rounded px-1 focus:outline-none"
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
            className="absolute z-50 bottom-full mb-2 px-3 py-2 bg-zinc-100/80 dark:bg-zinc-200/80 backdrop-blur-md text-zinc-900 text-xs rounded-lg shadow-xl pointer-events-none min-w-[150px] md:w-max max-w-[min(90vw,250px)] md:max-w-[600px]"
          >
            {content}
            {/* Arrow */}
            <span 
              style={coords.arrow}
              className="absolute top-full -mt-1 border-4 border-transparent border-t-zinc-100/80 dark:border-t-zinc-200/80" 
            />
          </m.span>
        )}
      </AnimatePresence>
    </span>
  );
}
