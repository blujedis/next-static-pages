import fglob from 'fast-glob';
import { readFile } from 'fs/promises';
import { extname, join, relative, sep } from 'path';
import gmatter from 'gray-matter';
import markdown from 'markdown-it';
import hljs from 'highlight.js';

import { GrayMatterResult, IParsedResult, IOptions, IOptionsInternal, IPathResolved, IStaticProps } from './types';

const DEFAULTS: IOptions = {
  paramKey: 'slug',
  dirs: 'statics',
  extensions: 'md',
  recursive: true,
  highlight: false
};

export function createParser(options?: Partial<IOptions>) {

  options = {
    ...DEFAULTS,
    ...options
  };

  if (!Array.isArray(options.dirs))
    options.dirs = [options.dirs] as string[];

  if (!Array.isArray(options.extensions))
    options.extensions = [options.extensions] as string[];

  options.extensions = options.extensions.map(v => v.replace(/^\./, ''));

  const { dirs, extensions, recursive, paramKey, highlight } = options as Required<IOptionsInternal>;

  function createGlobs() {
    let suffix = extensions.length > 1 ? `.{${extensions.join(',')}}` : `.${extensions[0]}`;
    suffix = recursive ? '**/*' + suffix : '*' + suffix;
    return dirs.map(v => (relative(process.cwd(), join(v, suffix))));
  }

  function resolvePaths(exp: string | string[], options?: fglob.Options): IPathResolved[] {
    options = {
      onlyFiles: true,
      ...options
    };
    return fglob.sync(exp, options).map(path => {
      const ext = extname(path);
      let slugPath = path.replace(ext, ''); // remove ext.
      dirs.forEach(d => (slugPath = relative(d, slugPath))); // remove root dirs.
      const slug = slugPath.replace(ext, '').split(sep).join('-'); // create slug
      return {
        path,
        ext,
        slug
      };
    });
  }

  function renderMarkdown(content: string | Buffer = '') {

    const md = markdown({
      highlight: (str, lang) => {
        if (!highlight || !lang || !hljs.getLanguage(lang))
          return str;
        try {
          return hljs.highlightAuto(str).value;
        }
        catch(_) {
          return str;
        }
      }
    });

    return md.render(content.toString());

  }

  async function parseFile(path?: string, hasMatter = false): Promise<IParsedResult> {

    if (!path)
      return {
        data: {},
        content: ''
      };

    const buffer = await readFile(path);

    if (!hasMatter)
      return {
        data: {},
        content: buffer.toString()
      };

    const { content, data } = gmatter(buffer.toString()) as GrayMatterResult;

    return {
      content: renderMarkdown(content),
      data: data || {}
    };

  }

  const globs = createGlobs();
  const resolvedPaths = resolvePaths(globs);

  const getStaticPaths = async () => {

    const paths = resolvedPaths.map(v => {
      return {
        params: {
          [paramKey]: v.slug
        }
      };
    });

    return {
      paths,
      fallback: false
    };

  };

  const getStaticProps = async <T extends IStaticProps>(props: T) => {

    const slug = props.params.slug;
    const config = resolvedPaths.find(v => v.slug === slug);
    const path = config?.path || '';

    let { content, data } = await parseFile(path, config?.ext === '.md');

    return {
      props: {
        data,
        content
      }
    };

  };

  return {
    resolvedPaths,
    getStaticPaths,
    getStaticProps
  };

}

