"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import StickyPlayer from "./tts/StickyPlayer";
import InlinePlayer from "./tts/InlinePlayer";
import {
    preprocessTtsText,
    chunkTtsText,
    estimateListeningTime,
    type TtsChunk,
} from "@/lib/tts";

const STORAGE_KEY_VOICE = "jatinotes-tts-voice";
const STORAGE_KEY_RATE = "jatinotes-tts-rate";

interface ListenToArticleProps {
    text: string;
    title?: string;
    className?: string;
}

export default function ListenToArticle({
    text,
    title,
    className = "",
}: ListenToArticleProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [supported, setSupported] = useState(false);

    // Voice state
    const [idVoices, setIdVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] =
        useState<SpeechSynthesisVoice | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    // Playback controls
    const [rate, setRate] = useState(1.0);
    const [progress, setProgress] = useState(0);
    const [listeningTime, setListeningTime] = useState(0);

    // Sticky state
    const [isStickyVisible, setIsStickyVisible] = useState(false);

    // Refs
    const chunksRef = useRef<TtsChunk[]>([]);
    const currentChunkIndexRef = useRef(0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const processedTextRef = useRef("");

    // Preprocess text once
    useEffect(() => {
        processedTextRef.current = preprocessTtsText(text);
        setListeningTime(estimateListeningTime(processedTextRef.current, rate));
    }, [text, rate]);

    // Restore preferences from localStorage
    useEffect(() => {
        try {
            const savedRate = localStorage.getItem(STORAGE_KEY_RATE);
            if (savedRate) {
                const parsed = parseFloat(savedRate);
                if (parsed >= 0.5 && parsed <= 2.5) setRate(parsed);
            }
        } catch {
            // localStorage unavailable
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setSupported(true);

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                const indonesianVoices = availableVoices.filter(
                    (v) =>
                        v.lang.toLowerCase().includes("id-id") ||
                        v.lang.toLowerCase().includes("indonesian")
                );

                setIdVoices(indonesianVoices);

                if (indonesianVoices.length > 0 && !selectedVoice) {
                    // Try to restore saved voice
                    const savedVoiceName = localStorage.getItem(STORAGE_KEY_VOICE);
                    const savedVoice = savedVoiceName
                        ? indonesianVoices.find((v) => v.name === savedVoiceName)
                        : null;

                    if (savedVoice) {
                        setSelectedVoice(savedVoice);
                    } else {
                        const googleVoice = indonesianVoices.find((v) =>
                            v.name.includes("Google")
                        );
                        setSelectedVoice(googleVoice || indonesianVoices[0]);
                    }
                }
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, [selectedVoice]);

    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Handle Scroll for Sticky Player
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            if (isPlaying || isPaused) {
                const rect = containerRef.current.getBoundingClientRect();
                const isOutOfView = rect.bottom < 0;
                setIsStickyVisible(isOutOfView);
            } else {
                setIsStickyVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isPlaying, isPaused]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying && !isPaused) return;

            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

            switch (e.key) {
                case " ":
                    e.preventDefault();
                    handlePlayPause();
                    break;
                case "Escape":
                    e.preventDefault();
                    handleStop();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    handleSkipForward();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    handleSkipBackward();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, isPaused]);

    // Dynamic voice switching
    useEffect(() => {
        if (isPlaying && !isPaused && selectedVoice) {
            window.speechSynthesis.cancel();
            speakNextChunk();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVoice]);

    // Dynamic rate switching
    useEffect(() => {
        if (isPlaying && !isPaused) {
            window.speechSynthesis.cancel();
            speakNextChunk();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rate]);

    // Persist preferences
    const handleVoiceSelect = useCallback((voice: SpeechSynthesisVoice) => {
        setSelectedVoice(voice);
        try {
            localStorage.setItem(STORAGE_KEY_VOICE, voice.name);
        } catch {
            // localStorage unavailable
        }
    }, []);

    const handleRateChange = useCallback((newRate: number) => {
        setRate(newRate);
        try {
            localStorage.setItem(STORAGE_KEY_RATE, String(newRate));
        } catch {
            // localStorage unavailable
        }
    }, []);

    const getGenderLabel = (name: string) => {
        const lowerName = name.toLowerCase();
        // Male voice indicators
        if (/andika|ardi|david|gagah|wijaya|male/.test(lowerName)) return "Cowok";
        // Female voice indicators
        if (/gadis|damayanti|siti|tuti|female|wanita/.test(lowerName)) return "Cewek";
        if (lowerName.includes("google")) return "Google Voice";
        // Use localService as hint
        return "Suara Lainnya";
    };

    const speakNextChunk = useCallback(() => {
        const chunks = chunksRef.current;
        const idx = currentChunkIndexRef.current;

        if (idx >= chunks.length) {
            setIsPlaying(false);
            setIsPaused(false);
            setIsStickyVisible(false);
            setProgress(100);
            currentChunkIndexRef.current = 0;
            toast.success("Selesai mendengarkan");
            return;
        }

        const chunk = chunks[idx];
        const utterance = new SpeechSynthesisUtterance(chunk.text);
        utteranceRef.current = utterance;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            utterance.lang = "id-ID";
        }

        utterance.rate = rate;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            currentChunkIndexRef.current += 1;
            setProgress(Math.round(((idx + 1) / chunks.length) * 100));

            // Paragraph pause: longer delay between paragraphs
            if (chunk.isLastInParagraph && idx + 1 < chunks.length) {
                setTimeout(() => speakNextChunk(), 400);
            } else {
                speakNextChunk();
            }
        };

        utterance.onerror = (e) => {
            if (e.error === "interrupted" || e.error === "canceled") return;
            console.error("Speech synthesis error:", e);
            // Skip failed chunk and continue
            currentChunkIndexRef.current += 1;
            if (currentChunkIndexRef.current < chunks.length) {
                speakNextChunk();
            } else {
                setIsPlaying(false);
                setIsPaused(false);
                setIsStickyVisible(false);
                toast.error(`Gagal memutar audio: ${e.error}`);
            }
        };

        window.speechSynthesis.speak(utterance);
    }, [selectedVoice, rate]);

    const handlePlayPause = () => {
        if (!supported) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
            return;
        }

        window.speechSynthesis.cancel();
        if (utteranceRef.current) {
            utteranceRef.current.onerror = null;
            utteranceRef.current.onend = null;
        }

        const chunks = chunkTtsText(processedTextRef.current, 350);
        chunksRef.current = chunks;
        currentChunkIndexRef.current = 0;
        setProgress(0);

        if (chunks.length === 0) {
            toast.error("Tidak ada teks yang dapat dibaca.");
            return;
        }

        setIsPlaying(true);
        if (title) toast.success(`Mulai mendengarkan: ${title}`);

        speakNextChunk();
    };

    const handleStop = () => {
        if (!supported) return;
        if (utteranceRef.current) {
            utteranceRef.current.onerror = null;
            utteranceRef.current.onend = null;
        }
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setIsStickyVisible(false);
        setProgress(0);
        currentChunkIndexRef.current = 0;
    };

    const handleSkipForward = () => {
        if (!isPlaying && !isPaused) return;

        const chunks = chunksRef.current;
        const currentIdx = currentChunkIndexRef.current;
        const currentParagraph = chunks[currentIdx]?.paragraphIndex ?? 0;

        // Find next paragraph boundary
        let nextIdx = currentIdx + 1;
        while (nextIdx < chunks.length && chunks[nextIdx].paragraphIndex === currentParagraph) {
            nextIdx++;
        }

        if (nextIdx >= chunks.length) {
            handleStop();
            return;
        }

        window.speechSynthesis.cancel();
        if (utteranceRef.current) {
            utteranceRef.current.onerror = null;
            utteranceRef.current.onend = null;
        }
        currentChunkIndexRef.current = nextIdx;
        setProgress(Math.round((nextIdx / chunks.length) * 100));
        setIsPlaying(true);
        setIsPaused(false);
        speakNextChunk();
    };

    const handleSkipBackward = () => {
        if (!isPlaying && !isPaused) return;

        const chunks = chunksRef.current;
        const currentIdx = currentChunkIndexRef.current;
        const currentParagraph = chunks[currentIdx]?.paragraphIndex ?? 0;

        // Find start of current paragraph, then previous paragraph
        let prevIdx = currentIdx;
        while (prevIdx > 0 && chunks[prevIdx].paragraphIndex === currentParagraph) {
            prevIdx--;
        }
        // If we were at the start of a paragraph, go to previous paragraph start
        if (prevIdx > 0) {
            const prevParagraph = chunks[prevIdx].paragraphIndex;
            while (prevIdx > 0 && chunks[prevIdx - 1].paragraphIndex === prevParagraph) {
                prevIdx--;
            }
        }

        window.speechSynthesis.cancel();
        if (utteranceRef.current) {
            utteranceRef.current.onerror = null;
            utteranceRef.current.onend = null;
        }
        currentChunkIndexRef.current = prevIdx;
        setProgress(Math.round((prevIdx / chunks.length) * 100));
        setIsPlaying(true);
        setIsPaused(false);
        speakNextChunk();
    };

    if (!supported) return null;

    return (
        <>
            {/* ARIA live region for state announcements */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isPlaying && "Sedang memutar"}
                {isPaused && "Dijeda"}
            </div>

            {/* Main In-Place Controller */}
            <div ref={containerRef}>
                <InlinePlayer
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    onPlayPause={handlePlayPause}
                    onStop={handleStop}
                    onSkipForward={handleSkipForward}
                    onSkipBackward={handleSkipBackward}
                    voices={idVoices}
                    selectedVoice={selectedVoice}
                    onSelectVoice={handleVoiceSelect}
                    rate={rate}
                    onRateChange={handleRateChange}
                    progress={progress}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    getGenderLabel={getGenderLabel}
                    listeningTime={listeningTime}
                    className={className}
                />
            </div>

            {/* Conditional Sticky Player (Bottom Floating) */}
            <StickyPlayer
                isVisible={isStickyVisible}
                isPlaying={isPlaying}
                isPaused={isPaused}
                onPlayPause={handlePlayPause}
                onStop={handleStop}
                onSkipForward={handleSkipForward}
                onSkipBackward={handleSkipBackward}
                progress={progress}
                rate={rate}
                onRateChange={handleRateChange}
            />
        </>
    );
}
