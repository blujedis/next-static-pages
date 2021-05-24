// eslint-disable-next-line
/// <reference path="../node_modules/highlight.js/types/index.d.ts" />

import fglob from 'fast-glob';
import { readFile } from 'fs/promises';
import { sep, parse, join, relative, extname } from 'path';
import { slugify, normalizeArray, dedupe, sanitizer } from './utils';
import gmatter from 'gray-matter';
import markdown from 'markdown-it';
import hljs from 'highlight.js';
import type { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import type {
  GrayMatterResult, IRenderedProps, IOptions,
  IOptionsInternal, IResolvedPath,
  Mode,
  StaticProps
} from './types';

const DEFAULTS: IOptions = {
  mode: 'render',
  directories: 'statics',
  extensions: ['md', 'html'],
  excludes: [],
  paramKey: 'slug',
  highlight: false,
  fallback: 'blocking',
  sanitize: '*',
  onSlugify: slugify,
  onBeforeRender: (content) => content
};

/**
 * Creates simple Api for use with NextJS async static methods.
 * 
 * @example
 * ```tsx
 * import { FC } from 'react';
 * import nsp, { IRenderedProps } from 'next-static-pages';
 * const {getStaticPaths, getStaticProps} = nsp();
 * 
 * const MyComponent: FC<IRenderedProps> = ({ content }) => {
 *  return <div dangerouslySetInnerHTML={{ __html: content }} />;
 * };
 * 
 * export { getStaticPaths, getStaticProps };
 * export default MyComponent;
 * ```
 * 
 * @param initOptions initialization options.
 * @returns Api for use with async static methods in NextJS
 */
function nsp<M extends Mode>(initOptions = DEFAULTS as IOptions<M>) {

  initOptions = {
    ...DEFAULTS,
    ...initOptions
  } as any;

  // ensure we have an array if extensions passed
  // ensure that each is prefixed with '.';
  initOptions.sanitize = normalizeArray(initOptions.sanitize)
    .map(v => {
      if (v === '*') return v;
      return '.' + v.replace(/^\./, '');
    });

  const { directories, paramKey, fallback, highlight: initHighlight, mode, excludes, extensions, onSlugify, onBeforeRender, sanitize } = initOptions as Required<IOptionsInternal<M>>;

  let resolvedPaths: IResolvedPath[] = [];

  /**
   * Matches a route for rendering props based on locale and slug/key.
   * 
   * NOTE: if you end up here tracking down odd behavior don't second
   * guess yourself. Not done a ton of localization with static files this
   * may need to be revisited!!
   * 
   * @param resolved the resolved path configs.
   * @param slug the current slug to match.
   * @param locale optional locale to match.
   * @param allowFallback the current fallback mode.
   * @returns The resolved path or undefined if none was found.
   */
  function matchRoute(resolved: IResolvedPath[], slug: string, locale: string | undefined, allowFallback: boolean | 'blocking' = false): IResolvedPath | undefined {

    for (const config of resolved) {

      const localeMatch = !!locale && config.locale === locale;
      const slugMatch = !!slug && config.slug === slug;

      // Matching on both locale and slug.
      if (localeMatch && slugMatch)
        return config;

      // essentially matching on slug only when fallback
      // is set to true or blocking.
      if (locale && !localeMatch && allowFallback && slugMatch)
        return config;

      // No locale, no fallback matching ONLY on slug itself.
      if (!locale && !allowFallback && slugMatch)
        return config;

      if (!locale && slugMatch)
        return config;

    }

    return undefined;

  }

  /**
   * Gets an array of path strings by way of resolving glob patterns.
   * 
   * @param patterns the glob patterns for loading paths.
   * @param options the fast-glob options to be applied.
   * @returns Array of path strings.
   */
  function getPaths(dirs?: string | string[], options?: fglob.Options) {

    options = {
      ignore: normalizeArray<string>(excludes),
      ...options,
      onlyFiles: true, // always only get files.
    };

    // Build up globs from directories accounting for 
    // wether locales are being used.
    dirs = normalizeArray<string>(directories)
    const exts = normalizeArray<string>(extensions).map(v => v.replace('.', ''));

    const globs = dirs.map(v => {
      let suffix = exts.length > 1 ? `*.{${exts.join(',')}}` : `*.${exts[0]}`;
      suffix = `**${sep}${suffix}`;
      return join(v, suffix);
    });

    return fglob(globs, options);

  }

  /**
   * Resolves globs mapping to resolved object map.
   * 
   * @param dirs the directories expressions to be resolved.  
   * @param locales an array of enabled internationalization locales.
   * @param options glob parsing options.
   * @returns Resolved path containing map of path, ext and slug.
   */
  async function resolvePaths(dirs: string | string[] = directories, locales: string[] = [], defaultLocale?: string, options?: fglob.Options): Promise<IResolvedPath[]> {

    dirs = normalizeArray<string>(dirs);
    const paths = await getPaths(dirs, options);

    // Remove any dupes just in case then map.
    return dedupe(paths).map(path => {

      const { dir, name, ext } = parse(path);

      const root = (dirs as string[]).find(d => dir.includes(d)) as string;
      const relDir = relative(root, dir);
      const segments = relDir.length ? relDir.split(sep) : [];
      const locale = locales.find(v => v === segments[0]); // locale must be first after root dir.
      let slugSegments = locale ? segments.slice(1) : segments;
      slugSegments = [...slugSegments, name].filter(v => !!v);
      const slug = onSlugify(slugSegments, { ext, root, locale });

      const result = {
        path,
        ext,
        slug
      } as IResolvedPath;

      if (locale)
        result.locale = locale;
      else if (defaultLocale)
        result.locale = defaultLocale;

      return result;

    });

  }

  /**
   * Renders markdown as html markup.
   * 
   * @param content the content to be rendered from markdown.
   * @param highlight when true apply syntax highlighting.
   * @returns html representation of markdown syntax.
   */
  function renderMarkdown(content: string | Buffer = '', highlight = initHighlight) {

    const config = !highlight ? {} : {
      highlight: (str: string, lang: string) => {
        if (!highlight || !lang || !hljs.getLanguage(lang))
          return str;
        return hljs.highlightAuto(str).value;
      }
    };

    const md = markdown(config);

    return md.render(content.toString());

  }

  /**
   * Reads and renders metadata and content for display in component.
   * 
   * @param path the path to be rendered.
   * @param highlight when true apply syntax highlighting.
   * @returns Returns metadata and static content to be rendered in component.
   */
  async function renderFile(path?: string, highlight = initHighlight): Promise<IRenderedProps> {

    if (!path)
      return {
        data: {},
        content: ''
      };

    const isMarkdown = /\.md$/.test(path);
    const buffer = await readFile(path);
    const ext = extname(path);
    let content = buffer.toString();
    let data = {};
    let err = '';

    try {

      if (isMarkdown) {
        const result = gmatter(content) as GrayMatterResult;
        data = result.data;

        if (sanitize.includes('*') || sanitize.includes(ext))
          content = sanitizer(result.content);

        content = renderMarkdown(result.content, highlight);

      }

      else if (highlight) {

        if (sanitize.includes('*') || sanitize.includes(ext))
          content = sanitizer(content);

        content = hljs.highlightAuto(content).value;

      }

      content = onBeforeRender(content);

    }
    // eslint-disable-next-line
    catch (ex) {
      err = ex;
      console.log(ex.stack);
    }

    return {
      content,
      data,
      err
    };

  }

  /**
   * Loads static paths and returns for use in "getStaticProps".
   * 
   * @param props get static paths properties including locales, default localse.
   * @returns Static paths array with slug param.
   */
  async function getStaticPaths<P extends ParsedUrlQuery = ParsedUrlQuery>(props: GetStaticPathsContext): Promise<GetStaticPathsResult<P>> {

    // Get the enabled locales if any.
    const locales = props.locales || [];
    const defaultLocale = props.defaultLocale;

    // Resolve paths 
    resolvedPaths = await resolvePaths(directories, locales, defaultLocale);

    const paths = resolvedPaths.map(v => {
      return {
        params: {
          [paramKey]: v.slug
        }
      };
    }) as { params: P; locale?: string }[];

    return {
      paths,
      fallback: fallback
    };

  }

  /**
   * Consumes static paths params, renders metadata and content returning as props to be passed to Component.
   * 
   * @param props static props including route params by slug key.
   * @returns Static props to be passed to your component.
   */
  async function getStaticProps<P extends StaticProps<M>, Q extends ParsedUrlQuery = ParsedUrlQuery>(props: GetStaticPropsContext<Q>): Promise<GetStaticPropsResult<P>> {

    const { locale, locales, defaultLocale } = props;

    if (!resolvedPaths.length)
      resolvedPaths = await resolvePaths(directories, locales, defaultLocale);

    if (mode === 'resolved')
      return {
        props: {
          resolved: resolvedPaths
        } as P
      };

    const slug = (props.params ? props.params[paramKey] : '') as string;
    const config = matchRoute(resolvedPaths, slug, locale, fallback);
    const path = config?.path || '';
    const rendered = await renderFile(path);

    return {
      props: {
        ...rendered
      } as P
    };

  }

  return {
    getStaticPaths,
    getStaticProps
  };

}

export { nsp };

