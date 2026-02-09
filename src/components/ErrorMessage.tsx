/**
 * Error Message Component
 * Displays user-friendly error messages with retry functionality
 */

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    variant?: 'error' | 'warning' | 'info';
    className?: string;
}

export default function ErrorMessage({
    title = 'Oops! Something went wrong',
    message,
    onRetry,
    variant = 'error',
    className = ''
}: ErrorMessageProps) {
    const variantStyles = {
        error: {
            container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
            title: 'text-red-900 dark:text-red-100',
            message: 'text-red-700 dark:text-red-300',
            button: 'bg-red-600 hover:bg-red-700 text-white'
        },
        warning: {
            container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
            title: 'text-yellow-900 dark:text-yellow-100',
            message: 'text-yellow-700 dark:text-yellow-300',
            button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        },
        info: {
            container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
            title: 'text-blue-900 dark:text-blue-100',
            message: 'text-blue-700 dark:text-blue-300',
            button: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className={`p-6 border rounded-lg ${styles.container} ${className}`}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    {variant === 'error' && (
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {variant === 'warning' && (
                        <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )}
                    {variant === 'info' && (
                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className={`font-semibold sm:font-bold ${styles.title}`}>{title}</h3>
                    <p className={`text-sm mt-2 ${styles.message}`}>{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${styles.button}`}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Usage Examples:
 * 
 * <ErrorMessage message="Failed to load posts" onRetry={fetchPosts} />
 * <ErrorMessage 
 *   title="Network Error" 
 *   message="Please check your internet connection" 
 *   variant="warning"
 * />
 * <ErrorMessage 
 *   message="This feature is coming soon!" 
 *   variant="info"
 * />
 */
