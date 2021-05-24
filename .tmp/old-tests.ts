import nsp, { IRenderedProps, IResolvedProps } from '../src';
import typescript from 'highlight.js/lib/languages/typescript';

const options = {
  directories: ['__tests__/content']
};

const { getPaths, resolvePaths, renderFile, highlighter, getStaticPaths, getStaticProps } = nsp(options);

// New instance of next static pages so we
// can test returning props in "resolved" mode.
const { getStaticProps: getStaticPropsResolved } = nsp({ ...options, mode: 'resolved' });

highlighter.registerLanguage('typescript', typescript);

test('Glob Patterns', async () => {
  const expectedArr = [
    '__tests__/content/es/locale.md',
    '__tests__/content/nested/metadata.md',
    '__tests__/content/markup.html',
    '__tests__/content/markdown.md'
  ].sort();
  const paths = await getPaths();
  expect(paths.sort()).toEqual(expectedArr);
});

test('Resolved Paths', async () => {
  const expectedArr = [
    {
      path: '__tests__/content/markdown.md',
      ext: '.md',
      slug: 'markdown'
    },
    {
      path: '__tests__/content/markup.html',
      ext: '.html',
      slug: 'markup'
    },
    {
      path: '__tests__/content/es/locale.md',
      ext: '.md',
      slug: 'locale',
      locale: 'es'
    },
    {
      path: '__tests__/content/nested/metadata.md',
      ext: '.md',
      slug: 'nested-metadata'
    }
  ].sort();
  const resolved = await resolvePaths(undefined, ['es']);
  expect(resolved.sort()).toEqual(expectedArr);
});

test('Render Html', async () => {
  const filePath = '__tests__/content/markup.html';
  const expectedObj = {
    content: '<div>\n' +
      '  <h2>This is a heading in a div element</h2>\n' +
      '  <p>This is some text in a div element.</p>\n' +
      '</div>',
    data: {},
    err: ''
  };
  const rendered = await renderFile(filePath);
  expect(rendered).toEqual(expectedObj);
});

test('Render Markdown', async () => {
  const filePath = '__tests__/content/nested/metadata.md';
  const expectedObj = {
    content: '<h1>Header</h1>\n' +
      '<p>Paragraphs are separated by a blank line.</p>\n' +
      '<p>2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists\n' +
      'look like:</p>\n' +
      '<ul>\n' +
      '<li>this one</li>\n' +
      '<li>that one</li>\n' +
      '<li>the other one</li>\n' +
      '</ul>\n' +
      '<p>Note that --- not considering the asterisk --- the actual text\n' +
      'content starts at 4-columns in.</p>\n' +
      '<blockquote>\n' +
      '<p>Block quotes are\n' +
      'written like so.</p>\n' +
      '<p>They can span multiple paragraphs,\n' +
      'if you like.</p>\n' +
      '</blockquote>\n' +
      "<p>Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., &quot;it's all\n" +
      'in chapters 12--14&quot;). Three dots ... will be converted to an ellipsis.\n' +
      'Unicode is supported.</p>\n',
    data: {
      title: 'Example Markdown',
      description: 'Sample gray matter for testing parsing of metadata.'
    },
    err: ''
  };
  const rendered = await renderFile(filePath, true);
  expect(rendered).toEqual(expectedObj);
});

test('Render Highlighted', async () => {
  const filePath = '__tests__/content/markdown.md';
  const expectedObj = {
    content: '<h1>Header</h1>\n' +
      '<p>Paragraphs are separated by a blank line.</p>\n' +
      '<p>2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists\n' +
      'look like:</p>\n' +
      '<ul>\n' +
      '<li>this one</li>\n' +
      '<li>that one</li>\n' +
      '<li>the other one</li>\n' +
      '</ul>\n' +
      '<p>Note that --- not considering the asterisk --- the actual text\n' +
      'content starts at 4-columns in.</p>\n' +
      '<blockquote>\n' +
      '<p>Block quotes are\n' +
      'written like so.</p>\n' +
      '<p>They can span multiple paragraphs,\n' +
      'if you like.</p>\n' +
      '</blockquote>\n' +
      "<p>Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., &quot;it's all\n" +
      'in chapters 12--14&quot;). Three dots ... will be converted to an ellipsis.\n' +
      'Unicode is supported.</p>\n' +
      '<pre><code><span>import</span> nsc <span>from</span> <span>&#x27;next-static-pages&#x27;</span>;\n' +
      '<span>const</span> { getStaticPaths, getStaticProps } = nsc(); <span>// using all defaults.</span>\n' +
      '\n' +
      '<span>const</span> MyComponent = <span>(<span>{ content }</span>) =&gt;</span> {\n' +
      '  <span>return</span> (\n' +
      '    &lt;div&gt;\n' +
      '      {content}\n' +
      '    &lt;/div&gt;\n' +
      '  );\n' +
      '};\n' +
      '\n' +
      '<span>export</span> { getStaticPaths, getStaticProps };\n' +
      '<span>export</span> <span>default</span> MyComponent;\n' +
      '</code></pre>\n',
    data: {},
    err: ''
  };
  const rendered = await renderFile(filePath, true);
  expect(rendered).toEqual(expectedObj);
});

test('getStaticPaths', async () => {
  const expectedArr = [
    { params: { slug: 'markdown' } },
    { params: { slug: 'markup' } },
    { params: { slug: 'locale' } },
    { params: { slug: 'nested-metadata' } }
  ].sort();
  const result = await getStaticPaths({ locales: ['es'] });
  expect(result.paths.sort()).toEqual(expectedArr);
});

test('getStaticProps render', async () => {
  const expectedObj = {
    content: '<div>\n' +
      '  <h2>This is a heading in a div element</h2>\n' +
      '  <p>This is some text in a div element.</p>\n' +
      '</div>',
    data: {},
    err: ''
  };
  const params = {
    slug: 'markup'
  };
  const result =
    await getStaticProps({ params }) as { props: IRenderedProps; revalidate?: number | boolean }
  expect(result.props).toEqual(expectedObj);
});

test('getStaticProps resolved', async () => {
  const expectedObj = {
    resolved: [
      {
        path: '__tests__/content/markdown.md',
        ext: '.md',
        slug: 'markdown'
      },
      {
        path: '__tests__/content/markup.html',
        ext: '.html',
        slug: 'markup'
      },
      {
        path: '__tests__/content/es/locale.md',
        ext: '.md',
        slug: 'es-locale'
      },
      {
        path: '__tests__/content/nested/metadata.md',
        ext: '.md',
        slug: 'nested-metadata'
      }
    ]
  };
  const result =
    await getStaticPropsResolved({}) as { props: IResolvedProps; revalidate?: number | boolean };
  expect(result.props).toEqual(expectedObj);
});

