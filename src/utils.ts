import xss, { IFilterXSSOptions } from 'xss';

/**
 * Creates a slug from path segments and name.
 * 
 * @param segments array of segments used to create a slug.
 * @returns A slugified string.
 */
 export function slugify(segments: string[]) {
  return segments.map(v => v.replace(/[.\s]/g, '-')).join('-');
}

/**
 * Ensures the result and an array of a given type.
 * 
 * @param arr an type or array of type.
 * @returns An array of the specified type.
 */
export function normalizeArray<T>(arr: T | T[] | undefined | null | false): T[] {
  // if falsey or already array return array or empty array.
  if (Array.isArray(arr) || typeof arr === 'undefined' || !arr) return (arr || []) as T[];
  return [arr];
}

/**
 * Removes/filters duplicate strings.
 * 
 * @param arr the array of paths to dedupe.
 * @returns De-duplicated array of paths.
 */
export function dedupe(arr: string[]) {
  return arr.filter((v, i) => arr.indexOf(v) === i);
}

/**
 * Sanitizes content for safely injecting into innerHTML.
 * 
 * @param content the content to be sanitized.
 * @param options sanitization options.
 * @returns Sanitized HTML content.
 */
export function sanitizer(content: string, options?: IFilterXSSOptions) {
  return xss(content, options);
}
