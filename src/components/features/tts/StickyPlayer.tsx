"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X } from "lucide-react";

interface StickyPlayerProps {
    isVisible: boolean;
    isPlaying: boolean;
    isPaused: boolean;
    onPlayPause: () => void;
    onStop: () => void;
}

export default function StickyPlayer({
    isVisible,
    isPlaying,
    isPaused,
    onPlayPause,
    onStop,
}: StickyPlayerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isVisible) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                key="sticky-player"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 p-2 pl-4 pr-2 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 ring-1 ring-white/50 dark:ring-white/5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
                <div className="flex gap-0.5 items-end h-3 mr-1">
                    {isPlaying &&
                        [1, 2, 3].map((bar) => (
                            <motion.div
                                key={bar}
                                className="w-1 bg-amber-500 rounded-full"
                                animate={{ height: [4, 16, 4] }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: bar * 0.1,
                                }}
                            />
                        ))}
                    {!isPlaying && (
                        <div className="flex gap-0.5 items-end">
                            <div className="w-1 h-3 bg-zinc-300 rounded-full"></div>
                            <div className="w-1 h-2 bg-zinc-300 rounded-full"></div>
                            <div className="w-1 h-3 bg-zinc-300 rounded-full"></div>
                        </div>
                    )}
                </div>

                <div className="w-[88px] text-xs font-medium text-zinc-600 dark:text-zinc-300 pr-2 border-r border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={isPaused ? "paused" : "listening"}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="block"
                        >
                            {isPaused ? "Dijeda" : "Mendengarkan"}
                        </motion.span>
                    </AnimatePresence>
                </div>

                <button
                    onClick={onPlayPause}
                    className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                    aria-label={isPlaying ? "Jeda" : "Putar"}
                >
                    {isPlaying ? (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key="pause"
                                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Pause className="w-4 h-4 fill-current" />
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key="play"
                                initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotate: -45 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Play className="w-4 h-4 fill-current" />
                            </motion.div>
                        </AnimatePresence>
                    )}
                </button>

                <button
                    onClick={onStop}
                    className="p-2 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Berhenti dan Tutup"
                >
                    <X className="w-4 h-4" />
                </button>
            </motion.div >
        </AnimatePresence >,
        document.body
    );
}
