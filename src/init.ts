/// <reference path="../node_modules/highlight.js/types/index.d.ts" />

import fglob from 'fast-glob';
import { readFile } from 'fs/promises';
import { extname, join, relative, sep } from 'path';
import gmatter from 'gray-matter';
import markdown from 'markdown-it';
import highlighter from 'highlight.js/lib/core';
import slugify from 'slugify';
import type { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import type {
  GrayMatterResult, IParsedResult, IOptions,
  IOptionsInternal, IPathResolved, IGlobOptions,
} from './types';

const DEFAULTS: IOptions = {
  paramKey: 'slug',
  dirs: 'statics',
  extensions: ['md', 'html'],
  recursive: false,
  highlight: false,
  locale: undefined,
  fallback: false,
  excludeRootDir: true
};

function nsp(initOptions?: Partial<IOptions>) {

  initOptions = {
    ...DEFAULTS,
    ...initOptions
  };

  if (!Array.isArray(initOptions.dirs))
    initOptions.dirs = [initOptions.dirs] as string[];

  if (!Array.isArray(initOptions.extensions))
    initOptions.extensions = [initOptions.extensions] as string[];

  initOptions.extensions = initOptions.extensions.map(v => v.replace(/^\./, ''));

  const opts = initOptions as Required<IOptionsInternal>;
  const globs = getGlobs({ dirs: opts.dirs, extensions: opts.extensions, recursive: opts.recursive });

  let resolvedPaths: IPathResolved[] = [];

  /**
   * Ensures the result and an array of a given type.
   * 
   * @param arr an type or array of type.
   * @returns An array of the specified type.
   */
  function normalizeArray<T>(arr: T | T[]): T[] {
    if (Array.isArray(arr) || typeof arr === 'undefined') return (arr || []) as T[];
    return [arr];
  }

  /**
   * Gets glob patterns for parsing files relative to project root directories.
   * 
   * @returns array of glob patters for parsing static files.
   */
  function getGlobs(options?: IGlobOptions) {

    options = { 
      dirs: opts.dirs, 
      extensions: opts.extensions, 
      recursive: opts.recursive, 
      ...options 
    };

    options.dirs = normalizeArray<string>(options.dirs);
    options.extensions = normalizeArray<string>(options.extensions);

    const { dirs, extensions, recursive } = options;

    let suffix = extensions.length > 1 ? `.{${extensions.join(',')}}` : `.${extensions[0]}`;
    suffix = recursive ? '**/*' + suffix : '*' + suffix;

    return dirs.map(v => (relative(process.cwd(), join(v, suffix))));

  }

  /**
   * Removes/filters duplicate strings.
   * 
   * @param arr the array of paths to dedupe.
   * @returns De-duplicated array of paths.
   */
  function dedupe(arr: string[]) {
    return arr.filter((v, i) => arr.indexOf(v) === i);
  }

  /**
   * Resolves globs mapping to resolved object map.
   * 
   * @param exp the glob expressions to be resolved.  
   * @param options glob parsing options.
   * @returns Resolved path containing map of path, ext and slug.
   */
  function resolvePaths(exp: string | string[], options?: fglob.Options): IPathResolved[] {

    options = {
      onlyFiles: true,
      ...options
    };

    const paths = fglob.sync(exp, options);

    // Remove any dupes map to resolved map of properties.
    return dedupe(paths).map(path => {

      const ext = extname(path);
      let slugPath = path.replace(ext, ''); // remove ext.

      opts.dirs.forEach(d => (slugPath = relative(d, slugPath))); // remove root dirs.

      const slug = slugPath.replace(ext, '').split(sep).join('-'); // create slug

      return {
        path,
        ext,
        slug
      };

    });

  }

  /**
   * Renders markdown as html markup.
   * 
   * @param content the content to be rendered from markdown.
   * @returns html representation of markdown syntax.
   */
  function renderMarkdown(content: string | Buffer = '') {

    const md = markdown({
      highlight: (str, lang) => {
        if (!opts.highlight || !lang || !highlighter.getLanguage(lang))
          return str;
        try {
          return highlighter.highlightAuto(str).value;
        }
        catch (_) {
          return str;
        }
      }
    });

    return md.render(content.toString());

  }

  /**
   * Reads and renders metadata and content for display in component.
   * 
   * @param path the path to be rendered.
   * @param isMarkdown when true render from Markdown syntax.
   * @returns Returns metadata and static content to be rendered in component.
   */
  async function renderFile(path?: string, isMarkdown = false): Promise<IParsedResult> {

    if (!path)
      return {
        data: {},
        content: ''
      };

    const buffer = await readFile(path);

    if (!isMarkdown) {
      let content = buffer.toString();
      if (opts.highlight) {
        try {
          content = highlighter.highlightAuto(content).value;
        }
        catch (_) { }
      }
      return {
        data: {},
        content
      };
    }

    const { content, data } = gmatter(buffer.toString()) as GrayMatterResult;

    return {
      content: renderMarkdown(content),
      data: data || {}
    };

  }

  /**
   * Gets the async static helper methods for resolving static paths in a NextJS Component.
   * 
   * @returns The helper "getStaticPaths" and "getStaticProps" helper methods for NextJS Components
   */
  function getMethods(globs: string | string[]) {

    resolvedPaths = resolvePaths(globs);

    /**
     * Loads static paths and returns for use in "getStaticProps".
     * 
     * @param props get static paths properties including locales, default localse.
     * @returns Static paths array with slug param.
     */
    async function getStaticPaths<P extends ParsedUrlQuery = ParsedUrlQuery>(props: GetStaticPathsContext): Promise<GetStaticPathsResult<P>> {

      const paths = resolvedPaths.map(v => {
        return {
          params: {
            [opts.paramKey]: v.slug
          },
          locale: opts.locale || props.defaultLocale
        };
      }) as { params: P; locale?: string }[];

      return {
        paths,
        fallback: opts.fallback
      };

    };

    /**
     * Consumes static paths params, renders metadata and content returning as props to be passed to Component.
     * 
     * @param props static props including route params by slug key.
     * @returns Static props to be passed to your component.
     */
    async function getStaticProps<P extends IParsedResult = IParsedResult, Q extends ParsedUrlQuery = ParsedUrlQuery>(props: GetStaticPropsContext<Q>): Promise<GetStaticPropsResult<P>> {

      const config = resolvedPaths.find(v => v.slug === (props.params && props.params[opts.paramKey]));
      const path = config?.path || '';

      let { content, data } = await renderFile(path, config?.ext === '.md');

      return {
        props: {
          data,
          content
        } as P
      };

    };

    return {
      getStaticPaths,
      getStaticProps
    };

  }

  const { getStaticPaths, getStaticProps } = getMethods(globs);

  return {
    highlighter,
    getGlobs,
    resolvePaths,
    resolvedPaths,
    renderFile,
    getMethods,
    getStaticPaths,
    getStaticProps
  };

}

export { nsp };

