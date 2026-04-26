"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, SkipForward, SkipBack } from "lucide-react";

const RATE_CYCLE = [1.0, 1.25, 1.5, 1.75, 2.0, 0.75];

interface StickyPlayerProps {
    isVisible: boolean;
    isPlaying: boolean;
    isPaused: boolean;
    onPlayPause: () => void;
    onStop: () => void;
    onSkipForward: () => void;
    onSkipBackward: () => void;
    progress: number;
    rate: number;
    onRateChange: (rate: number) => void;
}

export default function StickyPlayer({
    isVisible,
    isPlaying,
    isPaused,
    onPlayPause,
    onStop,
    onSkipForward,
    onSkipBackward,
    progress,
    rate,
    onRateChange,
}: StickyPlayerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const cycleRate = () => {
        const currentIdx = RATE_CYCLE.indexOf(rate);
        const nextIdx = (currentIdx + 1) % RATE_CYCLE.length;
        onRateChange(RATE_CYCLE[nextIdx]);
    };

    if (!mounted || !isVisible) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                key="sticky-player"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-1"
            >
                {/* Progress bar */}
                <div className="w-full px-4">
                    <div className="h-0.5 bg-white/20 rounded-full overflow-hidden w-48">
                        <motion.div
                            className="h-full bg-amber-500 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 pl-4 pr-2 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 ring-1 ring-white/50 dark:ring-white/5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
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

                    {/* Skip Back */}
                    <button
                        onClick={onSkipBackward}
                        className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Paragraf sebelumnya"
                    >
                        <SkipBack className="w-3.5 h-3.5" />
                    </button>

                    {/* Play/Pause */}
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

                    {/* Skip Forward */}
                    <button
                        onClick={onSkipForward}
                        className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Paragraf selanjutnya"
                    >
                        <SkipForward className="w-3.5 h-3.5" />
                    </button>

                    {/* Rate Toggle */}
                    <button
                        onClick={cycleRate}
                        className="px-2 py-1 rounded-full text-[10px] font-bold text-zinc-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors tabular-nums"
                        aria-label={`Kecepatan ${rate}x`}
                        title="Ganti kecepatan"
                    >
                        {rate}x
                    </button>

                    {/* Close/Stop */}
                    <button
                        onClick={onStop}
                        className="p-2 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Berhenti dan Tutup"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
