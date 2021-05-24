import nsp, { IRenderedProps, IResolvedProps } from '../src';
import typescript from 'highlight.js/lib/languages/typescript';

const options = {
  directories: ['__tests__/content']
};

const { getStaticPaths, getStaticProps } = nsp(options);

// New instance of next static pages so we
// can test returning props in "resolved" mode.
const { getStaticProps: getStaticPropsResolved } = nsp({ ...options, mode: 'resolved' });

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

test('getStaticProps: Render HTML', async () => {
  const expectedObj = {
    content: '<div class="myDiv">\n' +
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

test('getStaticProps: Resolved Configs', async () => {
  const expectedArr = ['markdown', 'markup', 'es-locale', 'nested-metadata'];
  const result =
    await getStaticPropsResolved({}) as { props: IResolvedProps; revalidate?: number | boolean };
  const resolved = result.props.resolved.map(v => v.slug);
  expect(resolved.sort()).toEqual(expectedArr.sort());
});

