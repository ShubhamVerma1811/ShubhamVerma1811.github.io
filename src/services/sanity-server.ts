/**
 * Server-side Sanity utilities. By having these in a separate file from the
 * utilities we use on the client side, we are able to tree-shake (remove)
 * code that is not used on the client side.
 */
import { createClient } from 'next-sanity';
import { sanityConfig } from './sanity-config';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient(sanityConfig);

export const previewClient = createClient({
  ...sanityConfig,
  useCdn: false
});

export const getClient = (preview?: boolean) =>
  preview ? previewClient : sanityClient;

const builder = imageUrlBuilder(getClient());

//@ts-ignore
export const urlFor = (source) => {
  return builder.image(source);
};
