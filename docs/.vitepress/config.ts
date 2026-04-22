import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const base = '/dmn-parser/';

export default defineConfig({
  base,
  vite: {
    define: {
      'process.env': '{}',
      'process.versions': '{}',
      'process.platform': '"browser"',
    },
    resolve: {
      alias: {
        '@veridtools/dmn-parser': path.resolve(__dirname, '../../src/index.ts'),
      },
    },
  },
  title: 'Verid',
  titleTemplate: ':title | dmn-parser',
  description: 'DMN XML parser — typed, normalized, DMN 1.1 to 1.5',
  head: [['link', { rel: 'icon', type: 'image/webp', href: `${base}verid-logo.webp` }]],
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: '/verid-logo.webp',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Concepts', link: '/concepts/dmn-versions' },
      { text: 'API', link: '/api/parse' },
      { text: 'Playground', link: '/playground' },
      { text: 'Changelog', link: '/changelog' },
      { text: `v${version}`, link: '/changelog' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'CLI', link: '/guide/cli' },
            { text: 'Programmatic API', link: '/guide/api' },
          ],
        },
      ],
      '/concepts/': [
        {
          text: 'Concepts',
          items: [
            { text: 'DMN versions', link: '/concepts/dmn-versions' },
            { text: 'Normalization', link: '/concepts/normalization' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API reference',
          items: [
            { text: 'parse()', link: '/api/parse' },
            { text: 'Types', link: '/api/types' },
          ],
        },
      ],
      '/playground': [
        {
          text: 'Playground',
          items: [{ text: 'Try it live', link: '/playground' }],
        },
        {
          text: 'Quick links',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'CLI reference', link: '/guide/cli' },
            { text: 'API reference', link: '/api/parse' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/veridtools/dmn-parser' }],
    search: { provider: 'local' },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Verid',
    },
  },
});
