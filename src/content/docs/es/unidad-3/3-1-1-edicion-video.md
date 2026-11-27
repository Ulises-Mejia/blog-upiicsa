---
title: "Edición del Video en las Herramientas Multimedia"
description: "Fundamentos de la edición no lineal (NLE) no destructiva, parámetros técnicos del flujo de video, fases de montaje audiovisual y protocolos de streaming adaptativo HLS y MPEG-DASH."
---

## Introducción

Durante décadas, editar una película o un programa de televisión significaba cortar físicamente rollos de celuloide con una cuchilla y pegarlos con cinta adhesiva, o bien copiar secuencias de una videocasetera a otra en estricto orden cronológico: si querías acortar tres segundos la primera escena de un video de una hora, tenías que volver a grabar toda la hora completa. La llegada de la **Edición No Lineal (`NLE`) digital** revolucionó la informática audiovisual al permitir manipular horas de video `4K` de forma instantánea y no destructiva mediante simples punteros de memoria, y distribuirlos por internet adaptando su calidad segundo a segundo según la conexión de cada usuario (Ojeda Linares, 2012; Stanković et al., 2016).

## Fundamentos de la Edición No Lineal (NLE) No Destructiva y Parámetros Técnicos del Flujo de Video

En la **Edición No Lineal (*Non-Linear Editing*, `NLE`)** y **no destructiva**, los archivos de video originales grabados por la cámara (*clips fuente*) nunca se modifican ni sobrescriben en el disco duro durante el montaje. En su lugar, el software mantiene una estructura de datos ligera —una **Lista de Decisiones de Edición (`EDL`)** o archivo de proyecto `XML`/`JSON`— que almacena punteros de **código de tiempo (*Timecode SMPTE* en formato `HH:MM:SS:FF`: Horas, Minutos, Segundos y Fotogramas)** indicando de qué segundo a qué segundo debe leerse cada clip en la línea de tiempo (Ojeda Linares, 2012; Ruiz, 2018).

Todo flujo de video digital está gobernado por cinco parámetros técnicos fundamentales:

* **Resolución Espacial y Relación de Aspecto (*Aspect Ratio*):** Dimensiones de la matriz de píxeles (por ejemplo, `HD` de 1280 × 720, `Full HD` de 1920 × 1080 o `4K UHD` de 3840 × 2160) y proporción geométrica (`16:9` panorámico estándar, `9:16` vertical móvil o `21:9` cinematográfico).
* **Cadencia de Fotogramas (*Framerate*) y Escaneo Progresivo:** Número de imágenes completas por segundo (`24`, `30` o `60 FPS`) con barrido progresivo (`p`), donde todas las líneas horizontales del cuadro se dibujan en el mismo instante, a diferencia del antiguo video entrelazado (`i`).
* **Submuestreo de Crominancia (*Chroma Subsampling* — `4:4:4`, `4:2:2`, `4:2:0`):** Como el ojo humano posee muchos más fotorreceptores sensibles al brillo (bastones, luminancia *Y*) que al color (conos, crominancia *Cb*, *Cr*), el video digital separa el brillo del color y reduce la resolución espacial de los canales cromáticos sin pérdida visual perceptible:
  * **`4:4:4`:** Conserva el 100 % de la información de color.
  * **`4:2:2`:** Reduce el color horizontal a la mitad (estándar para grabación profesional y recorte de pantalla verde *Chroma Key*).
  * **`4:2:0`:** Reduce el color a la cuarta parte (estándar universal de distribución web, Blu-ray y *streaming*) (González & Woods, 2017; Stanković et al., 2016).
* **Estructura `GOP` (*Group of Pictures*: Cuadros `I`, `P` y `B`):** La compresión inter-cuadro agrupa los fotogramas en bloques encabezados por un **Cuadro `I` (*Intra-coded* / *Keyframe*)** que contiene una imagen completa independiente, seguido de **Cuadros `P` (*Predicted*)** que solo guardan los vectores de movimiento y diferencias respecto al cuadro anterior, y **Cuadros `B` (*Bi-predictive*)** que interpolan diferencias tanto hacia atrás como hacia adelante.
* **Tasa de Bits (*Bitrate*: `CBR` vs. `VBR`):** Cantidad de datos transmitidos o almacenados por segundo (medida habitualmente en `Mbps`) que define el equilibrio entre fidelidad visual y peso del archivo. En **Bitrate Constante (`CBR`)** se mantiene una tasa fija durante toda la duración —útil en transmisiones en vivo con ancho de banda acotado—, mientras que en **Bitrate Variable (`VBR`)** el codificador asigna más bits a escenas complejas con abundante movimiento y menos bits a escenas estáticas, logrando mayor eficiencia de compresión (Stanković et al., 2016; Ojeda Linares, 2012).

<figure class="media-container topic-figure">
  <picture>
    <source type="image/avif" srcset="../../../images/temas/u3/3-1-1-panel-etalonaje-davinci-480.avif 480w, ../../../images/temas/u3/3-1-1-panel-etalonaje-davinci-960.avif 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <source type="image/webp" srcset="../../../images/temas/u3/3-1-1-panel-etalonaje-davinci-480.webp 480w, ../../../images/temas/u3/3-1-1-panel-etalonaje-davinci-960.webp 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <img src="../../../images/temas/u3/3-1-1-panel-etalonaje-davinci-960.webp" alt="Superficie de control física Blackmagic Design DaVinci Resolve Mini Panel con tres bolas de seguimiento cromático, pantallas LCD de ganancia RGB y temperatura de color, y controles dedicados de posproducción de video." width="960" height="598" loading="lazy" decoding="async" />
  </picture>
  <figcaption><strong>Figura 3.1.</strong> Panel físico de corrección primaria y etalonaje (<em>DaVinci Resolve Mini Panel</em>): control de luminancia, balance <code>RGB</code>, temperatura y nodos durante la posproducción no destructiva de video.<span class="topic-figure__credit">Fotografía: TaurusEmerald / Wikimedia Commons (CC BY-SA 4.0).</span></figcaption>
</figure>

## Fases del Montaje Audiovisual y Protocolos de Streaming Adaptativo (HLS y MPEG-DASH)

El flujo de trabajo profesional de edición comprende cinco fases secuenciales:

1. **Ingesta, catalogación y generación de *Proxies*:** Organización del material fuente y creación de copias ligeras de baja resolución para editar fluidamente sin saturar la `CPU`/`GPU`, reconectando los archivos `4K` originales al exportar.
2. **Corte en bruto (*Rough Cut*) y Corte fino (*Fine Cut*):** Estructuración narrativa aplicando cortes directos, cortes en `J`/`L` (*split edits* donde el audio entra antes o después de la imagen) y transiciones (fundidos *fade in/out* y disolvencias encadenadas).
3. **Composición, incrustación (*Chroma Key*) y titulación:** Integración de gráficos, capas de texto y recortes de fondo.
4. **Corrección de color primaria y etalonaje (*Color Grading*):** Ajuste cromático asistido por instrumentos vectoriales: **Histograma**, **Monitor de Forma de Onda (*Waveform*)** para luminancia y **Vectorscopio** para saturación y tonos de piel.
5. **Exportación o transcodificación para *Streaming* Adaptativo (`ABR`):** Codificación final optimizada según el medio de entrega.

Para distribuir video en sistemas informáticos web sin pausas de almacenamiento en búfer (*buffering*), se emplean los protocolos **`HLS` (*HTTP Live Streaming*, de Apple)** y **`MPEG-DASH` (estándar `ISO`)**: el servidor codifica el video simultáneamente en una escalera de calidades (*Bitrate Ladder*, por ejemplo `1080p` a `5 Mbps`, `720p` a `2.5 Mbps` y `480p` a `1 Mbps`), divide cada versión en pequeños fragmentos de `2` a `6` segundos (`.ts` o `.m4s`) y publica un archivo manifiesto de índice (`.m3u8` en `HLS` o `.mpd` en `DASH`) para que el reproductor del cliente cambie de calidad dinámicamente según su velocidad de red en cada instante.

## Conclusiones

> La edición de video digital en las ciencias de la informática combina el arte narrativo del montaje con la ingeniería de señales: dominar la estructura de cuadros `I`/`P`/`B`, el submuestreo de crominancia, el `Bitrate` y los protocolos de *streaming* adaptativo (`HLS`/`MPEG-DASH`) permite diseñar plataformas audiovisuales nítidas y fluidas en cualquier red.

## Fuentes Documentales

* González, R. C., & Woods, R. E. (2017). *Digital Image Processing* (4th ed.). Pearson Education.
* Ojeda Linares, N. D. (2012). *Introducción a la multimedia* (Unidad 4: Sonido y Video Digital). Red Tercer Milenio.
* Ruiz, D. (2018). *Manual de Producción Multimedia: De la idea al remake*. Ediciones Promonet.
* Stanković, S., Orović, I., & Sejdić, E. (2016). *Multimedia Signals and Systems*. Springer.
