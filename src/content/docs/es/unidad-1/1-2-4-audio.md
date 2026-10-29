---
title: "Procesamiento Digital de Audio"
description: "Plantilla académica para 1.2.4: Procesamiento Digital de Audio"
---

## Introducción

Cuando hablas frente al micrófono de tu computadora en una reunión virtual, tus cuerdas vocales generan variaciones continuas de presión en el aire que viajan como ondas acústicas. Para que tu voz pueda viajar por internet, limpiarse del ruido del ventilador de tu cuarto y escucharse con nitidez al otro lado del mundo, la tarjeta de sonido debe medir esa onda miles de veces por segundo y transformarla en una serie de números binarios. El **procesamiento digital de audio (DSP)** estudia las leyes físicas y matemáticas que gobiernan la captura, representación, filtrado y síntesis del sonido en los sistemas informáticos (Stanković et al., 2016; Ojeda Linares, 2012).

## Propiedades Físicas del Sonido y Conversión Analógico-Digital (Teorema de Nyquist)

El sonido es una onda mecánica longitudinal caracterizada por tres parámetros físicos: **Frecuencia** (número de ciclos u oscilaciones por segundo medido en Hercios, **Hz**, que determina el tono grave o agudo; el espectro audible humano abarca de **20 Hz a 20,000 Hz** o 20 kHz), **Amplitud** (magnitud de la presión sonora medida logarítmicamente en decibelios, **dB**, que determina el volumen o intensidad) y **Timbre o Espectro Armónico** (combinación de la frecuencia fundamental y sus sobretonos o armónicos que permite distinguir un violín de un piano tocando la misma nota) (Ojeda Linares, 2012).

La conversión de la señal eléctrica analógica del micrófono a datos binarios mediante un convertidor Analógico-Digital (ADC) usando **Modulación por Impulsos Codificados (PCM)** comprende dos pasos regidos por leyes exactas (Stanković et al., 2016):

* **Frecuencia de Muestreo (*Sampling Rate*) y Teorema de Nyquist-Shannon:** El teorema demuestra que para reconstruir sin pérdida una señal analógica cuya frecuencia máxima es $f_{max}$, la frecuencia de muestreo $f_s$ debe ser estrictamente mayor o igual al doble de dicha frecuencia máxima: $f_s \ge 2 \cdot f_{max}$ (frecuencia de Nyquist). Como el oído humano percibe hasta $20\text{ kHz}$, el estándar de calidad CD muestrea a **44,100 Hz (44.1 kHz)** y el estándar de video profesional a **48,000 Hz (48 kHz)**. Si se muestrea por debajo del límite de Nyquist, las frecuencias altas se pliegan generando tonos falsos conocidos como ***aliasing*** **auditivo**.  
* **Profundidad de Bits (*Bit Depth*) y Rango Dinámico:** Define cuántos bits se usan para cuantificar la amplitud de cada muestra. Cada bit adicional aporta aproximadamente **6.02 dB** de relación señal-ruido ($SNR \approx 6.02 \cdot N + 1.76\text{ dB}$): un audio de **16 bits** ($65,536$ niveles) ofrece un rango dinámico de **96 dB**, mientras que **24 bits** ($16.7$ millones de niveles) alcanza **144 dB**, evitando el ruido de cuantificación y la saturación o recorte (*clipping*) digital.

## Procesamiento en el Dominio del Tiempo y de la Frecuencia (FFT y Filtros)

Mediante la **Transformada Rápida de Fourier (FFT)** y la Transformada de Fourier de Tiempo Corto (STFT), una señal de audio se descompone de su representación temporal (amplitud vs. tiempo) a su representación espectral (energía vs. frecuencia) (Stanković et al., 2016). Esto permite aplicar operaciones esenciales en la producción multimedia: **ecualización paramétrica y filtrado** (filtros pasa-altas *High-Pass* para eliminar el retumbo grave debajo de 80 Hz, pasa-bajas *Low-Pass* y rechaza-banda *Notch* para suprimir zumbidos eléctricos de 60 Hz), **compresión de rango dinámico** (que reduce la diferencia entre los pasajes más fuertes y los más suaves de una locución para mantener una voz uniforme), **sustracción espectral de ruido** (aislando la huella de ruido estacionario de fondo) y **espacialización 3D / audio binaural** (aplicando funciones de transferencia relacionadas con la cabeza, *HRTF*, en motores de videojuegos y realidad virtual).

## Conclusiones

El procesamiento digital de audio fundamentado en el Teorema de Nyquist y el análisis espectral de Fourier permite capturar, limpiar y comprimir señales sonoras con calidad profesional, garantizando que el componente auditivo de cualquier sistema multimedia sea claro, envolvente y eficiente en su uso de ancho de banda.

## Fuentes Documentales

* Ojeda Linares, N. D. (2012). *Introducción a la multimedia* (Unidad 4: Sonido y Video Digital). Red Tercer Milenio.  
* Stanković, S., Orović, I., & Sejdić, E. (2016). *Multimedia Signals and Systems: Basic and Advanced Algorithms for Signal Processing*. Springer.
