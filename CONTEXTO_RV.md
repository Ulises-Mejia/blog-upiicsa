# Contexto Técnico — Sala de Identidad Institucional IPN (RV)

**Última actualización:** 2026-11-24  
**Repo:** `blog-upiicsa` (Astro + Starlight)  
**Rama:** `main`  
**Seguimiento maestro:** Ver [PENDIENTES.md](./PENDIENTES.md) (Bloque 3: `RV-01`–`RV-06`)

> Documento de referencia técnica para la evolución de la **Sala de Realidad Virtual de Identidad Institucional IPN**.

## Decisiones tomadas

- **Paleta:** híbrido actual — sala verde/dorado del sitio (`#00643A` / `#D4AF37`) + escudo institucional.
- **Decálogo:** evolucionar a 10 paneles 3D con lectura por proximidad (Fase 3 / `RV-02`); definir si el modal actual se mantiene como fallback accesible.
- **Logo:** textura `public/rv/ipn-logo.png` referenciada con ruta relativa `ipn-logo.png` (portable ante cambios de `base`). El SVG original no se usa en A-Frame por problemas de texturización.
- **Quiz:** se mantiene como módulo extra; fuente única en `src/data/identidad-quiz.ts`, servida desde `/api/identidad-vr.json`.
- **Porra:** mural estático con las 5 líneas completas de la API (sin botón TTS).
- **Navegación:** joystick virtual (móvil/escritorio) + WASD + mouse-look en escritorio; en lentes VR se oculta el joystick y se mantiene `blink-controls` con thumbstick.
- **A-Frame:** solo se carga dentro del `<iframe>` de la escena, bajo demanda. El resto del sitio no carga JS de A-Frame.
- **Contenido:** Decálogo, lema, letra del himno y porra se extraen en build de `src/content/docs/es/identidad-ipn.md` (sin duplicar texto a mano).
- **Inglés:** la escena tiene su diccionario `identidadUI` + traducciones en `src/data/identidad-vr-en.ts` y `src/data/identidad-quiz.ts`; lee `?lang=`, `localStorage.upiicsa_gt_lang` o la cookie `googtrans`.

## Estado actual

### Hecho

- **Contenido y quiz desde API prerenderizada:** `src/data/identidad-content.ts` extrae de `identidad-ipn.md` el Decálogo (10 puntos), lema, porra (5 líneas) y las 5 secciones del himno con autores, combinándolo con `src/data/identidad-vr-en.ts` y `src/data/identidad-quiz.ts` en `/api/identidad-vr.json` (`src/pages/api/identidad-vr.json.ts`).
- **Sección en la página (`identidad-ipn.md`):** intro limpia en español (traducida por Google Translate), aviso WebGL, botón "Entrar a la sala", iframe bajo demanda con `title` y alto responsive (`clamp(340px, 65vh, 600px)`), botón de pantalla completa y lectura dinámica de `<meta name="base-url">` (inyectado desde `astro.config.mjs`) con respaldo relativo.
- **Escena A-Frame (`public/rv/sala-identidad.html` + `sala-identidad.js`):**
  - 4 estaciones: Escudo girando sobre plinto, Himno con play/pausa (filtro antirrebote de 350 ms + botón HUD sincronizado + pausa automática del audio padre) y modal de letra, Decálogo (botón + modal actual), y mural de la Porra.
  - Atlas tipográfico SDF propio (`public/rv/fonts/sala-sdf.{json,png}`, Noto Sans Medium con ASCII + Latin-1) para acentos y signos en 3D.
  - Joystick virtual táctil/ratón, `mouse-look` en escritorio, cámara responsive en vertical, límites de sala y colisiones con estaciones y plinto.
  - `aframe-environment-component` retirado; cámara limpia (sin etiquetas `<a-cursor>`/`</a-camera>` duplicadas).
  - Textura `ipn-logo.png` con ruta relativa portable.
- **Lentes VR:** `blink-controls` y `laser-controls` en ambas manos (implementado, **pendiente de QA en hardware real**).

### Pendiente (alineado con Bloque 3 de `PENDIENTES.md`)

1. **`RV-01` — Pulido visual y textos ES/EN restantes:**
   - Reubicar `"Escudo IPN"` a una placa legible sobre el plinto.
   - Agrandar info de autores y ayuda; utilizar `identidadUI.lookAround` (definido pero sin usar) para indicar el lema y la porra.
   - Traducir el `<title>` de `sala-identidad.html` según `?lang=`.
   - Agregar botón para cerrar/descargar la escena desde `identidad-ipn.md` y liberar memoria WebGL.
2. **`RV-02` — Decálogo en 10 paneles 3D con lectura por proximidad:**
   - Sustituir el botón + modal actual por una galería de 10 paneles 3D (confirmar cuadrícula 2×5 en pared derecha vs semicírculo y si se conserva el modal como fallback accesible).
   - Al acercarse a `< 2 m`, iluminar el panel y mostrar el texto completo en el HUD superior (sin TTS).
3. **`RV-03` — Optimización de rendimiento y loops:**
   - Reducir luces `point` de 5 a 3.
   - Unificar los dos bucles `requestAnimationFrame` permanentes (`setupJoystick` y `setupRoomLimits`) en un único loop o componente A-Frame `tick`.
   - Revisar opciones del renderer (`maxCanvasWidth/Height`, `precision: medium`, límite de pixel ratio en móvil).
4. **`RV-04` — Resiliencia de carga CDN:**
   - Añadir timeout y mensaje de error/reintento si A-Frame no carga desde CDN.
5. **`RV-05` — Audio del Himno:**
   - Evaluar compresión de `public/audios/himno_ipn.mp3` (4.26 MB) a ~128 kbps vs conservar la grabación original intacta.
6. **`RV-06` — QA en visor VR físico:**
   - Validar `blink-controls`, colisiones y `laser-controls` en hardware real (Meta Quest / Pico / etc.).

## Archivos clave

| Archivo | Función |
|---|---|
| `src/content/docs/es/identidad-ipn.md` | Página de Identidad IPN + sección de la sala + script del iframe. |
| `src/data/identidad-content.ts` | Parser en build del Markdown; integra traducciones y quiz. |
| `src/data/identidad-vr-en.ts` | Traducciones EN del contenido editorial. |
| `src/data/identidad-quiz.ts` | Datos bilingües del quiz (servidos desde la API). |
| `src/pages/api/identidad-vr.json.ts` | Endpoint estático prerenderizado con contenido + quiz bilingüe. |
| `public/rv/sala-identidad.html` | Marcado, estilos y escena A-Frame. |
| `public/rv/sala-identidad.js` | Lógica de la escena, ES/EN, audio, joystick, límites, mouse-look y quiz. |
| `public/rv/ipn-logo.png` | Textura PNG del escudo usada en la escena. |
| `public/rv/fonts/sala-sdf.{json,png}` | Atlas SDF Noto Sans Medium con soporte de acentos. |
| `public/audios/himno_ipn.mp3` | Grabación oficial del himno (4.26 MB). |

## Cómo probar en local

```bash
npm install
npm run dev
```

- Página: `http://localhost:4321/blog-upiicsa/es/identidad-ipn/`
- Escena directa: `http://localhost:4321/blog-upiicsa/rv/sala-identidad.html`
- Escena en inglés: `http://localhost:4321/blog-upiicsa/rv/sala-identidad.html?lang=en`
- Build y preview: `npm run build && npm run preview`

Notas:
- La escena consulta `../api/identidad-vr.json`; requiere el servidor de Astro o `npm run preview`, no `file://`.
- A-Frame y `aframe-blink-controls` se cargan desde CDN; se requiere conexión a internet.
