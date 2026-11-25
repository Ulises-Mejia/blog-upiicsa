# Contexto Técnico — Sala de Identidad Institucional IPN (RV)

**Última actualización:** 2026-11-24  
**Repo:** `blog-upiicsa` (Astro + Starlight)  
**Rama:** `main`  
**Seguimiento maestro:** Ver [PENDIENTES.md](./PENDIENTES.md) (Bloque 3: `RV-01`–`RV-06`)

> Documento de referencia técnica de la **Sala de Realidad Virtual de Identidad Institucional IPN**.

## Decisiones tomadas

- **Paleta:** híbrido actual — sala verde/dorado del sitio (`#00643A` / `#D4AF37`) + escudo institucional.
- **Decálogo:** galería 3D en pared derecha (cuadrícula 2×5) con lectura al acercarse (`< 2.35 m`) o al tocar/clicar cualquier panel, manteniendo el modal HTML como respaldo accesible (`Ver Decálogo` en HUD y botón bajo la galería).
- **Logo:** textura `public/rv/ipn-logo.png` referenciada con ruta relativa `ipn-logo.png` (portable ante cambios de `base`).
- **Quiz:** fuente única en `src/data/identidad-quiz.ts`, servida desde `/api/identidad-vr.json`.
- **Porra:** mural estático con las 5 líneas completas de la API (sin TTS).
- **Audio del Himno:** `public/audios/himno_ipn.mp3` comprimido a 128 kbps estéreo (1.71 MB, 60 % más ligero que los 4.26 MB originales).
- **Navegación:** joystick virtual (móvil/escritorio) + WASD + mouse-look en escritorio; en lentes VR se oculta el joystick y se mantiene `blink-controls` con thumbstick.
- **A-Frame:** solo se carga dentro del `<iframe>` de la escena, bajo demanda. El resto del sitio no carga JS de A-Frame.
- **Contenido:** Decálogo, lema, letra del himno y porra se extraen en build de `src/content/docs/es/identidad-ipn.md`.
- **Inglés:** diccionario `identidadUI` + traducciones en `src/data/identidad-vr-en.ts` y `src/data/identidad-quiz.ts`; lee `?lang=`, `localStorage.upiicsa_gt_lang` o la cookie `googtrans`.

## Estado actual

### Hecho (`RV-01` a `RV-05`)

- **Contenido y quiz desde API prerenderizada:** `src/data/identidad-content.ts` extrae de `identidad-ipn.md` el Decálogo (10 puntos), lema, porra (5 líneas) y las 5 secciones del himno con autores, combinándolo con `src/data/identidad-vr-en.ts` y `src/data/identidad-quiz.ts` en `/api/identidad-vr.json`.
- **Sección en la página (`identidad-ipn.md`):** intro en español limpio, aviso WebGL, botón "Entrar a la sala", iframe bajo demanda con `title` y alto responsive (`clamp(340px, 65vh, 600px)`), botón de pantalla completa, botón `"✕ Cerrar sala"` (descarga el iframe y libera WebGL) y lectura dinámica de `<meta name="base-url">`.
- **Escena A-Frame (`public/rv/sala-identidad.html` + `sala-identidad.js`):**
  - **Escudo central:** girando sobre plinto con placa inclinada legible `"ESCUDO IPN"`.
  - **Estación Himno:** play/pausa (filtro antirrebote 350 ms + botón HUD sincronizado + pausa automática del audio padre), modal de letra completa y créditos de autores ampliados.
  - **Galería Decálogo (2×5):** 10 paneles 3D en la pared derecha (`x = 7.72`) generados desde la API; resaltado dorado y lectura en `#station-info` por proximidad (`< 2.35 m`, con detección de fila superior/inferior según mirada) o clic/toque; botón de respaldo accesible bajo la galería y en el HUD.
  - **Estación Porra y Lema:** mural completo con las 5 líneas de la porra y lema en la pared frontal.
  - **UX & ES/EN:** `document.title` traducido, aviso inicial `lookAround` (6 s), cierre de modales con `Escape`, atlas SDF propio (`sala-sdf.{json,png}` con acentos) y fallback con botón `Reintentar` si falla o expira el CDN de A-Frame (12 s).
  - **Rendimiento:** 3 luces `point` + `ambient`, bucle único `startSceneLoop()` pausado cuando `document.hidden`, `precision: medium`, límite `1920` de canvas, tope de `pixelRatio` móvil (`1.5`) y MP3 de 1.71 MB.

### Pendiente

- **`RV-06` — QA en visor VR físico:** validar `blink-controls`, colisiones y `laser-controls` sobre los 10 paneles 3D del Decálogo y estaciones en hardware real (Meta Quest / Pico / etc.).

## Archivos clave

| Archivo | Función |
|---|---|
| `src/content/docs/es/identidad-ipn.md` | Página de Identidad IPN + sección de la sala + controles de abrir/pantalla completa/cerrar. |
| `src/data/identidad-content.ts` | Parser en build del Markdown; integra traducciones y quiz. |
| `src/data/identidad-vr-en.ts` | Traducciones EN del contenido editorial. |
| `src/data/identidad-quiz.ts` | Datos bilingües del quiz (servidos desde la API). |
| `src/pages/api/identidad-vr.json.ts` | Endpoint estático prerenderizado con contenido + quiz bilingüe. |
| `public/rv/sala-identidad.html` | Marcado, estilos y escena A-Frame (galería 2×5, placa del plinto, 3 luces point). |
| `public/rv/sala-identidad.js` | Lógica de la escena, galería por proximidad, bucle único, fallback CDN, audio y quiz. |
| `public/rv/ipn-logo.png` | Textura PNG del escudo usada en la escena. |
| `public/rv/fonts/sala-sdf.{json,png}` | Atlas SDF Noto Sans Medium con soporte de acentos. |
| `public/audios/himno_ipn.mp3` | Grabación oficial del himno optimizada a 128 kbps (1.71 MB). |

## Cómo probar en local

```bash
npm install
npm run dev
```

- Página: `http://localhost:4321/blog-upiicsa/es/identidad-ipn/`
- Escena directa: `http://localhost:4321/blog-upiicsa/rv/sala-identidad.html`
- Escena en inglés: `http://localhost:4321/blog-upiicsa/rv/sala-identidad.html?lang=en`
- Build y preview: `npm run build && npm run preview`
