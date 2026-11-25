# 🏛️ Repositorio Digital de Multimedia — UPIICSA (IPN)

Plataforma web académica para la asignatura de **Herramientas Multimedia** en la **Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas (UPIICSA - IPN)**.

Construida con **[Astro](https://astro.build/)** y **[Starlight](https://starlight.astro.build/)**, este proyecto ofrece una arquitectura modular, ultra rápida, responsiva y diseñada para que estudiantes y docentes puedan redactar y mantener contenidos académicos en **Markdown puro** a lo largo de todo el semestre escolar.

---

## 📋 Tabla de Contenidos

1. [¿Cómo funciona este proyecto? (Explicado para principiantes)](#-cómo-funciona-este-proyecto-explicado-para-principiantes)
2. [Características Principales](#-características-principales)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Comandos de Ejecución](#-comandos-de-ejecución)
5. [Guía de Modificación y Personalización del Proyecto](#-guía-de-modificación-y-personalización-del-proyecto)
   - [1. Identidad, Textos Globales y Logos](#1-identidad-textos-globales-y-logos)
   - [2. Paleta de Colores y Estilos Visuales](#2-paleta-de-colores-y-estilos-visuales)
   - [3. Barra Lateral, Menús y Nuevas Unidades](#3-barra-lateral-menús-y-nuevas-unidades)
   - [4. Componentes Institucionales de Cabecera y Pie](#4-componentes-institucionales-de-cabecera-y-pie)
   - [5. Autores y Perfiles Estudiantiles](#5-autores-y-perfiles-estudiantiles)
   - [6. Identidad Institucional IPN](#6-identidad-institucional-ipn)
6. [Guía Rápida de Markdown para Redacción de Temas](#-guía-rápida-de-markdown-para-redacción-de-temas)
   - [Sintaxis Básica](#sintaxis-básica)
   - [Bloques de Aviso (Callouts de Starlight)](#bloques-de-aviso-callouts-de-starlight)
   - [Pestañas Interactivas (Tabs)](#pestañas-interactivas-tabs)
   - [Tablas Comparativas](#tablas-comparativas)
   - [Inserción de Recursos Multimedia (Imágenes, Audio y Video)](#inserción-de-recursos-multimedia)
7. [Flujo de Trabajo para Añadir Nuevos Temas](#-flujo-de-trabajo-para-añadir-nuevos-temas)
8. [Despliegue Automático en GitHub Pages](#-despliegue-automático-en-github-pages)

---

## 💡 ¿Cómo funciona este proyecto? (Explicado para principiantes)

Si vas en tus primeros semestres de **Informática** o **Ciencias de la Computación**, ¡bienvenido! Este proyecto puede parecer grande al inicio porque combina varias tecnologías modernas, pero en realidad funciona bajo un principio muy simple: **separar el contenido del diseño y potenciarlo con multimedia interactiva**.

Imagina este sistema como una revista digital interactiva de la UPIICSA que funciona en cuatro partes clave:

```
           ┌────────────────────────┐
           │  1. El Redactor (Tú)   │  Escribe apuntes en Markdown (.md)
           └───────────┬────────────┘
                       │
                       ▼
           ┌────────────────────────┐
           │ 2. La Fábrica (Astro)  │  Junta tu texto + diseño + menús
           └───────────┬────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────────┐
    │          3. La Experiencia Final             │
    ├──────────────────────┬───────────────────────┤
    │  📖 Artículos Web    │  🥽 Realidad Virtual  │  🎮 Cuestionarios en
    │  Rápidos y limpios   │  (Sala 3D en el       │     Realidad Aumentada
    │  (con modo oscuro)   │   navegador WebGL)    │     (WebXR en celular)
    └──────────────────────┴───────────────────────┘
                       │
                       ▼
           ┌────────────────────────┐
           │ 4. La Nube (GitHub)    │  Compila y publica la web gratis
           └────────────────────────┘
```

### 1. El motor web: ¿Qué es Astro y por qué lo usamos?
Tradicionalmente, para hacer una página web escribirías archivos `.html` a mano repitiendo la misma cabecera, pie de página y menús en cada archivo. Si tenías 30 temas y querías cambiar el logotipo, ¡tenías que editar 30 archivos!
* **Astro** resuelve esto: es un **generador de sitios estáticos**. Funciona como una plantilla maestra inteligente: tú diseñas la barra superior, el pie de página y el menú lateral una sola vez en componentes reutilizables (`.astro`), y Astro se encarga de estamparlos en cada página.
* **Starlight** es una extensión de Astro especializada en documentación y blogs académicos: nos da gratis la barra lateral ordenada por unidades, el buscador rápido con Pagefind (`Ctrl+K`), el índice de secciones internas, el modo oscuro y el diseño adaptable a teléfonos móviles.

### 2. El contenido: Escribir sin complicaciones con Markdown (.md)
Para redactar un nuevo tema de la materia, no necesitas programar HTML ni CSS complejo:
* Todo el texto vive en la carpeta `src/content/docs/es/` dentro de archivos con extensión `.md` (**Markdown**).
* Markdown te permite dar formato escribiendo de forma natural: `#` para títulos, `**` para negritas y `-` para listas. Astro lee estos archivos y los transforma automáticamente en páginas web atractivas y bien estructuradas.

### 3. El laboratorio multimedia: Audio, Realidad Virtual (RV) y Aumentada (RA)
Como este repositorio es para la asignatura de **Herramientas Multimedia**, no se queda solo en texto plano:
* **Audio y Video:** Integramos grabaciones institucionales (como el Himno del IPN) y videos de YouTube con reproductores responsivos.
* **Realidad Virtual en la Web (WebXR / A-Frame):** En la sección de Identidad Politécnica, creamos una **Sala Virtual 3D interactiva** (`public/rv/sala-identidad.html`). Usa **A-Frame** y **WebGL**, lo que significa que corre directo en Google Chrome o cualquier navegador moderno sin instalar aplicaciones pesadas: puedes moverte con el teclado (WASD) o ratón en tu PC, o usar un visor VR para caminar alrededor del escudo del IPN.
* **Cuestionarios con Realidad Aumentada:** Al final de las unidades académicas, hay cuestionarios dinámicos que se pueden responder normalmente en pantalla o activar en **Realidad Aumentada** en celulares compatibles: las preguntas flotan en tu entorno físico a través de la cámara del dispositivo mediante la API de **WebXR**.

### 4. ¿Cómo llega a internet? (Git y GitHub Pages)
* **Git:** Nos permite llevar el historial de cada cambio, trabajar en equipo y experimentar sin miedo a perder código anterior.
* **GitHub Actions (CI/CD):** Cuando subes tus cambios con `git push`, un servidor automático de GitHub descarga el código, ejecuta `npm run build` (que compila y "cocina" la web final) y la publica en **GitHub Pages** para que cualquier estudiante con internet pueda consultarla al instante sin configurar un servidor propio.

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
/blog-upiicsa
├── .github/
│   └── workflows/
│       └── deploy.yml             # Automatización CI/CD para GitHub Pages
├── .gitignore                     # Exclusión de dependencias y temporales
├── astro.config.mjs               # Configuración central de Astro, Starlight, meta base-url y sidebar
├── package.json                   # Dependencias y scripts de NPM
├── package-lock.json              # Registro de versiones exactas
├── tsconfig.json                  # Configuración de TypeScript
├── README.md                      # Documentación maestra y manual del proyecto
├── PENDIENTES.md                  # Tablero vivo de seguimiento, bugs y mejoras
├── CONTEXTO_RV.md                 # Referencia técnica y fases de la Sala RV de Identidad IPN
│
├── templates/
│   └── plantilla-tema.md          # Plantilla base lista para clonar y crear temas (no se publica)
├── public/                        # Archivos estáticos servidos directamente bajo /blog-upiicsa/
│   ├── ipn_logo.svg               # Escudo oficial vectorial del IPN
│   ├── upiicsa_logo.svg           # Escudo oficial vectorial de la UPIICSA
│   ├── audios/                    # Grabaciones de audio (himno_ipn.mp3)
│   ├── images/                    # Carpeta para fotografías e ilustraciones (.png, .jpg, .svg)
│   ├── videos/                    # Carpeta para archivos de video (.mp4, .webm)
│   └── rv/                        # Escena aislada A-Frame de la Sala de Identidad IPN
│       ├── sala-identidad.html    # Marcado y escena 3D WebGL/WebXR
│       ├── sala-identidad.js      # Lógica interactiva, audio, joystick, límites y quiz
│       ├── ipn-logo.png           # Textura del escudo IPN para la escena 3D
│       └── fonts/                 # Atlas tipográfico SDF (Noto Sans con soporte de acentos)
│
└── src/
    ├── components/                # Componentes institucionales desarrollados en Astro
    │   ├── Header.astro           # Cabecera: menú, logos, título animado, progreso, TOC móvil, tema e idioma
    │   ├── Footer.astro           # Paginación y metadatos de fin de tema
    │   ├── PageFrame.astro        # Contenedor maestro, Google Translate y barra inferior institucional
    │   ├── PageSidebar.astro      # Índice lateral enriquecido (tiempo de lectura, progreso y accesos)
    │   ├── WelcomeCurtain.astro   # Cortina de bienvenida institucional con memoria de sesión
    │   └── quiz/                  # Sistema dual de cuestionarios (2D accesible + WebXR RA)
    │       ├── WebXRQuiz.astro    # Interfaz principal y DOM overlay de Realidad Aumentada
    │       └── scripts/           # quiz-core.ts, quiz-2d.ts y ar-quiz.ts (Three.js diferido)
    ├── config/
    │   ├── site.ts                # Configuración central de marcas, títulos y logos
    │   └── units.ts               # Fuente única de verdad de unidades (sidebar, cabecera, TOC y quizzes)
    ├── content.config.ts          # Definición de colecciones Starlight (docs e i18n)
    ├── content/
    │   ├── docs/
    │   │   └── es/                # Contenido académico temático en Español (Markdown)
    │   │       ├── autores.md     # Ficha y tarjetas de créditos del equipo
    │   │       ├── identidad-ipn.md # Himno oficial con reproductor, decálogo, símbolos y Sala RV
    │   │       ├── index.md       # Página principal de inicio y bienvenida
    │   │       ├── unidad-1/      # 13 temas oficiales de la Unidad I
    │   │       ├── unidad-2/      # 13 temas oficiales de la Unidad II
    │   │       └── unidad-3/      # 6 temas oficiales de la Unidad III
    │   └── i18n/
    │       └── es.json            # Sobrescritura de etiquetas de interfaz en español
    ├── data/
    │   ├── cuestionarios/         # schema.ts (Zod), index.ts y bancos JSON bilingües (unidad-1..3)
    │   ├── identidad-content.ts   # Parser en build de identidad-ipn.md para la Sala RV
    │   ├── identidad-vr-en.ts     # Traducciones EN del contenido de identidad
    │   └── identidad-quiz.ts      # Banco bilingüe del quiz de la Sala RV (servido por la API)
    ├── pages/
    │   ├── index.astro            # Redirección estática de raíz (/) hacia (/es/)
    │   ├── 404.astro              # Página institucional de error 404
    │   ├── api/
    │   │   └── identidad-vr.json.ts # Endpoint estático prerenderizado para la Sala RV
    │   └── es/
    │       └── [unidad]/
    │           └── cuestionario.astro # Ruta dinámica para los cuestionarios de cada unidad
    └── styles/
        ├── custom.css             # Punto de entrada modular que importa los parciales
        ├── tokens.css             # Variables cromáticas institucionales y cabecera global
        ├── sidebar.css            # Menú lateral colapsable, tarjetas glassmorphism y badges
        ├── toc.css                # Índice lateral de escritorio y desplegable móvil/tablet
        ├── content.css            # Lámina de lectura, tipografía editorial, media y CTAs
        ├── authors.css            # Tarjetas de autores y avatares
        └── integrations.css       # Integración limpia de Google Translate y modal Pagefind
```

---

## 🛠️ Comandos de Ejecución

Ejecuta todos los comandos desde la raíz del proyecto:

```bash
# 1. Instalar dependencias del proyecto (la primera vez o tras clonar)
npm install

# 2. Iniciar el servidor local de desarrollo con recarga en vivo (HMR)
npm run dev

# 3. Verificar tipos de TypeScript y plantillas Astro
npm run check

# 4. Compilar el proyecto para producción (genera la carpeta estática /dist + índice Pagefind)
npm run build

# 5. Previsualizar localmente el sitio compilado en producción (incluye buscador Pagefind)
npm run preview

# 6. Limpiar caché de compilación (.astro y dist) si algún cambio no se refleja
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
Archivos: `src/config/units.ts` y `astro.config.mjs`

Las unidades temáticas están centralizadas en `src/config/units.ts`, que alimenta automáticamente el `sidebar` de `astro.config.mjs`, las insignias de `Header.astro`, el progreso de `PageSidebar.astro` y la ruta dinámica `src/pages/es/[unidad]/cuestionario.astro`:
```javascript
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
]
```
* **Añadir una nueva Unidad temática:** Crea la carpeta `src/content/docs/es/unidad-4/`, agrégala en `src/config/units.ts` y añade su banco de preguntas en `src/data/cuestionarios/`.
* **Modificar el título o URL base del sitio:** Edita `BASE_PATH`, `site` o `title` al inicio de `astro.config.mjs` (el valor de `BASE_PATH` también se inyecta automáticamente en `<meta name="base-url">`).

---

### 4. Componentes Institucionales de Cabecera, Índice, Pie y Cuestionarios
Ubicación: `src/components/`

* **`Header.astro`:** Controla la barra superior fija, el botón de menú hamburguesa (☰), los escudos IPN/UPIICSA, el título animado con barra de progreso de lectura, el acceso integrado al índice en móvil/tablet, el conmutador de tema y el botón de traducción con Google Translate.
* **`PageFrame.astro`:** Envuelve cada página del sitio. Monta la cortina en portada, inicializa Google Translate e incorpora la barra inferior fija (`.shell-footer`).
* **`PageSidebar.astro`:** Panel derecho enriquecido en escritorio (tiempo estimado de lectura, barra de progreso, avance de unidad, acceso al cuestionario y atajos rápidos) y pie contextual del desplegable móvil/tablet.
* **`WelcomeCurtain.astro`:** Genera la cortina de bienvenida que aparece al entrar a la portada por primera vez en la sesión de navegación (`?welcome` fuerza su visualización).
* **`Footer.astro`:** Renderiza los enlaces de paginación anterior/siguiente al pie de cada artículo académico.
* **`quiz/WebXRQuiz.astro`:** Interfaz de evaluación con modo clásico 2D accesible (`quiz-2d.ts`) y modo Realidad Aumentada WebXR (`ar-quiz.ts`, con carga diferida de Three.js).

---

### 5. Autores y Perfiles Estudiantiles
Archivo: `src/content/docs/es/autores.md`

Para actualizar las fotografías y datos de los desarrolladores o colaboradores:
1. Guarda la fotografía en `public/images/autor_tunombre.jpg`.
2. Abre `autores.md` y edita la tarjeta correspondiente (`<article class="author-card">`), descomentando la etiqueta `<img>` (y ocultando el avatar de iniciales `.author-avatar-fallback`) y actualizando nombre, rol, correo institucional, carrera y experiencia.
3. Mientras no existan fotografías locales, cada tarjeta muestra un avatar tipográfico con iniciales sin generar peticiones 404.

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
Para alternar entre comparaciones, lenguajes o metodologías *(requiere guardar el tema con extensión `.mdx` en lugar de `.md`)*:

```mdx
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

> **Nota sobre rutas:** Como el sitio se publica bajo `/blog-upiicsa`, usa el prefijo `/blog-upiicsa/...` en rutas absolutas hacia `public/` (o rutas relativas según la profundidad de la página).

#### 1. Imágenes con Pie de Foto y Centrado Institucional
Guarda la imagen en `public/images/mi-grafico.png`:

```html
<div class="media-container">
  <img src="/blog-upiicsa/images/mi-grafico.png" alt="Esquema del proceso multimedia" />
  <div class="media-caption">📷 Figura 1: Esquema de fases en la producción multimedia.</div>
</div>
```
*(También puedes usar la sintaxis estándar de Markdown: `![Descripción](/blog-upiicsa/images/mi-grafico.png)`).*

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
  <source src="/blog-upiicsa/videos/clip-demostrativo.mp4" type="video/mp4" />
  Tu navegador no soporta video HTML5.
</video>
```

#### 4. Audio Local HTML5 (MP3 / WAV / OGG)
Guarda el archivo de audio en `public/audios/pista-sonora.mp3`:

```html
<audio controls style="width: 100%; margin: 1rem 0;">
  <source src="/blog-upiicsa/audios/pista-sonora.mp3" type="audio/mpeg" />
  Tu navegador no soporta audio HTML5.
</audio>
```

---

## 🔄 Flujo de Trabajo para Añadir Nuevos Temas

Cuando te corresponda redactar o actualizar un tema de la materia:

1. **Duplica la plantilla oficial:** Haz una copia del archivo:
   `templates/plantilla-tema.md`
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
