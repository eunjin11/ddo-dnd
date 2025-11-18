import nextra from 'nextra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Set up Nextra with its configuration
const withNextra = nextra({});

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '.'
);

// Export the final Next.js config with Nextra included
export default withNextra({
  // ... Add regular Next.js options here
  transpilePackages: ['ddo-dnd'],
  turbopack: {
    root: repositoryRoot,
  },
});
