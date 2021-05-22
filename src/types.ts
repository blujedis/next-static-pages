import type { GrayMatterFile } from 'gray-matter';
import type { FC } from 'react';

/**
 * Next Static Pages functional component.
 */
export type NSPComponent<P extends IParsedResult = IParsedResult> = FC<P>;

export interface IGlobOptions {

  /**
   * The directory or directories to parse static files/pages from.
   * 
   * @default statics
   */
   dirs: string | string[];

   /**
    * The supported extensions that may be resolved when rendering static files/pages.
    * 
    * @default md
    */
   extensions: string | string[];
 
   /**
    * When true starting from the above defined directories files will be resolved recursively.
    * 
    * @default false
    */
   recursive: boolean;

}

export interface IOptions extends IGlobOptions {

  /**
   * The param key used to identify the dynamic file to be loaded. 
   * 
   * @default slug
   */
  paramKey: string;

  /**
   * When true apply syntax highlighting to the content before sending to component props.
   * 
   * @default false
   */
  highlight: boolean;

  /**
   * The locale to be filtered applied. When defined it is assumed each 
   * 
   * @default undefined
   */
  locale: string | undefined;

  /**
   * Indicates mode for handling previously generated static content. See below for why this 
   * was introduced.
   * 
   * @see https://github.com/vercel/next.js/issues/15637
   */
  fallback: boolean | 'blocking';

  /**
   * When true the paths are relative from the root directory of parsed paths.
   */
  excludeRootDir: boolean;
  
}

/**
 * Internal typing of options.
 * 
 * @ignore
 */
export interface IOptionsInternal extends IOptions {
  dirs: string[];
  extensions: string[];
}

export interface IPathResolved {

  /**
   * The resolved path based on specified dirs and file type by extention.
   */
  path: string;

  /**
   * The extension of the path used in determining if markdown and gray matter should be parsed.
   */
  ext: string;

  /**
   * A generated slug or key for matching params in getStaticProps.
   */
  slug: string;

}

export interface IParsedResult<T = Record<string, any>> {

  /**
   * Optional metadata parsed from file with file type is markdown.
   */
  data: T;

  /**
   * The parsed content string to be passed to component props for rendering.
   */
  content: string;

}

/**
 * Gray matter parsed result.
 */
export type GrayMatterResult<T = Record<string, any>> = Omit<GrayMatterFile<string>, 'data'> & { data: T };