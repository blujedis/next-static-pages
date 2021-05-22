import { GrayMatterFile } from 'gray-matter';
import { FC } from 'react';

export interface IComponentProps<T = Record<string, any>> {
  data: T;
  content: string;
}

export type NSPComponent<P extends IComponentProps = IComponentProps> = FC<P>;

export interface IOptions {
  paramKey: string;
  dirs: string | string[];
  extensions: string | string[];
  recursive: boolean;
  highlight: boolean;
}

export interface IOptionsInternal extends IOptions {
  dirs: string[];
  extensions: string[];
}

export interface IPathResolved {
  path: string;
  ext: string;
  slug: string;
}

export interface IParsedResult<T = Record<string, any>> {
  data: T;
  content: string;
}

export type GrayMatterResult<T = Record<string, any>> = Omit<GrayMatterFile<string>, 'data'> & { data: T };

export interface IStaticProps {
  params: { [P in IOptions['paramKey']]: string; }
}