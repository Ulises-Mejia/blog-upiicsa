import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://multimedia-upiicsa.ipn.mx',
  integrations: [
    starlight({
      title: 'Multimedia UPIICSA',
      pagefind: false,
      disable404Route: true,
      components: {
        Header: './src/components/Header.astro',
        Footer: './src/components/Footer.astro',
        PageFrame: './src/components/PageFrame.astro',
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
        {
          label: 'Unidad I: Contexto y Fundamentos',
          items: [
            { autogenerate: { directory: 'unidad-1' } },
          ],
        },
        {
          label: 'Unidad II: Tecnologías Emergentes',
          items: [
            { autogenerate: { directory: 'unidad-2' } },
          ],
        },
        {
          label: 'Unidad III: Integración y Autoría',
          items: [
            { autogenerate: { directory: 'unidad-3' } },
          ],
        },
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
