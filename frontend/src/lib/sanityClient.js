import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: false,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  withCredentials: true,
};

// Only log non-sensitive information
console.log('Sanity Config:', {
  useCdn: config.useCdn,
  apiVersion: config.apiVersion,
  withCredentials: config.withCredentials
});

export const client = createClient(config);

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  if (!source) return '';
  return builder.image(source);
}