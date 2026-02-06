"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageZoomProps extends ImageProps {
    alt: string;
}

export default function ImageZoom({ src, alt, className, ...props }: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Thumbnail Image */}
            <div
                className={`cursor-zoom-in relative ${className}`}
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    {...props}
                    className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"} ${className}`}
                />
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            layoutId={`image-${typeof src === 'string' ? src : 'zoom'}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-5xl max-h-[90vh] aspect-video"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        >
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </motion.div>

                        {/* Close Button Hint */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
