# 📋 Registro de Pendientes y Seguimiento — `blog-upiicsa`

> Documento vivo de seguimiento técnico y editorial del **Repositorio Digital de Herramientas Multimedia (UPIICSA — IPN)**.  
> **Última actualización:** 2026-11-26  
> **Rama base:** `main` (commit de referencia: `d114ad8`)  
> **Relacionado:** Ver también `CONTEXTO_RV.md` para detalles históricos y decisiones específicas de la Sala RV.

---

## 📊 Resumen de Estado

| Bloque | Prioridad | Pendientes | En progreso | Completados |
| :--- | :---: | :---: | :---: | :---: |
| **1. Bugs y correcciones críticas** | 🔴 Alta | 0 | 0 | 5 |
| **2. Deuda técnica y arquitectura** | 🟠 Media-Alta | 0 | 0 | 5 |
| **3. Sala RV — Identidad IPN** | 🥽 Media | 1 | 0 | 5 |
| **4. Contenido, rendimiento y calidad** | 🟡 Media-Baja | 0 | 0 | 6 |
| **5. Mejoras de UX y secciones** | ✨ Iterativo | 0 | 0 | 3 |
| **6. Modernización Web (`modern-web-guidance`)** | 🌐 Estándares | 0 | 0 | 7 |
| **7. Enriquecimiento visual en temas** | 🖼️ Visual | 2 | 0 | 1 |
| **Total** | — | **3** | **0** | **32** |

**Leyenda de estados:** `[ ]` Pendiente · `[-]` En progreso · `[!]` Bloqueado / requiere decisión o hardware · `[x]` Completado

---

## 🧭 Dinámica de Trabajo (Guía para Futuras Sesiones)

Al retomar este proyecto en una nueva sesión o al abrir este archivo, seguir esta dinámica paso a paso:

1. **Sincronización inicial:** Revisar `PENDIENTES.md`, `git status -sb` y `git log -n 5 --oneline` para confirmar el estado real del repositorio antes de tocar código.
2. **Estructura por bloques e IDs:** Toda nueva auditoría o mejora se registra aquí agrupada por prioridad/frente con IDs trazables (`BUG-XX`, `ARQ-XX`, `RV-XX`, `CAL-XX`), indicando archivo(s), líneas afectadas y objetivo concreto.
3. **Ejecución directa vs. decisiones abiertas:**
   - Actuar directamente sobre correcciones técnicas inequívocas (bugs, tipado, limpieza de código muerto).
   - Antes de cambios que impliquen decisiones de UX, diseño, contenido o arquitectura, preguntar al usuario con opciones breves y claras (indicando la opción recomendada).
4. **Verificación obligatoria por bloque:** Antes de dar por cerrado un bloque, ejecutar y verificar:
   - `npm run check` (`astro check` → 0 errores y 0 advertencias).
   - `npm run clean && npm run build` (confirmando rutas generadas y construcción del índice Pagefind).
   - Si se modifica `public/rv/`, validar además `node --check public/rv/sala-identidad.js` y balance de etiquetas/IDs en `public/rv/sala-identidad.html`.
5. **Documento vivo siempre al día:** Al avanzar o cerrar cada bloque, actualizar en `PENDIENTES.md`:
   - Los checkboxes y el detalle de **Resuelto** en cada ítem.
   - Los contadores de la tabla **Resumen de Estado**.
   - La sección **Decisiones Abiertas por Confirmar** (retirando lo ya definido y agregando nuevas dudas).
   - La **Bitácora de Cambios** con fecha, bloque, resumen y hash del commit.
   - Si aplica a la Sala RV o arquitectura pública, mantener sincronizados `CONTEXTO_RV.md` y `README.md`.
6. **Control de versiones (Git):** No ejecutar `git commit` ni `git push` sin confirmación explícita del usuario. Cuando lo solicite, crear commits atómicos por bloque usando *Conventional Commits* en español (`fix:`, `refactor:`, `feat:`, `chore:`) listando los IDs resueltos.

---

## 🔴 Bloque 1 — Bugs y Correcciones Críticas

- [x] **BUG-01 — Etiquetas HTML duplicadas en la cámara de la Sala RV**
  - **Ubicación:** `public/rv/sala-identidad.html` (L228–L234)
  - **Problema:** Existe un `<a-cursor id="cursor">` duplicado (ID repetido en el DOM) y una etiqueta de cierre `</a-camera>` huérfana fuera de `<a-camera>`.
  - **Resuelto:** Eliminados el `<a-cursor>` y la etiqueta `</a-camera>` duplicados.

- [x] **BUG-02 — Última pregunta del cuestionario RA omite retroalimentación**
  - **Ubicación:** `src/components/quiz/scripts/ar-quiz.ts` (L434–L441 y L516–L518)
  - **Problema:** Al responder la última pregunta, `session.isFinished` se vuelve `true` de inmediato y `render()` entra en `if (this.session.isFinished)` dibujando `resultsCanvas` sin actualizar `questionCanvas` ni `optionMeshes`. El usuario no ve si acertó/falló ni la explicación durante los 2.4–3.4 s de espera, y el texto `"Calculando tus resultados..."` queda inalcanzable.
  - **Resuelto:** `render()` ahora verifica `this.session.isFinished && !this.session.lastAnswer` (igual que `quiz-2d.ts`) y `finish()` limpia `this.session.lastAnswer = null` antes de renderizar los resultados.

- [x] **BUG-03 — `plantilla-tema.md` publicada en producción con sintaxis MDX rota**
  - **Ubicación:** Movida de `src/content/docs/es/plantilla-tema.md` → `templates/plantilla-tema.md`
  - **Problema:** Al estar en `src/content/docs/es/`, se generaba como página pública (`/es/plantilla-tema/`) con el `import` MDX renderizado como texto plano y rutas sin `base`.
  - **Resuelto:** Movida fuera de `src/content/docs/` a `templates/plantilla-tema.md`, corregidos los ejemplos de `<Tabs>` (con nota `.mdx`) y rutas `/blog-upiicsa/...`, y actualizadas las referencias en `README.md`.

- [x] **BUG-04 — Fuga / duplicación de event listeners globales**
  - **Ubicación:** `src/components/Header.astro` (L200–L280) y `src/components/WelcomeCurtain.astro` (L113–L182)
  - **Problema:** `setupMenuToggle()` añade listeners en `document`/`window` sin limpieza aunque `initHeader()` corre en carga y en `astro:page-load`. En `WelcomeCurtain.astro`, cerrar la cortina por clic en botón u overlay no remueve el listener `keydown` de `window`.
  - **Resuelto:** Implementado `cleanupMenuToggle` en `Header.astro` y `cleanupWelcomeCurtain` en `WelcomeCurtain.astro` (limpia listeners al re-inicializar y al cerrar la cortina).

- [x] **BUG-05 — Referencias a recursos estáticos inexistentes (404)**
  - **Ubicación:**
    - `src/content/docs/es/identidad-ipn.md` (L24) — eliminada etiqueta `<source>` `.ogg` inexistente.
    - `src/content/docs/es/autores.md` (L16–L26 y L87–L97) + `src/styles/custom.css` (L1081–L1088) — reemplazadas etiquetas `<img>` rotas por avatares tipográficos con iniciales (`UM` / `ML`), dejando comentado cómo reactivar las fotos cuando se suban a `public/images/`.
  - **Resuelto:** Cero peticiones 404 por assets faltantes.

---

## 🟠 Bloque 2 — Deuda Técnica y Arquitectura

- [x] **ARQ-01 — Unificar datos del quiz de Identidad RV y eliminar código muerto**
  - **Ubicación:** `src/data/identidad-quiz.ts`, `src/data/identidad-content.ts`, `public/rv/sala-identidad.js`, `src/content/docs/es/identidad-ipn.md`
  - **Resuelto:** `identidadQuiz` tipado y servido desde `/api/identidad-vr.json`; eliminado el objeto duplicado y `ttsUnavailable` de `sala-identidad.js`; actualizada la descripción de la Porra en `identidad-ipn.md`.

- [x] **ARQ-02 — Corregir bloques `.lang-es` / `.lang-en` inactivos en `identidad-ipn.md`**
  - **Ubicación:** `src/content/docs/es/identidad-ipn.md` (L135–L156)
  - **Resuelto:** Eliminados los spans `.lang-en` ocultos sin script; la sección RV ahora usa texto limpio en español compatible con Google Translate como el resto de la página.

- [x] **ARQ-03 — Eliminar o parametrizar rutas `/blog-upiicsa` hardcodeadas**
  - **Ubicación:** `astro.config.mjs`, `public/rv/sala-identidad.html`, `src/content/docs/es/identidad-ipn.md`, `index.md`, `autores.md` y CTAs de `1-4-2-base-rv.md`, `2-4-3-aplicaciones.md`, `3-2-bis-etapas-planeacion.md`
  - **Resuelto:** Inyectado `<meta name="base-url">` desde `astro.config.mjs` (`BASE_PATH`), cambiada `ipn-logo.png` a ruta relativa en la Sala RV y convertidos los enlaces internos de portada, CTAs de cuestionario y comentarios de autores a rutas relativas portables.

- [x] **ARQ-04 — Centralizar configuración de unidades y unificar rutas de cuestionario**
  - **Ubicación:** `src/config/units.ts`, `astro.config.mjs`, `Header.astro`, `PageSidebar.astro`, `WebXRQuiz.astro`, `src/pages/es/[unidad]/cuestionario.astro`
  - **Resuelto:** Creado `src/config/units.ts` como fuente única de verdad para las 3 unidades y consolidadas las 3 páginas clonadas en una sola ruta dinámica `src/pages/es/[unidad]/cuestionario.astro` con `getStaticPaths()`.

- [x] **ARQ-05 — Actualizar `README.md` y `CONTEXTO_RV.md` para reflejar el estado real**
  - **Ubicación:** `README.md`, `CONTEXTO_RV.md`
  - **Resuelto:** Sincronizada la estructura del proyecto, componentes, rutas multimedia, estado de `pagefind` y el estado vigente de la Sala RV alineado con `PENDIENTES.md`.

---

## 🥽 Bloque 3 — Sala de Realidad Virtual (Continuación de `CONTEXTO_RV.md`)

- [x] **RV-01 — Fase 2: Pulido visual y textos ES/EN faltantes**
  - **Ubicación:** `public/rv/sala-identidad.html`, `public/rv/sala-identidad.js`, `src/content/docs/es/identidad-ipn.md`
  - **Resuelto:** Placa inclinada legible `"ESCUDO IPN"` en el plinto central, mayor tamaño/legibilidad de autores del himno, aviso inicial `lookAround` en `#station-info`, traducción dinámica de `document.title` según `?lang=` y botón `"✕ Cerrar sala"` en `identidad-ipn.md` que descarga el iframe y libera el contexto WebGL.

- [x] **RV-02 — Fase 3: Decálogo en 10 paneles 3D con lectura por proximidad**
  - **Ubicación:** `public/rv/sala-identidad.html`, `public/rv/sala-identidad.js`
  - **Resuelto:** Galería 3D en cuadrícula 2×5 sobre la pared derecha (`x = 7.72`) generada desde `/api/identidad-vr.json`; al acercarse (`< 2.35 m`) o tocar/clicar un panel, se ilumina en dorado y muestra el punto completo en `#station-info`. Conservado el modal accesible (`#decalogue-panel`) desde el botón bajo la galería y desde el HUD (`Ver Decálogo`), con cierre por `Escape`.

- [x] **RV-03 — Fase 5: Optimización de rendimiento gráfico y loops**
  - **Ubicación:** `public/rv/sala-identidad.html` (L118, L151–L155), `public/rv/sala-identidad.js`
  - **Resuelto:** Luces `point` reducidas de 5 a 3; unificados los dos bucles `requestAnimationFrame` en `startSceneLoop()` con pausa en `document.hidden` y vectores preasignados; renderer ajustado con `precision: medium`, `maxCanvasWidth/Height: 1920` y tope de `pixelRatio` (`1.5` en móvil / `2` en escritorio).

- [x] **RV-04 — Fallback / timeout si falla el CDN de A-Frame**
  - **Ubicación:** `public/rv/sala-identidad.html` (L12–L13, L61–L65), `public/rv/sala-identidad.js`
  - **Resuelto:** Detección `onerror` del script de A-Frame + timeout de 12 s en `sceneReady()`, mostrando mensaje bilingüe de error de red y botón `Reintentar` / `Retry`.

- [x] **RV-05 — Optimización de audio del Himno (`himno_ipn.mp3`)**
  - **Ubicación:** `public/audios/himno_ipn.mp3`
  - **Resuelto:** Re-codificado a 128 kbps estéreo (44.1 kHz) con `ffmpeg`: reducido de **4.26 MB** a **1.71 MB** (**60 % menos peso**, conservando duración íntegra de 106.6 s).

- [!] **RV-06 — QA en visor VR real (`blink-controls`)**
  - **Ubicación:** `public/rv/sala-identidad.html` (L128, L215–L216)
  - **Estado:** Código revisado (paneles del Decálogo y botones marcados `.interactive` con `refreshRaycasters()`, colisión de `#wall-right` cubierta en `blink-controls`). **Pendiente de prueba en hardware VR físico** (Quest / Pico / etc.).

---

## 🟡 Bloque 4 — Contenido, Rendimiento, Estilos y Calidad

- [x] **CAL-01 — Completar `description` SEO real en los 26 temas de Unidad I y Unidad II**
  - **Ubicación:** `src/content/docs/es/unidad-1/*.md` (13 archivos) y `src/content/docs/es/unidad-2/*.md` (13 archivos)
  - **Resuelto:** Reemplazadas las 26 cadenas `"Plantilla académica para..."` por resúmenes académicos concisos y específicos por tema.

- [x] **CAL-02 — Modularizar `custom.css` y eliminar selectores posicionales frágiles**
  - **Ubicación:** `src/styles/{custom,tokens,sidebar,toc,content,authors,integrations}.css`
  - **Resuelto:** Dividido `custom.css` en 6 parciales temáticos importados en orden; sustituidos `li:nth-child(1..3)` por selectores semánticos `:has(a[href*="/unidad-N/"])` con una sola regla base compartida.

- [x] **CAL-03 — Evitar asignaciones de memoria por frame en `ar-quiz.ts`**
  - **Ubicación:** `src/components/quiz/scripts/ar-quiz.ts`
  - **Resuelto:** Preasignados `Vector3`/`Vector2`/`Quaternion` reutilizables (`tmpForward`, `tmpOffset`, `tmpHoriz`, `tmpRayNdc`, `tmpInvSmoothed`, `tmpTremorQuat`, `tmpStabilizedQuat`) y retirado `THREE.Clock` deprecado sin uso.

- [x] **CAL-04 — Añadir verificación estática (`@astrojs/check` + TypeScript) al proyecto y CI**
  - **Ubicación:** `package.json`, `tsconfig.json`, `.github/workflows/deploy.yml`, `Footer.astro`, `PageFrame.astro`, `PageSidebar.astro`, `Header.astro`
  - **Resuelto:** Instalados `@astrojs/check` y `typescript`, añadido script `npm run check`, integrado paso de verificación en `deploy.yml` antes de `npm run build` y resueltos los 10 errores de tipado detectados (0 errores, 0 warnings).

- [x] **CAL-05 — Evaluar buscador interno (`pagefind`) y limpieza de `i18n/es.json`**
  - **Ubicación:** `astro.config.mjs`, `src/components/Header.astro`, `src/styles/integrations.css`, `src/content/i18n/es.json`
  - **Resuelto:** Activado `pagefind: true`, integrado `<Search />` compacto en `Header.astro` (con atajo `Ctrl+K` y modal estilizado en paleta verde/dorado) y poblado `src/content/i18n/es.json` con etiquetas de búsqueda en español.

- [x] **CAL-06 — Revisar telemetría de depuración en modo RA (`ar-status-pill`)**
  - **Ubicación:** `src/components/quiz/WebXRQuiz.astro`, `src/components/quiz/scripts/ar-quiz.ts`
  - **Resuelto:** La píldora `AR: Cam(...) | Q(...)` queda oculta por defecto en producción y se activa únicamente al incluir `?debug=1` en la URL (o ante un error 3D en ejecución).

---

## ✨ Bloque 5 — Mejoras de UX y Secciones

- [x] **UX-01 — Rediseño de Autores y Créditos (vista compacta sin scroll + desplegable)**
  - **Ubicación:** `src/content/docs/es/autores.md`, `src/styles/authors.css`, `README.md`
  - **Resuelto:** Desactivado TOC vacío (`tableOfContents: false`), centrado vertical sin scroll en escritorio (`min-height: 100dvh`), tarjetas compactas mostrando a primera vista solo foto/avatar pendiente, nombre, escuela/carrera y contacto clickeable (`mailto:` + slot web listo para descomentar), y acordeón `<details>` desplegable con rol, contexto académico, perfil y bloques comentados reservados para datos futuros.

- [x] **UX-02 — Ajuste responsive de la cabecera superior en móvil y tablet (sin encimamientos)**
  - **Ubicación:** `src/components/Header.astro`, `src/styles/integrations.css`, `src/styles/tokens.css`
  - **Resuelto:** Corregido el truncado flex (`brand-title-text` + `min-width: 0`) y alto vertical en móvil (`brand-swap-slot` de `46px` → `40px`), ocultado el botón redundante `🏠` en `≤ 540px` (escudos y `UPII` ya llevan al Inicio), escalonados los breakpoints de `badge`/`Índice`/`Search` (`1024px`, `900px`, `768px`, `620px`, `540px`, `359px`) para evitar cualquier colisión desde `320px` hasta escritorio.

- [x] **UX-03 — Identidad `UPII`, cortina/portada de bienvenida simplificadas y unidades colapsadas en menú lateral**
  - **Ubicación:** `astro.config.mjs`, `src/config/site.ts`, `src/components/WelcomeCurtain.astro`, `src/components/Header.astro`, `src/components/PageFrame.astro`, `src/content/docs/es/{index,autores}.md`, `src/pages/{index,404}.astro`, `src/styles/custom.css`
  - **Resuelto:** Configurado `collapsed: true` en las 3 unidades del sidebar y colapso automático en apertura de menú (escritorio y móvil) para mostrar siempre U-I, U-II y U-III cerradas de entrada; simplificada la cortina inicial a escudos IPN/UPIICSA + `"Bienvenido a UPII"` + botón `"Ingresar"`; unificada toda la identidad de marca (`title`, cabecera, pie inferior, portada `/es/`, autores y 404) a **`UPII`**.

---

## 🌐 Bloque 6 — Modernización Web (`modern-web-guidance`)

- [x] **MOD-01 — Esquema de color nativo y toggle de 2 estados conforme a estándares (`dark-mode-toggle`, `dark-mode`)**
  - **Ubicación:** `astro.config.mjs`, `src/styles/tokens.css`, `src/components/Header.astro`
  - **Resuelto:** Añadido `<meta name="color-scheme" content="light dark">` con script inline anti-FOUC inmediato, mapeo `:root:has(> head > meta[name="color-scheme"])` en CSS y toggle de 2 estados que vuelve al modo sistema (`removeItem`) cuando coincide con la preferencia del SO, sincroniza entre pestañas (`storage`) y reacciona a cambios del SO sin borrar overrides almacenados.

- [x] **MOD-02 — Migración a `<dialog>` nativo con contención de scroll y top-layer (`dialog`, `prevent-page-scroll-under-modal-dialog`, `animate-to-from-top-layer`)**
  - **Ubicación:** `src/components/WelcomeCurtain.astro`, `public/rv/sala-identidad.html`, `public/rv/sala-identidad.js`
  - **Resuelto:** Migrados la Cortina de Bienvenida y los 3 modales de la Sala RV (`#quiz-panel`, `#decalogue-panel`, `#lyrics-panel`) a `<dialog closedby="any">` + `.showModal()`, con `overscroll-behavior: contain` en `:modal` y `::backdrop` (`overflow: hidden`), animaciones discretas con fallback `data-closing` para Firefox/Safari, respaldo light-dismiss para Safari y limpieza de `innerHTML = ''` → `replaceChildren()` (`js`).

- [x] **MOD-03 — Accesibilidad de teclado, landmarks, zoom móvil y movimiento reducido (`accessibility`, `html`, `motion`)**
  - **Ubicación:** `src/components/Header.astro`, `src/components/PageFrame.astro`, `src/components/PageSidebar.astro`, `src/components/WelcomeCurtain.astro`, `src/content/docs/es/autores.md`, `src/styles/{integrations,authors,sidebar,toc,content}.css`, `public/rv/sala-identidad.html`
  - **Resuelto:** Retirados `outline: none` sin reemplazo y añadidos anillos `:focus-visible` de alto contraste; eliminado el `<footer>` duplicado en portada y `role="contentinfo"` redundante; corregidos `aria-label` en `<div>` genéricos; habilitado zoom de accesibilidad en `sala-identidad.html` (`touch-action: none` acotado al lienzo 3D/joystick); y completada la cobertura de `prefers-reduced-motion`.

- [x] **MOD-04 — Seguridad de subrecursos externos y carga bajo demanda de terceros (`secure-external-subresources`, `security`, `performance`)**
  - **Ubicación:** `astro.config.mjs`, `src/components/PageFrame.astro`, `src/components/Header.astro`, `public/rv/sala-identidad.html`
  - **Resuelto:** Fijada versión `aframe-blink-controls@0.4.3`, añadidos `integrity="sha384-..."`, `crossorigin="anonymous"` y `referrerpolicy="no-referrer"` en los 2 scripts CDN de la Sala RV; añadido `<meta name="referrer" content="strict-origin-when-cross-origin">`; sustituido `//translate.google.com/...` por carga bajo demanda vía `https://` (`__loadGoogleTranslate`) solo cuando se traduce o existe cookie `/en`.

- [x] **MOD-05 — Barras de progreso con CSS Scroll-Driven Animations y optimización de audio (`scroll-progress-indicator`, `performance`)**
  - **Ubicación:** `src/components/Header.astro`, `src/components/PageSidebar.astro`, `src/content/docs/es/identidad-ipn.md`
  - **Resuelto:** `#headerProgressBar` y `#tocReadingBar` ahora usan `animation-timeline: scroll(root block)` en compositor dentro de `@supports (animation-timeline: scroll())` + `prefers-reduced-motion: no-preference` (en regla separada para que LightningCSS no lo mezcle en el shorthand `animation`), con fallback JS automático; añadido `preload="metadata"` al audio del Himno.

- [x] **MOD-06 — CSS moderno, acordeones fluidos, tipografía y `@view-transition` (`accordion`, `responsive-design`, `typography`, `cross-document-transitions`, `html`)**
  - **Ubicación:** `src/styles/{tokens,content,authors,sidebar}.css`, `src/components/PageFrame.astro`, `src/components/quiz/WebXRQuiz.astro`, `src/content/docs/es/identidad-ipn.md`, `src/pages/index.astro`
  - **Resuelto:** Animación progresiva `::details-content` + `interpolate-size: allow-keywords` + `contain: layout` en acordeones; `.video-wrapper` migrado a `aspect-ratio: 16 / 9`; `100vh` → `100dvh`; `text-wrap: balance` en títulos/`th` y `pretty` en párrafos; extraídos estilos inline y hover JS de `identidad-ipn.md` a CSS; activado `@view-transition { navigation: auto; }` con `prefers-reduced-motion: no-preference`.

- [x] **MOD-07 — Corrección de `favicon.svg` 404 en las 39 páginas de Starlight (detectado en auditoría exhaustiva de `dist/`)**
  - **Ubicación:** `astro.config.mjs`
  - **Resuelto:** Configurado `favicon: '/upiicsa_logo.svg'` en Starlight para eliminar el 404 de `/blog-upiicsa/favicon.svg` en todas las rutas generadas.

---

## 🖼️ Bloque 7 — Enriquecimiento Visual y Multimedia en Temas

- [x] **VIS-01 — Enriquecimiento visual Unidad I (13 temas)**
  - **Ubicación:** `src/styles/content.css`, `public/images/temas/u1/` (52 archivos: 13 fotografías/capturas reales libres en AVIF + WebP responsivos `480w`/`960w`), `src/content/docs/es/unidad-1/*.md` (13 temas)
  - **Resuelto:** Integradas 13 fotografías/capturas reales con licencia libre verificada (Wikimedia Commons / Blender Studio / Comisión Europea / archivo histórico) convertidas con `sharp` a `<picture>` AVIF + WebP responsivos, con armonización visual clara/oscura en `.topic-figure` (incluyendo atenuación suave en modo oscuro para fondos claros `.topic-figure--bright-bg`) y líneas del tiempo editoriales sobrias y mínimamente interactivas (`<ol class="editorial-timeline">` con `<details>` nativo adaptable a modo claro/oscuro y `forced-colors`) en los 2 temas cronológicos (`1-1-2-evolucion` y `1-1-3-web`).

- [ ] **VIS-02 — Enriquecimiento visual Unidad II (13 temas)**
  - **Ubicación:** `public/images/temas/u2/`, `src/content/docs/es/unidad-2/*.md`
  - **Objetivo:** Integrar mínimo 1 fotografía/captura real con licencia libre verificada por tema (AVIF/WebP responsivos con adaptación claro/oscuro) y componentes editoriales sobrios solo cuando el tema lo requiera (p. ej. líneas del tiempo o comparativas estrictamente necesarias).

- [ ] **VIS-03 — Enriquecimiento visual Unidad III (6 temas)**
  - **Ubicación:** `public/images/temas/u3/`, `src/content/docs/es/unidad-3/*.md`
  - **Objetivo:** Integrar mínimo 1 fotografía/captura real con licencia libre verificada por tema (AVIF/WebP responsivos con adaptación claro/oscuro) manteniendo coherencia editorial y presupuesto mínimo de red con las Unidades I y II.

---

## ❓ Decisiones Abiertas por Confirmar

Sin decisiones bloqueantes pendientes. Avance incremental unidad por unidad en **Bloque 7** (`VIS-02` Unidad II → `VIS-03` Unidad III), además de **`RV-06`** (prueba física en visor VR real cuando se disponga de hardware).

---

## 🗓️ Bitácora de Cambios

### 2026-11-24
- Auditoría integral de estructura, código, contenido, cuestionarios WebXR/2D y Sala RV sobre `main` (`7837689`).
- Creación de `PENDIENTES.md` con el inventario completo priorizado en 4 bloques (22 pendientes identificados).
- **Bloque 1 completado (5/5 — commit `6e9119d`):**
  - `BUG-01`: eliminados `<a-cursor id="cursor">` y `</a-camera>` duplicados en `public/rv/sala-identidad.html`.
  - `BUG-02`: corregida la condición de finalización en `src/components/quiz/scripts/ar-quiz.ts` para mostrar la retroalimentación de la última pregunta antes de pasar a resultados.
  - `BUG-03`: movida `plantilla-tema.md` a `templates/plantilla-tema.md` (fuera de `src/content/docs/`), corregidos ejemplos `.mdx` y rutas con `/blog-upiicsa`, y actualizadas referencias en `README.md`.
  - `BUG-04`: agregada limpieza de listeners globales (`cleanupMenuToggle` en `Header.astro` y `cleanupWelcomeCurtain` en `WelcomeCurtain.astro`).
  - `BUG-05`: eliminada referencia inexistente `himno_ipn.ogg` en `identidad-ipn.md` y sustituidas las etiquetas `<img>` 404 de `autores.md` por avatares tipográficos con iniciales (`UM`/`ML`) y guía comentada para activar fotos reales.
- **Bloque 2 completado (5/5 — commit `ed04c70`):**
  - `ARQ-01`: unificado `src/data/identidad-quiz.ts` en `/api/identidad-vr.json`, retirado el quiz duplicado y `ttsUnavailable` de `sala-identidad.js`, y corregida la descripción de la Porra en `identidad-ipn.md`.
  - `ARQ-02`: limpiados los bloques `.lang-es`/`.lang-en` inactivos en `identidad-ipn.md` dejando texto en español compatible con Google Translate.
  - `ARQ-03`: inyectado `<meta name="base-url">` desde `astro.config.mjs` y eliminadas las rutas `/blog-upiicsa` hardcodeadas en `src/` y `public/rv/`.
  - `ARQ-04`: creada fuente única de unidades en `src/config/units.ts` y consolidados los cuestionarios en la ruta dinámica `src/pages/es/[unidad]/cuestionario.astro`.
  - `ARQ-05`: actualizados `README.md` y `CONTEXTO_RV.md` al estado real del proyecto.
- **Bloque 3 completado en código (5/6 — commit `6a2fd48`; `RV-06` pendiente solo de visor VR físico):**
  - `RV-01`: placa inclinada `"ESCUDO IPN"` en plinto, mejora de legibilidad de autores del Himno, aviso `lookAround`, traducción de `<title>` y botón `"✕ Cerrar sala"` en `identidad-ipn.md` para liberar WebGL.
  - `RV-02`: galería 3D del Decálogo en 10 paneles (2×5 en pared derecha) con iluminación y lectura por proximidad/clic + modal accesible de respaldo en HUD y bajo la galería.
  - `RV-03`: reducción de luces `point` (5 → 3), bucle único `startSceneLoop()`, `precision: medium`, límite `1920` de canvas y tope de `pixelRatio` móvil.
  - `RV-04`: manejo de fallo de CDN A-Frame + timeout de 12 s con botón `Reintentar`.
  - `RV-05`: compresión de `public/audios/himno_ipn.mp3` a 128 kbps estéreo (4.26 MB → 1.71 MB, -60 %).
- **Bloque 4 completado (6/6 — commit `48f0615`):**
  - `CAL-01`: actualizadas las 26 `description` SEO de Unidad I y Unidad II con resúmenes académicos reales.
  - `CAL-02`: modularizado `src/styles/custom.css` en 6 parciales (`tokens`, `sidebar`, `toc`, `content`, `authors`, `integrations`) y reemplazados selectores `nth-child` por `:has(a[href*="/unidad-N/"])`.
  - `CAL-03`: reutilización de vectores y cuaterniones temporales en `ar-quiz.ts` (cero asignaciones por frame) y eliminación de `THREE.Clock` deprecado.
  - `CAL-04`: añadidos `@astrojs/check` y `typescript`, script `npm run check`, paso en CI (`deploy.yml`) y corregidos los 10 errores de tipos existentes.
  - `CAL-05`: activado Pagefind (`pagefind: true`), integrado `<Search />` en `Header.astro` con estilos UPIICSA y poblado `src/content/i18n/es.json`.
  - `CAL-06`: telemetría `ar-status-pill` oculta por defecto y activable vía `?debug=1`.
- **Bloque 5 (`UX-01` — commit `67cf0fa`):** rediseñada `src/content/docs/es/autores.md` y `src/styles/authors.css` con vista compacta sin scroll en escritorio (`tableOfContents: false`), información clave a primera vista (foto pendiente, nombre, escuela/carrera, contacto `mailto:` + slot web) y acordeón `<details>` con rol, perfil y bloques comentados para datos futuros.

### 2026-11-25
- **Hotfix `UX-01` (`autores.md` — commit `030d3da`):** eliminadas líneas en blanco dentro del bloque HTML de las tarjetas para evitar que CommonMark convirtiera líneas con sangría de 4+ espacios en bloques de código (`expressive-code`) exponiendo HTML crudo en la página en vivo. Verificado `0` bloques `expressive-code` en todo `dist/`.
- **Bloque 5 (`UX-02` — commit `1f7c7d8`):** corregidos los encimamientos en móvil (`320–540px`), móvil ancho (`541–620px`) y tablet (`769–1024px`) en `Header.astro`, `integrations.css` y `tokens.css`: truncado seguro en `brand-title-text`, alto ajustado de `brand-swap-slot` (`40px`), ocultado botón `🏠` redundante en `≤ 540px` y botones solo-icono en tablet `≤ 1024px`.

### 2026-11-26
- **Bloque 6 completado (`MOD-01`..`MOD-07` — commit `b81714c`, modernización web con `modern-web-guidance`):**
  - `MOD-01`: `<meta name="color-scheme" content="light dark">` + script anti-FOUC + mapeo `:root:has(...)` + toggle de 2 estados con retorno a sistema y sincronización `storage`/`matchMedia`.
  - `MOD-02`: Cortina de bienvenida y los 3 modales de Sala RV migrados a `<dialog closedby="any">` + `showModal()`, `overscroll-behavior: contain` en `:modal`/`::backdrop`, transiciones top-layer con fallback y `replaceChildren()` en `sala-identidad.js` (0 hallazgos en `legacy-scan`).
  - `MOD-03`: anillos `:focus-visible` en cabecera, cortina, pie, autores e identidad; landmarks sin duplicar `contentinfo`; zoom móvil habilitado en Sala RV; cobertura completa de `prefers-reduced-motion`.
  - `MOD-04`: `aframe-blink-controls@0.4.3` fijado + SRI `sha384` + `crossorigin="anonymous"` + `referrerpolicy="no-referrer"`, `<meta name="referrer">`, y Google Translate cargado bajo demanda por `https://`.
  - `MOD-05`: barras de lectura con `animation-timeline: scroll(root block)` (en regla separada para preservar el CSS minificado) + fallback JS y `preload="metadata"` en el audio del Himno.
  - `MOD-06`: acordeones `<details>` animados con `::details-content` + `interpolate-size`, `aspect-ratio: 16/9`, `100dvh`, `text-wrap: balance/pretty`, `@view-transition` MPA y estilos inline extraídos de `identidad-ipn.md`.
  - `MOD-07`: `favicon: '/upiicsa_logo.svg'` en `astro.config.mjs` corrigiendo 39 peticiones 404 a `/blog-upiicsa/favicon.svg` detectadas en la auditoría final de `dist/`.
- **Bloque 7 (`VIS-01` — Unidad I completada, commits `33b47ec` y `d114ad8`, 100 % imágenes reales y adaptación claro/oscuro):**
  - Sustituidos los 7 diagramas SVG iniciales por fotografías/capturas reales con licencia libre verificada (`13/13` temas de Unidad I con `<picture>` AVIF + WebP responsivos en `public/images/temas/u1/`, 52 archivos).
  - Armonizados `.topic-figure` (incluyendo `.topic-figure--bright-bg` para fondos claros en modo oscuro) y añadido componente `.editorial-timeline` sobrio y mínimamente interactivo (`<ol>` + `<details>` nativo adaptable a modo claro, oscuro y `forced-colors`) en los 2 temas cronológicos (`1-1-2-evolucion.md` y `1-1-3-web.md`). Verificado con `npm run check`, `npm run clean && npm run build` y auditoría de `dist/`.
- **Bloque 5 (`UX-03` — identidad `UPII`, bienvenida simplificada y unidades colapsadas en sidebar):**
  - Configurado `collapsed: true` + colapso al abrir menú lateral en escritorio (`Header.astro`) y móvil (`PageFrame.astro`) para mostrar las 3 unidades cerradas al desplegar el menú.
  - Simplificada la cortina de bienvenida (`WelcomeCurtain.astro`) a escudos IPN/UPIICSA, título `"Bienvenido a UPII"` y botón `"Ingresar"`, y actualizada la portada (`/es/`) con `"Bienvenido a UPII"` conservando el índice de unidades.
  - Migrados los textos de identidad de marca en todo el sitio (`astro.config.mjs`, `site.ts`, `PageFrame.astro`, `autores.md`, `index.astro`, `404.astro`) a **`UPII`**.
