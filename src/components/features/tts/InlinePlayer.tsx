"use client";

import { m, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    Square,
    Volume2,
    Settings2,
    Check,
    SkipForward,
    SkipBack,
    Gauge,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

const RATE_OPTIONS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

interface InlinePlayerProps {
    isPlaying: boolean;
    isPaused: boolean;
    onPlayPause: () => void;
    onStop: () => void;
    onSkipForward: () => void;
    onSkipBackward: () => void;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    onSelectVoice: (voice: SpeechSynthesisVoice) => void;
    rate: number;
    onRateChange: (rate: number) => void;
    progress: number;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    className?: string;
    getGenderLabel: (name: string) => string;
    listeningTime: number;
}

export default function InlinePlayer({
    isPlaying,
    isPaused,
    onPlayPause,
    onStop,
    onSkipForward,
    onSkipBackward,
    voices,
    selectedVoice,
    onSelectVoice,
    rate,
    onRateChange,
    progress,
    showSettings,
    setShowSettings,
    className = "",
    getGenderLabel,
    listeningTime,
}: InlinePlayerProps) {
    const settingsRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<"voice" | "speed">("voice");

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

    const isActive = isPlaying || isPaused;

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center gap-2">
                {/* Play/Pause Button */}
                <m.button
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
                    aria-label={isPlaying ? "Jeda" : isPaused ? "Lanjutkan" : "Dengarkan Artikel"}
                >
                    {isPlaying ? (
                        <>
                            <Pause className="w-4 h-4" />
                            <span>Jeda</span>
                            <m.div
                                className="flex gap-0.5 items-end h-3 ml-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {[1, 2, 3].map((bar) => (
                                    <m.div
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
                            </m.div>
                        </>
                    ) : (
                        <>
                            {isPaused ? (
                                <Play className="w-4 h-4" />
                            ) : (
                                <Volume2 className="w-4 h-4" />
                            )}
                            <span>{isPaused ? "Lanjutkan" : "Dengarkan"}</span>
                            {!isPaused && listeningTime > 0 && (
                                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                    ~{listeningTime} mnt
                                </span>
                            )}
                        </>
                    )}
                </m.button>

                {/* Skip Controls (visible when playing/paused) */}
                <AnimatePresence>
                    {isActive && (
                        <>
                            <m.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={onSkipBackward}
                                className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                aria-label="Paragraf sebelumnya"
                                title="Paragraf sebelumnya (←)"
                            >
                                <SkipBack className="w-4 h-4" />
                            </m.button>
                            <m.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={onSkipForward}
                                className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                aria-label="Paragraf selanjutnya"
                                title="Paragraf selanjutnya (→)"
                            >
                                <SkipForward className="w-4 h-4" />
                            </m.button>
                        </>
                    )}
                </AnimatePresence>

                {/* Settings Toggle */}
                <div className="relative">
                    <m.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-full transition-colors ${showSettings
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                        aria-label="Pengaturan Suara"
                    >
                        <Settings2 className="w-4 h-4 text-current" />
                    </m.button>

                    {/* Settings Dropdown */}
                    <AnimatePresence>
                        {showSettings && (
                            <m.div
                                ref={settingsRef}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden"
                            >
                                {/* Tabs */}
                                <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                                    <button
                                        onClick={() => setActiveTab("voice")}
                                        className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                                            activeTab === "voice"
                                                ? "text-amber-600 bg-amber-50/50 dark:bg-amber-900/10 dark:text-amber-400 border-b-2 border-amber-500"
                                                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                        }`}
                                    >
                                        Suara ({voices.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("speed")}
                                        className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                                            activeTab === "speed"
                                                ? "text-amber-600 bg-amber-50/50 dark:bg-amber-900/10 dark:text-amber-400 border-b-2 border-amber-500"
                                                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                        }`}
                                    >
                                        <Gauge className="w-3.5 h-3.5" />
                                        Kecepatan
                                    </button>
                                </div>

                                {/* Voice Tab */}
                                {activeTab === "voice" && (
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
                                                            {voice.localService ? " · Lokal" : " · Online"}
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
                                )}

                                {/* Speed Tab */}
                                {activeTab === "speed" && (
                                    <div className="py-2">
                                        {RATE_OPTIONS.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    onRateChange(option);
                                                    setShowSettings(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between
                          ${rate === option
                                                        ? "text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-900/10"
                                                        : "text-zinc-600 dark:text-zinc-300"
                                                    }
                        `}
                                            >
                                                <div>
                                                    <span className="font-medium">
                                                        {option}x
                                                    </span>
                                                    <span className="text-xs text-zinc-400 ml-2">
                                                        {option < 1 ? "Lambat" : option === 1 ? "Normal" : option <= 1.25 ? "Sedikit cepat" : option <= 1.5 ? "Cepat" : "Sangat cepat"}
                                                    </span>
                                                </div>
                                                {rate === option && (
                                                    <Check className="w-4 h-4 shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Stop Button */}
                <AnimatePresence>
                    {isActive && (
                        <m.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={onStop}
                            className="p-2 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label="Berhenti"
                            title="Berhenti (Esc)"
                        >
                            <Square className="w-4 h-4 fill-current" />
                        </m.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
                {isActive && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <m.div
                                    className="h-full bg-amber-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <span className="text-[10px] text-zinc-400 tabular-nums min-w-[32px] text-right">
                                {progress}%
                            </span>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}
