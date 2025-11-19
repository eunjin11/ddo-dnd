import nextra from 'nextra';
//import path from 'node:path';
//import { fileURLToPath } from 'node:url';

const withNextra = nextra({});

// apps/docs 디렉토리를 루트로 명시
// const repositoryRoot = path.resolve(
//   path.dirname(fileURLToPath(import.meta.url)),
//   '.'
// );

export default withNextra({
  transpilePackages: ['ddo-dnd'],
  // turbopack: {
  //   root: repositoryRoot,
  // },
});
