import type { GrayMatterFile } from 'gray-matter';
import type { FC } from 'react';
/**
 * Next Static Pages functional component.
 */
export declare type NSPComponent<P extends IRenderedProps = IRenderedProps> = FC<P>;
export declare type Mode = 'render' | 'resolved';
export interface IOptions<M extends Mode = 'render'> {
    /**
     * When creating an instance "getStaticProps" can return either rendered
     * content or it can return a props object containing "slugs" or paths you can
     * use for creating links to rendered static files.
     *
     * @default render
     */
    mode?: M;
    /**
     * The directories to load static files from..
     *
     * @default statics
     *
     */
    directories?: string | string[];
    /**
     * The allowable extension.
     *
     * @default
     * [md, html]
     */
    extensions?: string | string[];
    /**
     * Glob patterns for excluding files.
     *
     * @default []
     */
    excludes?: string | string[];
    /**
     * The param key used to identify the dynamic file to be loaded and the route param.
     *
     * @default slug
     */
    paramKey?: string;
    /**
     * When true apply syntax highlighting to the content before sending to component props.
     *
     * @default false
     */
    highlight?: boolean;
    /**
     * Indicates fallback mode for statically generated content. Read issue below.
     * If the content can be loaded quickly then you likely want "blocking" which
     * is the default. Use "true" if you need to show a loading state. Setting to
     * "false" may result in a blank rendered page when using locales.
     *
     * @see https://github.com/vercel/next.js/issues/15637
     * @default blocking
     */
    fallback?: boolean | 'blocking';
    /**
     * Define specific extensions to be sanitized or use '*' to sanitize all output.
     *
     * @example ['.html']
     * @see https://reactjs.org/docs/dom-elements.html
     * @default *
     */
    sanitize?: null | undefined | false | '*' | string | string[];
    /**
     * Optional method used to create slugs or keys used to generate links.
     *
     * @param segments array of path segments excluding root directory, locale and extension.
     * @param metadata an object containing the root directory, ext and locale if exists.
     */
    onSlugify?: (segments: string[], metadata?: {
        root: string;
        ext: string;
        locale?: string;
    }) => string;
    /**
     * Simple callback you can use for manipulating output before rendered as props.content
     *
     * @param content the parsed markdown, html and or highlighted content.
     */
    onBeforeRender?: (content: string) => string;
}
/**
 * Internal typing of options.
 *
 * @ignore
 */
export interface IOptionsInternal<M extends Mode = 'render'> extends IOptions<M> {
    directories: string[];
    extensions: string[];
    excludes: string[];
    sanitize: string[];
}
export interface IResolvedPath {
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
    /**
     * A string prefix matching the sites enabled locales.
     */
    locale?: string;
}
export interface IRenderedProps<T = Record<string, any>> {
    /**
     * Optional metadata parsed from file with file type is markdown.
     */
    data: T;
    /**
     * The parsed content string to be passed to component props for rendering.
     */
    content: string;
    /**
     * This is more or less so you know there's an issue only the error message
     * will be present, see console for full stack. When an error is present the raw
     * string is returned in content.
     */
    err?: string;
}
export interface IResolvedProps {
    /**
     * An array of found/generated slug paths.
     */
    resolved: IResolvedPath[];
}
/**
 * Type alias determining return type based on user defined Mode.
 */
export declare type StaticProps<M extends Mode> = M extends 'render' ? IRenderedProps : IResolvedProps;
/**
 * Gray matter parsed result.
 */
export declare type GrayMatterResult<T = Record<string, any>> = Omit<GrayMatterFile<string>, 'data'> & {
    data: T;
};
