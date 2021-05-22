import nsc from '../src';
const { getGlobs, resolvedPaths } = nsc({ dirs: '__tests__' });

  

test('Globs', () => {
  // const expectedArr = ['*.md'].sort();
 // expect(resolvedPaths.sort()).toEqual(expectedArr);
});

// test('Resolved Paths', () => {
//   const expectedArr = ['__tests__/test.html', '__tests__/test.matter.md', 'test.md'].sort();
//  // expect(resolvedPaths.sort()).toEqual(expectedArr);
// });

