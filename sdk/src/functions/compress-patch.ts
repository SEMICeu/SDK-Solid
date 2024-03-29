import { compress } from 'brotli-compress';
import { Patch } from '../models/patch-model';

/**
 * Compresses a patch document.
 *
 * @param patch - The patch document to compress.
 * @returns The compressed base64 string of the patch document.
 */
export const compressPatch = async (
  patch: Patch,
): Promise<string> => {

  // Start by stringifying the patch request.
  const patchString = JSON.stringify(patch);

  // Create a buffer from the utf-8 string.
  const encoder = new TextEncoder();
  const patchBuffer = encoder.encode(patchString);

  // Use Brotli to compress the buffer.
  const compressed = await compress(patchBuffer);

  // Convert compressed buffer to a base64 string.
  return btoa(String.fromCharCode.apply(
    null,
    Array.prototype.slice.apply<Uint8Array, number[]>(compressed)
  ));

};
