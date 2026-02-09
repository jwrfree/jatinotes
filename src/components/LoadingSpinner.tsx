/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes and variants
 */

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary';
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    variant = 'primary',
    className = ''
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4'
    };

    const variantClasses = {
        primary: 'border-amber-500 border-t-transparent',
        secondary: 'border-zinc-300 dark:border-zinc-700 border-t-transparent'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]} 
          rounded-full 
          animate-spin
        `}
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

/**
 * Usage Examples:
 * 
 * <LoadingSpinner /> // Default: medium, primary
 * <LoadingSpinner size="sm" /> // Small spinner
 * <LoadingSpinner variant="secondary" /> // Secondary color
 * <LoadingSpinner size="lg" className="my-8" /> // Large with custom margin
 */
