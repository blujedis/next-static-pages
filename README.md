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

## Usage

By default you only need a directory called **statics** in the root of your project. NSP will resolve any files with the <code>.md</code> extension. Essentially markdown files. When a markdown file is detected NSP will also parse it for gray matter at the top of the file and return said data as props.data for your component. 

```tsx
import nsc from 'next-static-pages';
const { getStaticPaths, getStaticProps } = nsc(); // using all defaults.

const MyComponent = ({ content }) => {
  return (
    <div>
      {content}
    </div>
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

## Docs

See [https://blujedis.github.io/next-static-paeges/](https://blujedis.github.io/next-static-paeges/)

## Change

See [CHANGE.md](CHANGE.md)

## License

See [LICENSE.md](LICENSE)

