# 📋 Registro de Pendientes y Seguimiento — `blog-upiicsa`

> Documento vivo de seguimiento técnico y editorial del **Repositorio Digital de Herramientas Multimedia (UPIICSA — IPN)**.  
> **Última actualización:** 2026-11-24  
> **Rama base:** `main` (commit de referencia: `7837689`)  
> **Relacionado:** Ver también `CONTEXTO_RV.md` para detalles históricos y decisiones específicas de la Sala RV.

---

## 📊 Resumen de Estado

| Bloque | Prioridad | Pendientes | En progreso | Completados |
| :--- | :---: | :---: | :---: | :---: |
| **1. Bugs y correcciones críticas** | 🔴 Alta | 0 | 0 | 5 |
| **2. Deuda técnica y arquitectura** | 🟠 Media-Alta | 0 | 0 | 5 |
| **3. Sala RV — Identidad IPN** | 🥽 Media | 1 | 0 | 5 |
| **4. Contenido, rendimiento y calidad** | 🟡 Media-Baja | 6 | 0 | 0 |
| **Total** | — | **7** | **0** | **15** |

**Leyenda de estados:** `[ ]` Pendiente · `[-]` En progreso · `[!]` Bloqueado / requiere decisión · `[x]` Completado

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

- [ ] **CAL-01 — Completar `description` SEO real en los 26 temas de Unidad I y Unidad II**
  - **Ubicación:** `src/content/docs/es/unidad-1/*.md` (13 archivos) y `src/content/docs/es/unidad-2/*.md` (13 archivos)
  - **Problema:** Todos conservan `"Plantilla académica para X.X.X: ..."`, mientras que los 6 archivos de `unidad-3/` ya tienen resúmenes editoriales reales.
  - **Acción:** Redactar descripciones concisas y precisas para los 26 temas.

- [ ] **CAL-02 — Modularizar `custom.css` y eliminar selectores posicionales frágiles**
  - **Ubicación:** `src/styles/custom.css` (1,720 líneas, L265–L329)
  - **Problema:** Hoja monolítica con uso masivo de `!important` y badges de unidad acoplados a `li:nth-child(1..3)`.
  - **Acción:** Dividir en parciales lógicos (`tokens.css`, `sidebar.css`, `markdown.css`, `toc.css`, `authors.css`) y desacoplar los badges del orden posicional.

- [ ] **CAL-03 — Evitar asignaciones de memoria por frame en `ar-quiz.ts`**
  - **Ubicación:** `src/components/quiz/scripts/ar-quiz.ts` (L368–L392)
  - **Problema:** `updateStabilizedAnchor()` crea instancias `new THREE.Quaternion()` / `new THREE.Vector3()` y `.clone()` en cada cuadro de renderizado (60–90 Hz en móvil).
  - **Acción:** Preasignar objetos temporales como campos de la clase (`tmpInvQuat`, `tmpTremorQuat`, `tmpStabQuat`, `tmpOffset`) para reducir pausas de GC.

- [ ] **CAL-04 — Añadir verificación estática (`@astrojs/check` + TypeScript) al proyecto y CI**
  - **Ubicación:** `package.json`, `.github/workflows/deploy.yml`
  - **Problema:** No existen scripts `check` ni `typecheck` en `package.json` ni validación de tipos antes del despliegue.
  - **Acción:** Instalar `@astrojs/check` y `typescript` en `devDependencies`, agregar `"check": "astro check"` en `package.json` y ejecutarlo en `deploy.yml` antes de `npm run build`.

- [ ] **CAL-05 — Evaluar buscador interno (`pagefind`) y limpieza de `i18n/es.json`**
  - **Ubicación:** `astro.config.mjs` (L15), `src/content/i18n/es.json` (`{}`)
  - **Acción:** Confirmar si `pagefind` permanecerá desactivado intencionalmente (y documentarlo) o si se integrará en `Header.astro`. Limpiar o poblar `src/content/i18n/es.json` según se requiera.

- [ ] **CAL-06 — Revisar telemetría de depuración en modo RA (`ar-status-pill`)**
  - **Ubicación:** `src/components/quiz/WebXRQuiz.astro` (L83–L86), `src/components/quiz/scripts/ar-quiz.ts` (L345–L353)
  - **Nota:** Actualmente la píldora muestra coordenadas en vivo `AR: Cam(...) | Q(...)` de forma permanente (conservada a petición previa). Evaluar si dejarla siempre visible o mostrarla solo con `?debug=1`.

---

## ❓ Decisiones Abiertas por Confirmar

Antes de ejecutar el Bloque 4, conviene definir:

1. **Buscador (`CAL-05`):** ¿Se mantiene `pagefind: false` o quieres habilitar búsqueda de temas en la cabecera?
2. **Telemetría RA (`CAL-06`):** ¿Dejamos la barra `Cam/Q` visible en producción o condicionada a `?debug=1`?

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
- **Bloque 3 completado en código (5/6 — `RV-06` pendiente solo de visor VR físico):**
  - `RV-01`: placa inclinada `"ESCUDO IPN"` en plinto, mejora de legibilidad de autores del Himno, aviso `lookAround`, traducción de `<title>` y botón `"✕ Cerrar sala"` en `identidad-ipn.md` para liberar WebGL.
  - `RV-02`: galería 3D del Decálogo en 10 paneles (2×5 en pared derecha) con iluminación y lectura por proximidad/clic + modal accesible de respaldo en HUD y bajo la galería.
  - `RV-03`: reducción de luces `point` (5 → 3), bucle único `startSceneLoop()`, `precision: medium`, límite `1920` de canvas y tope de `pixelRatio` móvil.
  - `RV-04`: manejo de fallo de CDN A-Frame + timeout de 12 s con botón `Reintentar`.
  - `RV-05`: compresión de `public/audios/himno_ipn.mp3` a 128 kbps estéreo (4.26 MB → 1.71 MB, -60 %).
