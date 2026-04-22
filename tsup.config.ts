import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    treeshake: true,
    clean: true,
    sourcemap: true,
    external: ['fast-xml-parser'],
  },
  {
    entry: { 'bin/dmn-parser': 'bin/dmn-parser.ts' },
    format: ['esm'],
    dts: false,
    splitting: false,
    clean: false,
    sourcemap: false,
    banner: { js: '#!/usr/bin/env node' },
    noExternal: ['fast-xml-parser'],
  },
]);
