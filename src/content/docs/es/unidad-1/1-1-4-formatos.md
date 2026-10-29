---
title: "Formatos de Imagen, Audio, Video y Texto"
description: "Plantilla académica para 1.1.4: Formatos de Imagen, Audio, Video y Texto"
---

## Introducción

Imagina que tomas una fotografía con una cámara de 24 megapíxeles o grabas un minuto de video en resolución 4K a 60 cuadros por segundo. Sin ningún tipo de compresión matemática, ese solo minuto de video crudo ocuparía más de **28 gigabytes** de almacenamiento y sería imposible transmitirlo por internet en tiempo real. Los **formatos de archivo y códecs multimedia** son las estructuras de datos y algoritmos matemáticos que organizan, empaquetan y comprimen la información digital, decidiendo qué bits son indispensables para nuestros sentidos y cuáles pueden descartarse o compactarse sin que percibamos la diferencia (González & Woods, 2017; Stanković et al., 2016).

## Teoría de la Compresión: Sin Pérdida (Lossless) vs. Con Pérdida (Lossy)

Como demuestran González y Woods (2017, Cap. 8) y Stanković et al. (2016), los datos multimedia sin procesar contienen tres tipos de redundancia: **redundancia de codificación** (símbolos muy frecuentes codificados con el mismo número de bits que símbolos raros), **redundancia espacial y temporal** (píxeles vecinos del mismo color en una imagen o fondos idénticos entre fotogramas consecutivos de un video) y **redundancia psicovisual o psicoacústica** (frecuencias de luz o de sonido que el ojo o el oído humano son físicamente incapaces de distinguir):

* **Compresión Sin Pérdida (*Lossless*):** Elimina únicamente la redundancia estadística y espacial mediante algoritmos como *Run-Length Encoding (RLE)*, diccionarios *LZ77 / LZW* y codificación de entropía de *Huffman* o *Aritmética* (por ejemplo, el algoritmo **DEFLATE** en PNG o **FLAC** en audio). Al descomprimir el archivo, se recupera bit a bit exactamente la misma matriz original. Es obligatoria para código fuente, texto, diagramas técnicos, logotipos con bordes duros e imágenes médicas.  
* **Compresión Con Pérdida (*Lossy*):** Transforma la señal del dominio espacial/temporal al dominio de la frecuencia mediante transformadas ortogonales —como la **Transformada Discreta del Coseno (DCT)** en JPEG/H.264 o la **Transformada Discreta del Coseno Modificada (MDCT)** en MP3/AAC (Stanković et al., 2016)— y cuantifica (redondea a cero) los coeficientes de alta frecuencia o enmascarados psicoacústicamente, logrando reducciones de peso de **10:1 a 100:1** a cambio de una pérdida irreversible controlada.

## Anatomía de los Formatos de Imagen, Audio, Video (Contenedor vs. Códec) y Texto

* **Formatos de Imagen:** Se dividen en rasterizados con pérdida (**JPEG**, basado en DCT en bloques de $8 \times 8$ píxeles a 24 bits sin transparencia), rasterizados sin pérdida (**PNG-8/24/32**, con algoritmo DEFLATE y canal alfa de 8 bits; **GIF**, limitado a paleta indexada de 256 colores con LZW), híbridos modernos (**WebP** basado en VP8 y **AVIF** basado en AV1, que admiten modos con y sin pérdida, HDR de 10/12 bits y transparencia ahorrando un 30–50 % de peso frente a JPEG) y vectoriales (**SVG**, basado en XML para primitivas matemáticas escalables).  
* **Formatos de Audio:** Incluyen formatos sin comprimir basados en Modulación por Impulsos Codificados (**WAV** y **AIFF**), formatos comprimidos sin pérdida (**FLAC** y **ALAC**), formatos comprimidos con pérdida psicoacústica (**MP3**, **AAC**, **OGG Vorbis** y **Opus**) y protocolos simbólicos de partitura digital (**MIDI**, que no almacena ondas de sonido sino eventos de nota, intensidad e instrumento ocupando apenas unos kilobytes) (Ojeda Linares, 2012).  
* **Formatos de Video (Diferencia entre Contenedor y Códec):** En ingeniería multimedia es crucial distinguir el **contenedor** (la «caja» o estructura de archivo que empaqueta pistas de video, varias pistas de audio, subtítulos y metadatos, como **MP4 `.mp4`**, **Matroska `.mkv`**, **WebM `.webm`** o **QuickTime `.mov`**) del **códec** (el algoritmo matemático que comprime y descomprime los fotogramas mediante predicción intra-cuadro *I-frames* e inter-cuadro *P-frames* y *B-frames*, como **H.264/AVC**, **H.265/HEVC**, **VP9** y el estándar abierto libre de regalías **AV1**).  
* **Formatos de Texto y Documentos:** Abarcan desde texto plano (**TXT** codificado en **UTF-8**), lenguajes de marcado e intercambio (**HTML**, **XML**, **JSON**, **Markdown `.md`**) hasta formatos de diseño fijo o procesador (**PDF** vectorial/compuesto, **RTF** y **DOCX** basado en OpenXML).

## Conclusiones

Seleccionar el formato y códec adecuados exige equilibrar tres variables en tensión: fidelidad perceptual, peso de almacenamiento/ancho de banda y costo computacional de decodificación en el dispositivo cliente.

## Fuentes Documentales

* González, R. C., & Woods, R. E. (2017). *Digital Image Processing* (4th ed., Cap. 8: Image Compression). Pearson.  
* Marschner, S., & Shirley, P. (2016). *Fundamentals of Computer Graphics* (4th ed.). CRC Press.  
* Ojeda Linares, N. D. (2012). *Introducción a la multimedia* (Unidades 3 y 4). Red Tercer Milenio.  
* Stanković, S., Orović, I., & Sejdić, E. (2016). *Multimedia Signals and Systems*. Springer.
