# Next Static Pages

Modest helper module for easily rendering static files such as HTML or Markdown content in [NextJS](https://nextjs.org). **NSP** exports the required methods needed to load your static paths and props making the rendering of said content a snap in your component.

For more on generating static content please see [Static Generation](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation).

## Getting Started

From your terminal install **NSP** for use in your project.

```sh
npm install next-static-pages
```
OR
```sh
yarn add next-static-pages
```

## Create Directory

Create a directory you wish to use that will contain your static content. By default the options look for the directory **/statics** relative to the root of your project. You can specify multiple directories if you wish in **options.directories**.

Within your **/pages** directory create the directory **/pages/statics**. Create an index file within that directory.

## Rendering Static Links

In the above **/pages/statics/index.tsx** (or it may be .jsx) page copy and paste the following component. Take note of the <code>{ mode: 'resolved' }</code> options that's set. This tells NSP to return the resolved path configs which we're using to create our links with.

```tsx
import { FC } from 'react';
import nsc, { IResolvedProps } from 'next-static-pages';
import Link from 'next/link';

const { getStaticPaths, getStaticProps } = nsp({ mode: 'resolved' });

const MyComponent: FC<IResolvedProps> = ({ resolved }) => {

  // We iterate the array of configs and build Next Links for navigation.
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {resolved.map(r => {

        // Create our href or link and a prettier looking label for the anchor.
        const href = `/statics/${r.slug}`;
        const label = r.slug.split('-').map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(' ');

        return (
          <li key={r.slug}>
            <Link href={href}>
              <a>{label}</a>
            </Link>
          </li>
        );

      })}
    </ul>
  );

};

// DO NOT FORGET TO EXPORT THESE!!!
export { getStaticPaths, getStaticProps };
export default MyComponent;
```

## Rendering Static Content

Now that we have a directory and index with your links to our static files/pages we need a way to consume the rendered content. 

Create a file in **/pages/statics** called **[slug].tsx**. This will be a dynamic page that we'll match up our above created links with.

For example if we have a file that was named **05-25-2021.md** and it's physical path is **/statics/05-25-2021.md** then our above component would create the route **/statics/05-25-2021.md** which would be picked up by our dynamic component that we're defining here as **[slug].tsx**.

if you want to use **[id].tsx** instead of slug (or some other param name) just be sure to update the param key option <code>{ paramKey: 'id' }</code>. Initializing **NSP** would then look like:

```ts
const { getStaticPaths, getStaticProps } = nsp({ paramKey: 'id' });
```

If this doesn't quite make sense head over to [NextJS Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes) documentation.

```tsx
import { FC } from 'react';
import nsc, { IRenderedProps } from 'next-static-pages';

const { getStaticPaths, getStaticProps } = nsp(); 

// data: any gray matter metadata you passed if any in your markdown file.
// content: the string to be injected as shown below.

const MyComponent: FC<IRenderedProps> = ({ data, content }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export { getStaticPaths, getStaticProps };
export default MyComponent;
```

## Syntax Highlighting (using highlight.js)

**NSP** supports syntax highlighting which often is required when serving static markdown files as they can contain code syntax. Similar to this very README file.

In order to use syntax highlighting you must register the languages that should be applied to detected <code>`<code>`</code> elements. 

You will likely also want to import your desired styles/theme! See below.

See more on [highlight.js](https://highlightjs.org/usage/)

> NOTE: for convenience we've included highlight.js in the library however in the future may be removed requiring your highlighter to be passed in as an option.

```tsx
import nsc from 'next-static-pages';  // import our module.
import typescript from 'highlight.js/lib/languages/typescript'; // lang to register.
import 'highlight.js/styles/an-old-hope.css'; // css styles for highlighting.

const { getStaticPaths, getStaticProps, highlighter } = nsc(); 
highlighter.registerLanguage('typescript', typescript);
```

## Using Locales

**NSP** supports locale sub directories for displaying localized pages/files. When defining your directories in your options simply define a sub folder with your locale prefixes. See below where the root folder is **content** and the Spanish locale, denoted by **es** is nested below it.

<p>
  <img src="https://github.com/blujedis/next-static-pages/blob/main/fixtures/localization-directory-example.png" />
</p>

To use locales you should head over to the [NextJS Localization](https://nextjs.org/docs/advanced-features/i18n-routing) documentation but the basic setup would be defined something similar to the below example in your **next.config.js**

```js
module.exports = (phase, { defaultConfig }) => {
  // ensures webpack 5
  defaultConfig.future.webpack5 = true; 
  return {
    // spread the default config.
    ...defaultConfig, 
    webpack: (config, { isServer }) => {
      // modify webpack here then return the config.
      return config;
    },
    // Define localization.
    i18n: {
      locales: ['en-US', 'es'],
      defaultLocale: 'en-US'
    }
  };
}
```

## Options 

For a list of options, their defaults and their function head over to the [Api Docs Options]() for more information.

## Issues Importing Node Modules

If you notice an error similar to the below, not to worry. This is related to a code splitting issue. This error is raised because **NextJS** is trying to import a NodeJS module in the browser context which is not possible. When you export these two static methods either in your Functional Component or Component Next will then correction import **fs/promises** for example in the server context.

<p>
  <img src="https://github.com/blujedis/next-static-pages/blob/main/fixtures/code-splitting-error.png" />
</p>

**Easy Fix**

Simply add the static exports and Next will no longer complain!

```tsx
export { getStaticPaths, getStaticProps };
```

## Api Docs

See [https://blujedis.github.io/next-static-pages/](https://blujedis.github.io/next-static-pages/)

## Change

See [CHANGE.md](CHANGE.md)

## License

See [LICENSE.md](LICENSE)

