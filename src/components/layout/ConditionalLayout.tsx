'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Conditional Layout Wrapper
 * Hides header and footer for specific routes (e.g., /studio)
 */
export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Hide header and footer for Sanity Studio
    const isStudioRoute = pathname?.startsWith('/studio');

    if (isStudioRoute) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
            >
                Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
