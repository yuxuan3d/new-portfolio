import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

if (import.meta.env.DEV) {
  // Debug environment variables (non-sensitive only)
  console.log('Environment Variables Status:', {
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'not set',
    dataset: import.meta.env.VITE_SANITY_DATASET || 'not set',
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION || 'not set'
  });
}

const config = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '5gu0ubge',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-03-14', // Using a fixed date for API version
  perspective: 'published', // Explicitly set the perspective
  token: import.meta.env.VITE_SANITY_TOKEN, // Add token if you have one
};

if (import.meta.env.DEV) {
  // Only log non-sensitive information
  console.log('Sanity Config:', {
    projectId: config.projectId,
    dataset: config.dataset,
    useCdn: config.useCdn,
    apiVersion: config.apiVersion,
    perspective: config.perspective
  });
}

export const client = createClient(config);

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  if (!source) return '';
  return builder.image(source);
}
