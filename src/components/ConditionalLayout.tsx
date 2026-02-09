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
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
