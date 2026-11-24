import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { UNITS } from './src/config/units';

const BASE_PATH = '/blog-upiicsa';

export default defineConfig({
  site: 'https://ulises-mejia.github.io',
  base: BASE_PATH,
  vite: {
    build: {
      chunkSizeWarningLimit: 650,
    },
  },
  integrations: [
    starlight({
      title: 'Multimedia UPIICSA',
      pagefind: false,
      disable404Route: true,
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'base-url',
            content: BASE_PATH,
          },
        },
      ],
      components: {
        Header: './src/components/Header.astro',
        Footer: './src/components/Footer.astro',
        PageFrame: './src/components/PageFrame.astro',
        PageSidebar: './src/components/PageSidebar.astro',
      },
      defaultLocale: 'es',
      locales: {
        es: {
          label: 'Español',
          lang: 'es',
        },
      },
      customCss: [
        './src/styles/custom.css',
      ],
      sidebar: [
        ...UNITS.map((unit) => ({
          label: unit.sidebarLabel,
          items: [
            { autogenerate: { directory: unit.directory } },
          ],
        })),
        {
          label: 'Identidad Institucional IPN',
          slug: 'identidad-ipn',
        },
        {
          label: 'Autores y Créditos',
          slug: 'autores',
        },
      ],
    }),
  ],
});
