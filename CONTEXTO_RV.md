# Contexto — Sala de Identidad Institucional IPN (RV)

**Fecha:** 2026-11-03  
**Repo:** `blog-upiicsa` (Astro + Starlight)  
**Rama:** `main`  
**Último commit funcional:** `d4eac36` — `feat(rv): cargar contenido de identidad desde el markdown`  
**Checkpoint:** commit WIP que contiene este archivo (layout/paleta de la sesión anterior + PNG del escudo + datos del quiz).

> Este documento es un checkpoint para continuar desde otro equipo. **No es una fase cerrada**: la Fase 2 todavía no se ha ejecutado.

## Decisiones tomadas

- **Paleta:** híbrido actual — sala verde/dorado del sitio (`#00643A` / `#D4AF37`) + escudo guinda.
- **Decálogo:** 10 paneles 3D con lectura al acercarse. Sustituir el botón + modal actual; decidir si el modal se mantiene como fallback accesible.
- **Logo:** usar `public/rv/ipn-logo.png` con ruta absoluta `/blog-upiicsa/rv/ipn-logo.png`; commitear el PNG.
- **Quiz:** se mantiene como extra; traducir su botón y unificar los datos con `src/data/identidad-quiz.ts` servidos desde la API.
- **Navegación móvil/escritorio:** joystick virtual; en lentes se mantiene `blink-controls` con thumbstick.
- **A-Frame:** solo se carga dentro del iframe de la escena, bajo demanda. El resto del sitio no carga JS de A-Frame.
- **Contenido:** Decálogo, lema, letra y porra salen de `src/content/docs/es/identidad-ipn.md`; no duplicar el texto a mano.
- **Inglés:** Google Translate en vivo. La escena tiene su propio diccionario ES/EN y lee `?lang=`, la cookie `googtrans` o `localStorage.upiicsa_gt_lang`.

## Correcciones de la sesión actual (2026-11-03)

- **Acentos en 3D:** A-Frame usa por defecto un atlas Roboto MSDF solo ASCII, por eso `DECÁLOGO`, `Símbolo` y `Acércate` salían con glifos faltantes. Se generó `public/rv/fonts/sala-sdf.{json,png}` con Noto Sans Medium (ASCII + Latin-1) y todos los `a-text` usan `font="fonts/sala-sdf.json" negate="false"`.
- **Pausa del himno:** el botón 3D recibía dos `click` en móvil (touch + mouse sintetizado), así que reproducía y pausaba en el mismo toque. Se añadió un filtro antirrebote de 350 ms para los botones 3D. Además hay un botón **Reproducir/Pausar himno** en el HUD, el estado se sincroniza con los eventos `play`/`pause`/`ended` del audio y al entrar a la sala se pausa el audio de la página padre.
- **Porra en el mural:** la estación de la porra muestra las 5 líneas completas de la API, con la línea que se está leyendo resaltada en dorado durante el TTS.
- **Movimiento en móvil:** joystick virtual abajo a la izquierda (touch y ratón), movimiento relativo a la cámara, límites de sala y colisión con el plinto central. Se oculta en VR y se mantiene `blink-controls` para lentes. WASD sigue funcionando en escritorio.
- **Cámara móvil:** en vertical se amplía el FOV y la cámara arranca en `z=5.2` para que las estaciones laterales entren en pantalla.
- **Extras:** banner principal sin solapamiento y traducido; logo con ruta absoluta `/blog-upiicsa/rv/ipn-logo.png`; textos del HUD traducidos; copia de navegación de la página actualizada; `title` del iframe añadido.

## Estado actual

### Hecho

- **Contenido desde el markdown:** `src/data/identidad-content.ts` extrae de `identidad-ipn.md` el Decálogo (10 puntos), lema, porra (5 líneas) y las 5 secciones del himno con autores. `src/data/identidad-vr-en.ts` aporta el inglés. `src/pages/api/identidad-vr.json.ts` prerenderiza el JSON.
- **Sección en la página:** `identidad-ipn.md` ya incluye intro, aviso WebGL, botón “Entrar a la sala”, iframe bajo demanda y botón de pantalla completa. Está commiteada. Lee cookie/`localStorage` y pasa `?lang=` al iframe.
- **Escena:** 4 estaciones (escudo girando sobre plinto, himno con play/pausa y letra, Decálogo, porra con TTS), banner principal, lema, HUD y quiz. A-Frame solo vive dentro del iframe.
- **ES/EN:** diccionario `identidadUI` + contenido bilingüe de la API. Títulos de estación, botones, lema, himno, Decálogo y porra cambian. Verificado con `?lang=en`.
- **Lentes:** `blink-controls` en ambos `laser-controls`, con teletransporte por thumbstick y giro por snap. Código puesto; **sin probar en hardware**.
- **Audio/rutas:** `../audios/himno_ipn.mp3` resuelve bien en `dist`; el logo PNG carga en la prueba headless.
- **Build:** `npm run build` pasa (41 páginas + `/api/identidad-vr.json`). `dist/` está ignorado por git.

### Pendiente / conocido

1. **Decálogo:** sigue siendo un botón + modal HTML con los 10 puntos, no 10 paneles 3D que se lean al acercarse. Es la mayor diferencia con el brief y queda para la Fase 3.
2. **ES/EN:** HUD, banner y navegación ya se traducen. Siguen pendientes `lookAround` (sin usar) y la unificación del quiz con `src/data/identidad-quiz.ts`.
3. **Navegación:** joystick y WASD funcionan en móvil/escritorio. En lentes el código de `blink-controls` está puesto, pero sigue sin probarse en hardware.
4. **Rendimiento:** no hay revisión ni medición. Pendientes claros: 5 luces point + ambient; `antialias: true` y `highRefreshRate: true`; render continuo por el escudo; MP3 de 4.1 MB (preload `auto`, ok); A-Frame 1.5.0; sin límite de canvas/pixel ratio para móvil.
5. **Pulir palabras:** el banner ya no se solapa y “Acércate para leer” es legible. La etiqueta “Escudo IPN” sigue sobre el tallo con poco contraste; no hay aviso de girar para ver el lema/porra (`lookAround` sin usar). El título principal es un banner colgante, no un mural en pared.
6. **Logo:** ya usa la ruta absoluta `/blog-upiicsa/rv/ipn-logo.png`. El SVG original no se usa porque A-Frame no lo texturizó.
7. **Detalles de la sección:** el `meta[name="base-url"]` no existe; el script cae en `/blog-upiicsa` hardcodeado (funciona con el base actual, pero no es portable). El iframe ya tiene `title`; sigue midiendo 600 px fijos y no hay botón para descargar/salir de la escena.
8. **Archivos sueltos:** `FASE1_REVISION_IDENTIDAD_VR.md` está desactualizado y `src/data/identidad-quiz.ts` todavía no se importa. El quiz está hardcodeado en `sala-identidad.js` y duplica ese TS.

## Plan de fases (un commit local por fase, sin push salvo petición)

### Fase 2 — Pulido visual, textos ES/EN y logo

- Mantener la paleta híbrida actual.
- Banner principal: corregir el solapamiento de las dos líneas y el borde dorado; añadir IDs para traducirlo.
- Completar ES/EN: banner, botones del HUD (“Pantalla completa”, “Entrar en modo VR”, “Quiz Identidad”), título del documento y textos de ayuda. Usar `fullscreen`/`vrMode` que ya existen y añadir `bannerTitle`, `bannerSubtitle`, `quiz`, `move`, `lookAround`.
- Pulir palabras: mover “Escudo IPN” a una placa legible del plinto, agrandar info de autores y “Acércate para leer”, y añadir el aviso “Gira para ver el lema y la porra”.
- Logo: `ipn-logo.png` con ruta absoluta `/blog-upiicsa/rv/ipn-logo.png`; commitear el PNG.
- Quiz: mantenerlo, traducir su botón y unificar los datos con `src/data/identidad-quiz.ts` servidos desde la API, para quitar la duplicación del JS.
- Sección: `title` del iframe, alto responsive y copy de navegación actualizado.
- Build + capturas ES/EN en escritorio y móvil.
- Commit: `feat(rv): pulir sala y completar textos ES/EN`.

### Fase 3 — Decálogo en 10 paneles 3D

- Galería en la pared derecha: 10 paneles (2 filas × 5 columnas) + cabecera “DECÁLOGO POLITÉCNICO”.
- Cada panel muestra número y texto del punto, tomados de la API.
- Al acercarse a menos de ~2 m: el panel se ilumina y aparece un HUD superior con el texto completo; se oculta al alejarse. Sin TTS, según decisión.
- Sustituir la estación actual de botón + modal por la galería; decidir si el modal se queda como fallback accesible.
- Build + prueba de proximidad.
- Commit: `feat(rv): decálogo en 10 paneles 3D con lectura por proximidad`.

### Fase 4 — Joystick virtual

- Joystick circular abajo-izquierda para touch y ratón; movimiento relativo a la cámara. WASD sigue funcionando en escritorio.
- Colisiones simples: límites de la sala, plinto central y paneles de estación; sin atravesar paredes.
- En VR se oculta el joystick y se mantiene `blink-controls` con thumbstick.
- HUD y sección: “Muévete con el joystick o WASD” / “Move with the joystick or WASD”; en VR, “Teletransporte con thumbstick”.
- Build + prueba en viewport móvil/escritorio.
- Commit: `feat(rv): joystick virtual para móvil y escritorio`.

### Fase 5 — Rendimiento y QA final

- Quitar `aframe-environment-component` (se carga pero no se usa).
- Ajustar renderer: quitar `highRefreshRate: true` y `sortObjects`, limitar `maxCanvasWidth/Height`, valorar `precision: medium`.
- Reducir luces point de 5 a 3.
- Añadir timeout/fallback si A-Frame no carga.
- Medir FPS/draw calls en escritorio y móvil emulado; capturas finales ES/EN.
- Limpiar `FASE1_REVISION_IDENTIDAD_VR.md` (actualizar, archivar o retirar).
- Commit: `perf(rv): optimizar escena y QA final`.

## Archivos clave

| Archivo | Función |
|---|---|
| `src/content/docs/es/identidad-ipn.md` | Página de Identidad IPN + sección de la sala + script inline del iframe. |
| `src/data/identidad-content.ts` | Parser del markdown; extrae Decálogo, lema, porra y himno. |
| `src/data/identidad-vr-en.ts` | Traducciones EN del contenido. |
| `src/data/identidad-quiz.ts` | Datos bilingües del quiz (pendiente de conectar a la API). |
| `src/pages/api/identidad-vr.json.ts` | Endpoint prerenderizado con el contenido bilingüe. |
| `public/rv/sala-identidad.html` | Marcado, estilos y escena A-Frame. |
| `public/rv/sala-identidad.js` | Lógica de la escena, ES/EN, audio, TTS, quiz y UI. |
| `public/rv/ipn-logo.png` | Textura del escudo (necesaria para el HTML actual). |
| `public/audios/himno_ipn.mp3` | Grabación oficial del himno. |
| `public/ipn_logo.svg` | SVG original; no se usa en la escena porque A-Frame no lo texturizó. |
| `FASE1_REVISION_IDENTIDAD_VR.md` | Propuesta inicial desactualizada; no está commiteada. |
| `dist/` | Build ignorado por git; se regenera con `npm run build`. |

## Cómo ejecutar

```bash
npm install
npm run dev
```

- Página: `http://localhost:4321/blog-upiicsa/es/identidad-ipn/`
- Escena directa: `http://localhost:4321/blog-upiicsa/rv/sala-identidad.html`
- Escena en inglés: `http://localhost:4321/blog-upiicsa/rv/sala-identidad.html?lang=en`
- Build: `npm run build`
- Preview del build: `npm run preview`

Notas:

- La escena hace `fetch('../api/identidad-vr.json')`; necesita el servidor de Astro o un build, no `file://`.
- A-Frame y `aframe-blink-controls` se cargan desde CDN; hace falta conexión.
- La sección de la página usa el base `/blog-upiicsa` hardcodeado. Si cambia el base, hay que ajustarlo.

## Siguiente paso

Empezar por la **Fase 2**. Antes de tocar código, confirmar estos detalles:

1. **Galería del Decálogo:** ¿pared derecha en 2×5 (recomendado) o semicírculo alrededor de la estación actual?
2. **Modal del Decálogo:** ¿se mantiene como fallback accesible “Leer los 10 puntos” o se retira?
3. **Audio:** ¿re-encodear el MP3 a 128 kbps en la fase de rendimiento o dejarlo intacto por ser la grabación oficial?
4. **`FASE1_REVISION_IDENTIDAD_VR.md`:** ¿actualizar, archivar o retirar?

No hay cambios de código de la Fase 2 todavía. El checkpoint actual solo preserva el estado de la sesión anterior.
