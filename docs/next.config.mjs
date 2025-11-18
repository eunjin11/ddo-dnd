import nextra from 'nextra';
import { fileURLToPath } from 'url';
import path from 'path';

// Set up Nextra with its configuration
const withNextra = nextra({
  // ... Add Nextra-specific options here
});

// Export the final Next.js config with Nextra included
export default withNextra({
  // ... Add regular Next.js options here
  turbopack: {
    // __dirname polyfill for ESM
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
});
