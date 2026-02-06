"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { m, AnimatePresence } from "framer-motion";

interface ImageZoomProps extends ImageProps {
    alt: string;
}

export default function ImageZoom({ src, alt, className, ...props }: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <>
            {/* Thumbnail Image */}
            <div
                className={`cursor-zoom-in relative ${className}`}
                onClick={() => setIsOpen(true)}
            >
                {!imageError ? (
                    <Image
                        src={src}
                        alt={alt}
                        {...props}
                        className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"} ${className}`}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-zinc-200 dark:bg-zinc-700">
                        <div className="text-center p-8">
                            <svg className="w-12 h-12 mx-auto mb-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Gambar tidak tersedia</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
                        onClick={() => setIsOpen(false)}
                    >
                        <m.div
                            layoutId={`image-${typeof src === 'string' ? src : 'zoom'}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-5xl max-h-[90vh] aspect-video"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        >
                            {!imageError ? (
                                <Image
                                    src={src}
                                    alt={alt}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-zinc-800 rounded-lg">
                                    <div className="text-center p-8">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-lg text-zinc-400">Gambar tidak dapat dimuat</p>
                                        <p className="text-sm text-zinc-500 mt-2">URL gambar mungkin tidak valid atau tidak dapat diakses</p>
                                    </div>
                                </div>
                            )}
                        </m.div>

                        {/* Close Button Hint */}
                        <m.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </m.button>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
