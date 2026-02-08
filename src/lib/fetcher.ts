import { env } from './env';

// Constants
const MAX_RETRIES = 3;
const DEFAULT_REVALIDATE = 60;
const RETRY_DELAY_BASE = 1000;
const HTTP_STATUS_SERVICE_UNAVAILABLE = 503;
const HTTP_STATUS_GATEWAY_TIMEOUT = 504;
const HTTP_STATUS_BAD_GATEWAY = 502;

// API_URL retrieved inside fetchAPI from env

export class APIError extends Error {
    constructor(message: string, public status?: number, public errors?: unknown[]) {
        super(message);
        this.name = 'APIError';
    }
}

/**
 * Fetches data from the WordPress GraphQL API with retry logic and error handling.
 * 
 * @param query - The GraphQL query string
 * @param options - Configuration options for the request
 * @param options.variables - Variables to pass to the GraphQL query
 * @param options.revalidate - Cache revalidation time in seconds (default: 60)
 * @returns The data property from the GraphQL response
 * @throws {APIError} If the API returns errors or a non-success status code
 */
export async function fetchAPI(
    query: string,
    { variables, revalidate = DEFAULT_REVALIDATE }: { variables?: Record<string, unknown>, revalidate?: number | false } = {}
) {
    const API_URL = env.WORDPRESS_API_URL;
    if (!API_URL) {
        throw new Error("API URL is missing");
    }

    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    let lastError: unknown;

    // Retry logic for 503s or network errors
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // Log attempts locally for debugging
            if (process.env.NODE_ENV === 'development' && i === 0) {
                // console.log(`🌍 Fetching ${API_URL}...`); 
            }

            const res = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                    variables,
                }),
                next: revalidate !== false ? { revalidate } : undefined,
            });

            if (!res.ok) {
                const text = await res.text();
                // Handle Server Busy / Gateway Timeout specific status codes
                if (res.status === HTTP_STATUS_SERVICE_UNAVAILABLE || res.status === HTTP_STATUS_GATEWAY_TIMEOUT || res.status === HTTP_STATUS_BAD_GATEWAY) {
                    throw new APIError(`Server busy (${res.status})`, res.status);
                }
                throw new APIError(`API returned status ${res.status}: ${text.substring(0, 100)}`, res.status);
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                throw new Error(`API returned non-JSON response (${contentType}): ${text.substring(0, 100)}`);
            }

            const json = await res.json();
            if (json.errors) {
                const message = json.errors[0]?.message || 'Failed to fetch API: GraphQL Errors';
                throw new APIError(message, 200, json.errors);
            }
            return json.data;

        } catch (error) {
            lastError = error;
            const isRetryable = error instanceof APIError && (error.status === HTTP_STATUS_SERVICE_UNAVAILABLE || error.status === HTTP_STATUS_GATEWAY_TIMEOUT || error.status === HTTP_STATUS_BAD_GATEWAY);

            // Enhanced network error detection
            const isNetworkError = error instanceof Error && (
                error.message.includes('fetch') ||
                error.message.includes('network') ||
                error.message.includes('ETIMEDOUT') ||
                error.message.includes('ECONNREFUSED') ||
                error.message.includes('socket hang up')
            );

            const errorMessage = error instanceof Error ? error.message : String(error);

            if (process.env.NODE_ENV === 'development') {
                console.warn(`[API] Attempt ${i + 1} failed for ${API_URL}: ${errorMessage}`);
            }

            // Retry for retryable errors if we haven't reached the max retries limit
            if ((isRetryable || isNetworkError) && i < MAX_RETRIES - 1) {
                const delay = RETRY_DELAY_BASE * Math.pow(2, i); // Exponential backoff: 1s, 2s
                if (process.env.NODE_ENV === 'development') {
                    console.warn(`⏳ Retrying in ${delay}ms...`);
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }

    // If the loop finishes without returning, it means all retries failed.
    if (lastError) {
        if (lastError instanceof APIError) throw lastError;
        const message = lastError instanceof Error ? lastError.message : 'Unknown error occurred';
        if (message.includes('SSL')) {
            throw new Error(`SSL Handshake Failed: Gagal terhubung ke ${API_URL}. Masalah SSL.`);
        }
        throw new Error(`Failed to fetch API from ${API_URL}. ${message}`);
    }
    throw new Error('Failed to fetch API after retries.');
}


