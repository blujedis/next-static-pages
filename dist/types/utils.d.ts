import { IFilterXSSOptions } from 'xss';
/**
 * Creates a slug from path segments and name.
 *
 * @param segments array of segments used to create a slug.
 * @returns A slugified string.
 */
export declare function slugify(segments: string[]): string;
/**
 * Ensures the result and an array of a given type.
 *
 * @param arr an type or array of type.
 * @returns An array of the specified type.
 */
export declare function normalizeArray<T>(arr: T | T[] | undefined | null | false): T[];
/**
 * Removes/filters duplicate strings.
 *
 * @param arr the array of paths to dedupe.
 * @returns De-duplicated array of paths.
 */
export declare function dedupe(arr: string[]): string[];
/**
 * Sanitizes content for safely injecting into innerHTML.
 *
 * @param content the content to be sanitized.
 * @param options sanitization options.
 * @returns Sanitized HTML content.
 */
export declare function sanitizer(content: string, options?: IFilterXSSOptions): string;
