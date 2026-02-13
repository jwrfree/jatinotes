"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import StickyPlayer from "./tts/StickyPlayer";
import InlinePlayer from "./tts/InlinePlayer";

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

    // Sticky state
    const [isStickyVisible, setIsStickyVisible] = useState(false);

    // Refs
    const chunksRef = useRef<string[]>([]);
    const currentChunkIndexRef = useRef(0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setSupported(true);

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                // Filter strictly for Indonesian voices
                const indonesianVoices = availableVoices.filter(
                    (v) =>
                        v.lang.toLowerCase().includes("id-id") ||
                        v.lang.toLowerCase().includes("indonesian")
                );

                setIdVoices(indonesianVoices);

                // Auto-select first available or restore selection
                if (indonesianVoices.length > 0 && !selectedVoice) {
                    // Prefer "Google Bahasa Indonesia" as it's usually high quality
                    const googleVoice = indonesianVoices.find((v) =>
                        v.name.includes("Google")
                    );
                    setSelectedVoice(googleVoice || indonesianVoices[0]);
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

            // Only show sticky if playing/paused AND user scrolled past the original button
            if (isPlaying || isPaused) {
                const rect = containerRef.current.getBoundingClientRect();
                // Check if element is completely scrolled out of view (above the viewport)
                const isOutOfView = rect.bottom < 0;
                setIsStickyVisible(isOutOfView);
            } else {
                setIsStickyVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isPlaying, isPaused]);

    // Dynamic voice switching
    useEffect(() => {
        if (isPlaying && !isPaused && selectedVoice) {
            // If playing, restart current chunk with new voice
            window.speechSynthesis.cancel();
            speakNextChunk();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVoice]);

    // Guess gender helper
    const getGenderLabel = (name: string) => {
        const lowerName = name.toLowerCase();
        if (
            lowerName.includes("andika") ||
            lowerName.includes("ardi") ||
            lowerName.includes("david")
        )
            return "Cowok";
        if (
            lowerName.includes("gadis") ||
            lowerName.includes("damayanti") ||
            lowerName.includes("siti")
        )
            return "Cewek";
        if (lowerName.includes("google")) return "Google Voice"; // Usually female-sounding
        return "Suara Lainnya";
    };

    const chunkText = (text: string, maxLength: number = 180): string[] => {
        if (!text) return [];
        const sentenceRegex = /[^.!?]+[.!?]+(\s|$)/g;
        const sentences = text.match(sentenceRegex) || [text];
        const chunks: string[] = [];
        let currentChunk = "";
        sentences.forEach((sentence) => {
            if (currentChunk.length + sentence.length > maxLength) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += sentence;
            }
        });
        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks.reduce((acc: string[], chunk) => {
            if (chunk.length > maxLength) {
                const subChunks =
                    chunk.match(new RegExp(`.{1,${maxLength}}`, "g")) || [chunk];
                return [...acc, ...subChunks];
            }
            return [...acc, chunk];
        }, []);
    };

    const speakNextChunk = () => {
        if (currentChunkIndexRef.current >= chunksRef.current.length) {
            setIsPlaying(false);
            setIsPaused(false);
            setIsStickyVisible(false); // Hide sticky when finished
            currentChunkIndexRef.current = 0;
            return;
        }

        const chunk = chunksRef.current[currentChunkIndexRef.current];
        const utterance = new SpeechSynthesisUtterance(chunk);
        utteranceRef.current = utterance;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            utterance.lang = "id-ID";
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            currentChunkIndexRef.current += 1;
            speakNextChunk();
        };

        utterance.onerror = (e) => {
            if (e.error === "interrupted" || e.error === "canceled") return;
            console.error("Speech synthesis error details:", e);
            toast.error(`Gagal memutar audio: ${e.error}`);
            setIsPlaying(false);
            setIsPaused(false);
            setIsStickyVisible(false);
        };

        window.speechSynthesis.speak(utterance);
    };

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

        const chunks = chunkText(text, 200);
        chunksRef.current = chunks;
        currentChunkIndexRef.current = 0;

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
        currentChunkIndexRef.current = 0;
    };

    if (!supported) return null;

    return (
        <>
            {/* Main In-Place Controller */}
            <div ref={containerRef}>
                <InlinePlayer
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    onPlayPause={handlePlayPause}
                    onStop={handleStop}
                    voices={idVoices}
                    selectedVoice={selectedVoice}
                    onSelectVoice={setSelectedVoice}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    getGenderLabel={getGenderLabel}
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
            />
        </>
    );
}
