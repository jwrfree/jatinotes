"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { ImageProps } from "next/image";
import { m, AnimatePresence } from "framer-motion";

interface ImageZoomProps extends ImageProps {
    alt: string;
}

export default function ImageZoom({ src, alt, className, ...props }: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKey);
        };
    }, [isOpen, close]);

    if (imageError) {
        return (
            <div className={`flex items-center justify-center w-full h-full bg-zinc-200 dark:bg-zinc-700 rounded-lg aspect-video ${className}`}>
                <span className="text-sm text-zinc-500">Gambar tidak tersedia</span>
            </div>
        );
    }

    return (
        <>
            <div
                className={`relative cursor-zoom-in overflow-hidden ${className}`}
                onClick={() => setIsOpen(true)}
                role="button"
                tabIndex={0}
                aria-label={`Perbesar gambar: ${alt}`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsOpen(true); } }}
            >
                <Image
                    src={src}
                    alt={alt}
                    className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
                    onError={() => setImageError(true)}
                    {...props}
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
                        onClick={close}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Gambar diperbesar: ${alt}`}
                    >
                        <m.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full max-w-7xl max-h-screen p-4 flex items-center justify-center"
                        >
                            <div className="relative w-full h-full max-h-[90vh]">
                                <Image
                                    src={src}
                                    alt={alt}
                                    fill
                                    className="object-contain"
                                    quality={100}
                                    priority
                                />
                            </div>

                            <button
                                className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    close();
                                }}
                                aria-label="Tutup"
                                autoFocus
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
