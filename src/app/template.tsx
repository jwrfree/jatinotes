"use client";

import { m } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
        >
            {children}
        </m.div>
    );
}
