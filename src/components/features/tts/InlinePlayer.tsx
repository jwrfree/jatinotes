"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    Square,
    Volume2,
    Settings2,
    Check,
} from "lucide-react";
import { useRef, useEffect } from "react";

interface InlinePlayerProps {
    isPlaying: boolean;
    isPaused: boolean;
    onPlayPause: () => void;
    onStop: () => void;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    onSelectVoice: (voice: SpeechSynthesisVoice) => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    className?: string;
    getGenderLabel: (name: string) => string;
}

export default function InlinePlayer({
    isPlaying,
    isPaused,
    onPlayPause,
    onStop,
    voices,
    selectedVoice,
    onSelectVoice,
    showSettings,
    setShowSettings,
    className = "",
    getGenderLabel,
}: InlinePlayerProps) {
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                settingsRef.current &&
                !settingsRef.current.contains(event.target as Node)
            ) {
                setShowSettings(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSettings]);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPlayPause}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
          ${isPlaying
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }
        `}
                aria-label={isPlaying ? "Jeda" : "Dengarkan Artikel"}
            >
                {isPlaying ? (
                    <>
                        <Pause className="w-4 h-4" />
                        <span>Jeda</span>
                        <motion.div
                            className="flex gap-0.5 items-end h-3 ml-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {[1, 2, 3].map((bar) => (
                                <motion.div
                                    key={bar}
                                    className="w-0.5 bg-current rounded-full"
                                    animate={{
                                        height: [4, 12, 4],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: bar * 0.1,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </>
                ) : (
                    <>
                        {isPaused ? (
                            <Play className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                        <span>{isPaused ? "Lanjutkan" : "Dengarkan"}</span>
                    </>
                )}
            </motion.button>

            {/* Settings Toggle */}
            <div className="relative">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-full transition-colors ${showSettings
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    aria-label="Pilih Suara"
                >
                    <Settings2 className="w-4 h-4 text-current" />
                </motion.button>

                {/* Settings Dropdown */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            ref={settingsRef}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden"
                        >
                            <div className="py-2">
                                <div className="px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-800/50">
                                    Pilih Suara ({voices.length})
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {voices.length > 0 ? (
                                        voices.map((voice) => (
                                            <button
                                                key={voice.name}
                                                onClick={() => {
                                                    onSelectVoice(voice);
                                                    setShowSettings(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group
                          ${selectedVoice?.name === voice.name
                                                        ? "text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-900/10"
                                                        : "text-zinc-600 dark:text-zinc-300"
                                                    }
                        `}
                                            >
                                                <div>
                                                    <span className="font-medium block">
                                                        {voice.name
                                                            .replace("Microsoft", "")
                                                            .replace("Google", "")
                                                            .replace("Bahasa Indonesia", "")
                                                            .trim() || voice.name}
                                                    </span>
                                                    <span className="text-xs text-zinc-400 font-normal">
                                                        {getGenderLabel(voice.name)}
                                                    </span>
                                                </div>
                                                {selectedVoice?.name === voice.name && (
                                                    <Check className="w-4 h-4 shrink-0" />
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-sm text-zinc-500">
                                            Tidak ada suara Bahasa Indonesia ditemukan di browser Anda.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {(isPlaying || isPaused) && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={onStop}
                        className="p-2 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Berhenti"
                    >
                        <Square className="w-4 h-4 fill-current" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
