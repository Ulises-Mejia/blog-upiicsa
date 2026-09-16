# 🏛️ Repositorio Digital de Multimedia — UPIICSA (IPN)

Plataforma web académica para la asignatura de **Herramientas Multimedia** en la **Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas (UPIICSA - IPN)**.

Construida con **[Astro](https://astro.build/)** y **[Starlight](https://starlight.astro.build/)**, este proyecto ofrece una arquitectura modular, ultra rápida, responsiva y diseñada para que estudiantes y docentes puedan redactar y mantener contenidos académicos en **Markdown puro** a lo largo de todo el semestre escolar.

---

## 📋 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Comandos de Ejecución](#-comandos-de-ejecución)
4. [Guía de Modificación y Personalización del Proyecto](#-guía-de-modificación-y-personalización-del-proyecto)
   - [1. Identidad, Textos Globales y Logos](#1-identidad-textos-globales-y-logos)
   - [2. Paleta de Colores y Estilos Visuales](#2-paleta-de-colores-y-estilos-visuales)
   - [3. Barra Lateral, Menús y Nuevas Unidades](#3-barra-lateral-menús-y-nuevas-unidades)
   - [4. Componentes Institucionales de Cabecera y Pie](#4-componentes-institucionales-de-cabecera-y-pie)
   - [5. Autores y Perfiles Estudiantiles](#5-autores-y-perfiles-estudiantiles)
   - [6. Identidad Institucional IPN](#6-identidad-institucional-ipn)
5. [Guía Rápida de Markdown para Redacción de Temas](#-guía-rápida-de-markdown-para-redacción-de-temas)
   - [Sintaxis Básica](#sintaxis-básica)
   - [Bloques de Aviso (Callouts de Starlight)](#bloques-de-aviso-callouts-de-starlight)
   - [Pestañas Interactivas (Tabs)](#pestañas-interactivas-tabs)
   - [Tablas Comparativas](#tablas-comparativas)
   - [Inserción de Recursos Multimedia (Imágenes, Audio y Video)](#inserción-de-recursos-multimedia)
6. [Flujo de Trabajo para Añadir Nuevos Temas](#-flujo-de-trabajo-para-añadir-nuevos-temas)
7. [Despliegue Automático en GitHub Pages](#-despliegue-automático-en-github-pages)

---

## 🚀 Características Principales

* **Fuente Única de Verdad en Español con Traducción Dinámica:** Redacción centralizada en `src/content/docs/es/`. Cuenta con conmutador en la cabecera (`🌐 English` / `🌐 Español`) asistido por Google Translate en tiempo real sin duplicar archivos `.md`.
* **Identidad Institucional IPN / UPIICSA:** Paleta cromática oficial con Verde UPIICSA (`#00643A`), Dorado Institucional (`#D4AF37`) y modo oscuro Verde Obsidiana (`#0B1410`).
* **Cortina de Bienvenida Inteligente:** Splash Screen institucional con animación fluida y memoria de sesión (`sessionStorage`) para no interrumpir la navegación repetida.
* **Barra Lateral Colapsable:** Menú tipo sandwich accesible y responsivo tanto en dispositivos móviles como en pantallas de escritorio.
* **Componentes Multimedia Estándar:** Soporte inmediato para videos de YouTube (16:9 responsivo), videos locales HTML5 (MP4/WebM), pistas de audio (MP3/WAV) y galerías de imágenes.
* **Despliegue Continuo Automatizado:** Flujo listo para GitHub Pages mediante GitHub Actions.

---

## 📁 Estructura del Proyecto

```
/blog_upiicsa
├── .github/
│   └── workflows/
│       └── deploy.yml             # Automatización CI/CD para GitHub Pages
├── .gitignore                     # Exclusión de dependencias y temporales
├── astro.config.mjs               # Configuración central de Astro y Starlight
├── package.json                   # Dependencias y scripts de NPM
├── package-lock.json              # Registro de versiones exactas
├── tsconfig.json                  # Configuración de TypeScript
├── README.md                      # Documentación maestra y manual del proyecto
│
├── public/                        # Archivos estáticos servidos directamente en la raíz web
│   ├── ipn_logo.svg               # Escudo oficial vectorial del IPN
│   ├── upiicsa_logo.svg           # Escudo oficial vectorial de la UPIICSA
│   ├── audios/                    # Carpeta para archivos de sonido (.mp3, .wav)
│   ├── images/                    # Carpeta para fotografías e ilustraciones (.png, .jpg, .svg)
│   └── videos/                    # Carpeta para archivos de video (.mp4, .webm)
│
└── src/
    ├── components/                # Componentes institucionales desarrollados en Astro
    │   ├── Header.astro           # Barra superior: menú sandwich, logo, modo oscuro y traducción
    │   ├── Footer.astro           # Paginación y metadatos de fin de tema
    │   ├── PageFrame.astro        # Contenedor maestro y pie de página institucional fijo
    │   └── WelcomeCurtain.astro   # Cortina de bienvenida institucional con memoria de sesión
    ├── config/
    │   └── site.ts                # Configuración central de marcas, títulos y textos
    ├── content.config.ts          # Definición de colecciones Starlight (docs e i18n)
    ├── content/
    │   ├── docs/
    │   │   ├── 404.md             # Página institucional de error 404
    │   │   └── es/                # Contenido académico temático en Español (Markdown)
    │   │       ├── plantilla-tema.md # Plantilla base lista para clonar y crear temas
    │   │       ├── autores.md     # Ficha y tarjetas de créditos del equipo
    │   │       ├── identidad-ipn.md # Himno oficial con reproductor, decálogo y símbolos
    │   │       ├── index.md       # Página principal de inicio y bienvenida
    │   │       ├── unidad-1/      # Temas oficiales de la Unidad I
    │   │       ├── unidad-2/      # Temas oficiales de la Unidad II
    │   │       └── unidad-3/      # Temas oficiales de la Unidad III
    │   └── i18n/
    │       └── es.json            # Sobrescritura de etiquetas de interfaz en español
    ├── pages/
    │   └── index.astro            # Redirección estática de raíz (/) hacia (/es/)
    └── styles/
        └── custom.css             # Estilos globales, variables CSS y temas claro/oscuro
```

---

## 🛠️ Comandos de Ejecución

Ejecuta todos los comandos desde la raíz del proyecto:

```bash
# 1. Instalar dependencias del proyecto (la primera vez o tras clonar)
npm install

# 2. Iniciar el servidor local de desarrollo con recarga en vivo (HMR)
npm run dev

# 3. Compilar el proyecto para producción (genera la carpeta estática /dist)
npm run build

# 4. Previsualizar localmente el sitio compilado en producción
npm run preview

# 5. Limpiar caché de compilación (.astro y dist) si algún cambio no se refleja
npm run clean
```

El servidor local se abrirá típicamente en: `http://localhost:4321`

---

## ⚙️ Guía de Modificación y Personalización del Proyecto

### 1. Identidad, Textos Globales y Logos
Archivo: `src/config/site.ts`

Este archivo es la **fuente de verdad** para los títulos y logos de la cabecera y el telón de bienvenida:
```typescript
export const siteBrand = {
  logoUrl: '/upiicsa_logo.svg', // Archivo en /public/
  logoAlt: 'Escudo Oficial UPIICSA - IPN',
  title: 'MULTIMEDIA',
  badge: 'UPIICSA',
  institution: 'INSTITUTO POLITÉCNICO NACIONAL',
  campus: 'UPIICSA',
  subtitle: {
    es: 'REPOSITORIO DIGITAL DE CONOCIMIENTOS',
    en: 'DIGITAL KNOWLEDGE REPOSITORY',
  },
  welcomeDescription: {
    es: 'Repositorio Digital de Conocimientos y Recursos Multimedia...',
    en: 'Digital Knowledge and Multimedia Resources Repository...',
  },
  welcomeButton: {
    es: 'Ingresar al Repositorio',
    en: 'Enter Repository',
  },
};
```
* **Cambiar de logo:** Coloca tu nuevo archivo SVG o PNG dentro de la carpeta `public/` y actualiza `logoUrl: '/nuevo_logo.svg'`.

---

### 2. Paleta de Colores y Estilos Visuales
Archivo: `src/styles/custom.css`

Los colores del tema están definidos mediante variables CSS al inicio del archivo:
* `--sl-color-accent`: Verde principal UPIICSA (`#00643A`).
* `--sl-color-accent-high`: Dorado institucional (`#D4AF37`).
* `--sl-color-black`: Fondo del modo oscuro verde obsidiana (`#0B1410`).
* Para ajustar los tonos de la cabecera o el pie de página institucional, busca las reglas `header.header` y `.shell-footer`.

---

### 3. Barra Lateral, Menús y Nuevas Unidades
Archivo: `astro.config.mjs`

La barra de navegación lateral se configura dentro del bloque `sidebar`:
```javascript
sidebar: [
  {
    label: 'Unidad I: Contexto y Fundamentos',
    items: [
      { autogenerate: { directory: 'unidad-1' } }, // Lee automáticamente src/content/docs/es/unidad-1/
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
]
```
* **Añadir una nueva Unidad temática:** Crea una carpeta dentro de `src/content/docs/es/unidad-4/` y agrega un nuevo objeto en `sidebar` con `{ autogenerate: { directory: 'unidad-4' } }`.
* **Modificar el título o URL del sitio:** Edita la propiedad `site` o `title` al inicio de `astro.config.mjs`.

---

### 4. Componentes Institucionales de Cabecera y Pie
Ubicación: `src/components/`

* **`Header.astro`:** Controla la barra superior fija, el botón de menú hamburguesa (☰), el logo institucional, el botón de inicio, el conmutador de modo oscuro/claro y el botón de traducción de idioma con Google Translate.
* **`PageFrame.astro`:** Envuelve cada página del sitio. Incorpora la barra inferior fija (`.shell-footer`) que muestra el copyright institucional y los accesos rápidos a *Identidad IPN* y *Autores*.
* **`WelcomeCurtain.astro`:** Genera la cortina de bienvenida que aparece al entrar a la portada por primera vez en la sesión de navegación.
* **`Footer.astro`:** Renderiza los enlaces de paginación anterior/siguiente al pie de cada artículo académico.

---

### 5. Autores y Perfiles Estudiantiles
Archivo: `src/content/docs/es/autores.md`

Para actualizar las fotografías y datos de los desarrolladores o colaboradores:
1. Guarda la fotografía en `public/images/autor_tunombre.jpg`.
2. Abre `autores.md` y edita la tarjeta correspondiente (`<article class="author-card">`), actualizando nombre, rol, correo institucional, carrera y experiencia.
3. Si la foto no existe, la tarjeta muestra automáticamente un avatar de respaldo.

---

### 6. Identidad Institucional IPN
Archivo: `src/content/docs/es/identidad-ipn.md`

Contiene el Himno del IPN, el Decálogo, la Porra y los Símbolos.
* **Audio del Himno:** Coloca la grabación oficial en `public/audios/himno_ipn.mp3` para que el reproductor web integrado funcione de inmediato.

---

## 📝 Guía Rápida de Markdown para Redacción de Temas

Cualquier estudiante o profesor puede redactar contenido académico en Markdown sin conocimientos de programación. Todos los temas se encuentran en `src/content/docs/es/`.

### Encabezado Obligatorio (Frontmatter)
Todo archivo `.md` debe iniciar con este bloque en las primeras líneas:
```markdown
---
title: "Título del Tema"
description: "Breve descripción académica para motores de búsqueda y metadatos."
---
```

---

### Sintaxis Básica
```markdown
## Título de Sección Principal (H2)
### Subtítulo de Subtema (H3)
#### Subtítulo de Detalle (H4)

Texto en **negrita**, en *cursiva*, o en ***negrita cursiva***.

* Elemento de lista desordenada
* Otro elemento
  * Subelemento anidado

1. Primer paso
2. Segundo paso
3. Tercer paso

> Esto es una cita textual o pensamiento destacado.
```

---

### Bloques de Aviso (Callouts de Starlight)
Starlight incluye bloques visuales destacados con iconos y colores institucionales:

```markdown
:::note[Nota Informativa]
Información contextual, teoría complementaria o recordatorios conceptuales.
:::

:::tip[Consejo Práctico / Buena Práctica]
Recomendaciones de diseño, atajos técnicos o sugerencias de optimización.
:::

:::caution[Advertencia]
Incompatibilidades entre navegadores, tecnologías obsoletas o consideraciones críticas.
:::

:::danger[Peligro / Error Crítico]
Acciones que pueden provocar pérdida de información o fallos en ejecución.
:::
```

---

### Pestañas Interactivas (Tabs)
Para alternar entre comparaciones, lenguajes o metodologías:

```markdown
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs>
  <TabItem label="Método Vectorial">
    Los gráficos vectoriales se definen mediante fórmulas matemáticas (SVG).
  </TabItem>
  <TabItem label="Mapa de Bits">
    Las imágenes rasterizadas se componen de matrices de píxeles (PNG, JPEG, WebP).
  </TabItem>
</Tabs>
```

---

### Tablas Comparativas
```markdown
| Característica | Formato MP4 | Formato WebM |
| :--- | :--- | :--- |
| **Códec Principal** | H.264 / AVC | VP9 / AV1 |
| **Compatibilidad** | Universal (100% de dispositivos) | Excelente en navegadores modernos |
| **Licencia** | Comercial sujeta a patentes | Código abierto y libre de regalías |
```

---

### Inserción de Recursos Multimedia

#### 1. Imágenes con Pie de Foto y Centrado Institucional
Guarda la imagen en `public/images/mi-grafico.png`:

```html
<div class="media-container">
  <img src="/images/mi-grafico.png" alt="Esquema del proceso multimedia" />
  <div class="media-caption">📷 Figura 1: Esquema de fases en la producción multimedia.</div>
</div>
```
*(También puedes usar la sintaxis estándar de Markdown: `![Descripción](/images/mi-grafico.png)`).*

#### 2. Video de YouTube Adaptable (16:9)
Para que el reproductor de YouTube se adapte automáticamente a pantallas móviles y de escritorio:

```html
<div class="video-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/CODIGO_DEL_VIDEO" 
    title="Video explicativo" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
```

#### 3. Video Local HTML5 (MP4 / WebM)
Guarda el archivo de video en `public/videos/clip-demostrativo.mp4`:

```html
<video controls style="width: 100%; border-radius: 8px; margin: 1rem 0;">
  <source src="/videos/clip-demostrativo.mp4" type="video/mp4" />
  Tu navegador no soporta video HTML5.
</video>
```

#### 4. Audio Local HTML5 (MP3 / WAV / OGG)
Guarda el archivo de audio en `public/audios/pista-sonora.mp3`:

```html
<audio controls style="width: 100%; margin: 1rem 0;">
  <source src="/audios/pista-sonora.mp3" type="audio/mpeg" />
  Tu navegador no soporta audio HTML5.
</audio>
```

---

## 🔄 Flujo de Trabajo para Añadir Nuevos Temas

Cuando te corresponda redactar o actualizar un tema de la materia:

1. **Duplica la plantilla oficial:** Haz una copia del archivo:
   `src/content/docs/es/plantilla-tema.md`
2. **Nómbralo según la nomenclatura oficial:** Por ejemplo:
   `src/content/docs/es/unidad-1/1-2-5-nuevo-subtema.md`
3. **Actualiza el frontmatter:**
   ```markdown
   ---
   title: "1.2.5 Nombre del Nuevo Subtema"
   description: "Resumen conceptual de este subtema..."
   ---
   ```
4. **Agrega recursos:** Si usas imágenes, cópialas a `public/images/`.
5. **Verifica en desarrollo:** Ejecuta `npm run dev` y visualiza tu tema inmediatamente en el navegador con recarga automática.

---

## 🌐 Despliegue Automático en GitHub Pages

El proyecto incluye un flujo de trabajo de integración continua configurado en `.github/workflows/deploy.yml`.

Para publicar el sitio en GitHub Pages:
1. Sube tu repositorio a GitHub:
   ```bash
   git add .
   git commit -m "feat: Repositorio Multimedia Astro configurado"
   git push origin main
   ```
2. En tu repositorio de GitHub, dirígete a:
   **Settings** ➔ **Pages**.
3. En la sección **Build and deployment** / **Source**, selecciona:
   **GitHub Actions**.
4. ¡Listo! Cada vez que realices un `git push` a la rama `main`, GitHub compilará el proyecto y publicará la versión más reciente en minutos.

---

## 👥 Créditos y Colaboración

Desarrollado con dedicación institucional para los alumnos y docentes de la **UPIICSA - Instituto Politécnico Nacional**.

> *"La Técnica al Servicio de la Patria"*
