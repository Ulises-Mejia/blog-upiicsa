---
title: "Procesamiento Digital de Audio"
description: "Fundamentos del procesamiento digital de audio: propiedades físicas del sonido, conversión analógico-digital bajo el Teorema de Nyquist, FFT y filtrado en frecuencia."
---

## Introducción

Cuando hablas frente al micrófono de tu computadora en una reunión virtual, tus cuerdas vocales generan variaciones continuas de presión en el aire que viajan como ondas acústicas. Para que tu voz pueda viajar por internet, limpiarse del ruido del ventilador de tu cuarto y escucharse con nitidez al otro lado del mundo, la tarjeta de sonido debe medir esa onda miles de veces por segundo y transformarla en una serie de números binarios. El **procesamiento digital de audio (DSP)** estudia las leyes físicas y matemáticas que gobiernan la captura, representación, filtrado y síntesis del sonido en los sistemas informáticos (Stanković et al., 2016; Ojeda Linares, 2012).

## Propiedades Físicas del Sonido y Conversión Analógico-Digital (Teorema de Nyquist)

El sonido es una onda mecánica longitudinal caracterizada por tres parámetros físicos: **Frecuencia** (número de ciclos u oscilaciones por segundo medido en Hercios, **Hz**, que determina el tono grave o agudo; el espectro audible humano abarca de **20 Hz a 20,000 Hz** o 20 kHz), **Amplitud** (magnitud de la presión sonora medida logarítmicamente en decibelios, **dB**, que determina el volumen o intensidad) y **Timbre o Espectro Armónico** (combinación de la frecuencia fundamental y sus sobretonos o armónicos que permite distinguir un violín de un piano tocando la misma nota) (Ojeda Linares, 2012).

La conversión de la señal eléctrica analógica del micrófono a datos binarios mediante un convertidor Analógico-Digital (ADC) usando **Modulación por Impulsos Codificados (PCM)** comprende dos pasos regidos por leyes exactas (Stanković et al., 2016):

* **Frecuencia de Muestreo (*Sampling Rate*) y Teorema de Nyquist-Shannon:** El teorema demuestra que para reconstruir sin pérdida una señal analógica cuya frecuencia máxima es *f*<sub>máx</sub>, la frecuencia de muestreo *f*<sub>s</sub> debe ser estrictamente mayor o igual al doble de dicha frecuencia máxima: *f*<sub>s</sub> ≥ 2 · *f*<sub>máx</sub> (frecuencia de Nyquist). Como el oído humano percibe hasta 20 kHz, el estándar de calidad CD muestrea a **44,100 Hz (44.1 kHz)** y el estándar de video profesional a **48,000 Hz (48 kHz)**. Si se muestrea por debajo del límite de Nyquist, las frecuencias altas se pliegan generando tonos falsos conocidos como ***aliasing*** **auditivo**.  
* **Profundidad de Bits (*Bit Depth*) y Rango Dinámico:** Define cuántos bits se usan para cuantificar la amplitud de cada muestra. Cada bit adicional aporta aproximadamente **6.02 dB** de relación señal-ruido (SNR ≈ 6.02 · *N* + 1.76 dB): un audio de **16 bits** (65,536 niveles) ofrece un rango dinámico de **96 dB**, mientras que **24 bits** (16.7 millones de niveles) alcanza **144 dB**, evitando el ruido de cuantificación y la saturación o recorte (*clipping*) digital.

<figure class="media-container topic-figure">
  <picture>
    <source type="image/avif" srcset="../../../images/temas/u1/1-2-4-consola-mezcla-audio-480.avif 480w, ../../../images/temas/u1/1-2-4-consola-mezcla-audio-960.avif 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <source type="image/webp" srcset="../../../images/temas/u1/1-2-4-consola-mezcla-audio-480.webp 480w, ../../../images/temas/u1/1-2-4-consola-mezcla-audio-960.webp 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <img src="../../../images/temas/u1/1-2-4-consola-mezcla-audio-960.webp" alt="Primer plano de una consola de mezcla de audio de estudio con atenuadores calibrados en decibelios, módulo de procesamiento digital DSP, perillas de ecualización paramétrica y vúmetro LED de nivel pico." width="960" height="639" loading="lazy" decoding="async" />
  </picture>
  <figcaption><strong>Figura 1.8.</strong> Consola de mezcla de estudio con atenuadores en decibelios (<code>dB</code>), bus de procesamiento digital (<code>DSP</code>), controles de ecualización y medidor de picos para evitar el recorte (<em>clipping</em>) de señal.<span class="topic-figure__credit">Fotografía: Shixart1985 / Wikimedia Commons (CC BY 2.0).</span></figcaption>
</figure>

## Procesamiento en el Dominio del Tiempo y de la Frecuencia (FFT y Filtros)

Mediante la **Transformada Rápida de Fourier (`FFT`)** y la Transformada de Fourier de Tiempo Corto (`STFT`), una señal de audio se descompone de su representación temporal (amplitud vs. tiempo) a su representación espectral (energía vs. frecuencia) (Stanković et al., 2016). Esto permite aplicar cuatro operaciones esenciales en la producción multimedia:

* **Ecualización paramétrica y filtrado:** Uso de filtros pasa-altas (*High-Pass*) para eliminar el retumbo grave debajo de `80 Hz`, pasa-bajas (*Low-Pass*) y rechaza-banda (*Notch*) para suprimir zumbidos eléctricos de línea (`60 Hz`).
* **Compresión de rango dinámico:** Reduce la diferencia entre los pasajes más fuertes y los más suaves de una locución para mantener una voz uniforme e inteligible.
* **Sustracción espectral de ruido:** Aísla y atenúa la huella de ruido estacionario de fondo (como aire acondicionado o ventiladores).
* **Espacialización 3D y audio binaural:** Aplica funciones de transferencia relacionadas con la cabeza (`HRTF`) en motores de videojuegos y entornos de realidad virtual.

## Conclusiones

> El procesamiento digital de audio fundamentado en el **Teorema de Nyquist** y el análisis espectral de **Fourier (`FFT`)** permite capturar, limpiar y comprimir señales sonoras con calidad profesional, garantizando que el componente auditivo de cualquier sistema multimedia sea claro, envolvente y eficiente en su consumo de ancho de banda.

## Fuentes Documentales

* Ojeda Linares, N. D. (2012). *Introducción a la multimedia* (Unidad 4: Sonido y Video Digital). Red Tercer Milenio.  
* Stanković, S., Orović, I., & Sejdić, E. (2016). *Multimedia Signals and Systems: Basic and Advanced Algorithms for Signal Processing*. Springer.
