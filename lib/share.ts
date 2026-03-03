import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

/**
 * Compresses a string for URL-safe sharing.
 * Uses LZ-based compression and URI encoding.
 * @param data - The string data to compress
 * @returns Compressed string
 */
export function compress(data: string): string {
  return compressToEncodedURIComponent(data);
}

/**
 * Decompresses a URL-safe string back to original data.
 * @param data - The compressed string
 * @returns Original string or empty string if failed
 */
export function decompress(data: string): string {
  return decompressFromEncodedURIComponent(data) || "";
}
