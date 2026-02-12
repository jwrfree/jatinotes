export const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-08'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!dataset) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_DATASET environment variable");
}

if (!projectId) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable");
}

export const useCdn = false
