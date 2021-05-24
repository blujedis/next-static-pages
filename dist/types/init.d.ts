/// <reference types="node" />
/// <reference types="highlight.js" />
import type { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import type { IOptions, Mode, StaticProps } from './types';
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
declare function nsp<M extends Mode>(initOptions?: IOptions<M>): {
    getStaticPaths: <P extends ParsedUrlQuery = ParsedUrlQuery>(props: GetStaticPathsContext) => Promise<GetStaticPathsResult<P>>;
    getStaticProps: <P_1 extends StaticProps<M>, Q extends ParsedUrlQuery = ParsedUrlQuery>(props: GetStaticPropsContext<Q>) => Promise<GetStaticPropsResult<P_1>>;
};
export { nsp };
