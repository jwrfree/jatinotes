/**
 * Empty State Component
 * Displays engaging empty states with icons and call-to-action
 */

import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
    className = ''
}: EmptyStateProps) {
    const ActionButton = () => {
        const buttonClasses = "inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors";

        if (actionHref) {
            return (
                <Link href={actionHref} className={buttonClasses}>
                    {actionLabel}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            );
        }

        if (onAction) {
            return (
                <button onClick={onAction} className={buttonClasses}>
                    {actionLabel}
                </button>
            );
        }

        return null;
    };

    return (
        <div className={`text-center py-20 ${className}`}>
            {icon && (
                <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                    {icon}
                </div>
            )}

            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                {title}
            </h3>

            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
                {description}
            </p>

            {(actionLabel && (actionHref || onAction)) && <ActionButton />}
        </div>
    );
}

/**
 * Usage Examples:
 * 
 * <EmptyState
 *   icon={<BookIcon className="w-10 h-10 text-amber-500" />}
 *   title="No Books Yet"
 *   description="Start your reading journey by adding your first book review."
 *   actionLabel="Add Book"
 *   actionHref="/studio"
 * />
 * 
 * <EmptyState
 *   title="No Results Found"
 *   description="Try adjusting your search or filters to find what you're looking for."
 *   actionLabel="Clear Filters"
 *   onAction={clearFilters}
 * />
 */
