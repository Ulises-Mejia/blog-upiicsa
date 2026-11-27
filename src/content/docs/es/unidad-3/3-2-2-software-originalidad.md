---
title: "Software de Originalidad y Detección de Plagio"
description: "Verificación de originalidad en textos académicos y código fuente (AST, SCA), junto con mecanismos criptográficos de autenticidad multimedia: SHA-256, marcas de agua y C2PA."
---

## Introducción

En la era digital, donde cualquier archivo de código fuente, fotografía, pista de audio, video o documento académico puede copiarse y redistribuirse en milisegundos sin degradación de calidad, surgen dos retos críticos para la ingeniería en informática: ¿cómo verificamos técnicamente que un trabajo, código o activo multimedia es **original** y no una copia no autorizada?, y ¿cómo incrustamos en nuestros propios archivos una **huella digital o marca de agua invisible** que demuestre matemáticamente nuestra autoría y garantice que el archivo no ha sido alterado? Ese es el campo del **software de originalidad, trazabilidad criptográfica y protección de integridad multimedia** (Mihelič et al., 2023; González & Woods, 2017).

## Verificación de Originalidad en Texto y Código Fuente (Similitud Léxica, Semántica y Árboles AST)

El software de verificación de originalidad —conocido también como sistemas antiplagio y de auditoría de propiedad intelectual de software— opera en dos dominios distintos:

* **1. Análisis de Originalidad Documental y Académica:** Plataformas como **Turnitin**, **iThenticate**, **Compilatio** o **Copyleaks** comparan los documentos contra bases de datos de miles de millones de páginas web y artículos científicos (como Crossref, SciELO, IEEE y Springer). A nivel algorítmico, no solo buscan coincidencias exactas de cadenas de texto (*n-gramas* y huellas digitales mediante los algoritmos **Winnowing / Rabin-Karp**), sino que aplican procesamiento de lenguaje natural (`NLP`) y vectores de incrustación semántica (*embeddings*) para detectar paráfrasis encubiertas, traducciones cruzadas entre idiomas y texto sintético.
* **2. Análisis de Originalidad y Similitud en Código Fuente (`AST` y Auditoría de Licencias `SCA`):** Si un programador copia un algoritmo de otro repositorio y solo cambia los nombres de las variables (`x` por `contador`) o agrega comentarios, un comparador de texto simple fallaría. Por ello, herramientas académicas e industriales como **MOSS (*Measure of Software Similarity*, de la Universidad de Stanford)**, **JPlag** y plataformas de **Análisis de Composición de Software (`SCA`, como Black Duck, SonarQube o Snyk)** analizan léxica y sintácticamente el código para construir su **Árbol de Sintaxis Abstracta (*Abstract Syntax Tree*, `AST`)** y su grafo de flujo de control, detectando copias estructurales de algoritmos y verificando que no se hayan incrustado fragmentos de código con licencias incompatibles o vulnerabilidades dentro del proyecto multimedia (Mihelič et al., 2023).

<figure class="media-container topic-figure topic-figure--bright-bg">
  <picture>
    <source type="image/avif" srcset="../../../images/temas/u3/3-2-2-analisis-codigo-sonarqube-480.avif 480w, ../../../images/temas/u3/3-2-2-analisis-codigo-sonarqube-960.avif 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <source type="image/webp" srcset="../../../images/temas/u3/3-2-2-analisis-codigo-sonarqube-480.webp 480w, ../../../images/temas/u3/3-2-2-analisis-codigo-sonarqube-960.webp 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <img src="../../../images/temas/u3/3-2-2-analisis-codigo-sonarqube-960.webp" alt="Tablero de análisis estático y auditoría de calidad de código en SonarQube mostrando compuertas de calidad, métricas de seguridad, confiabilidad, mantenibilidad, cobertura y porcentaje de duplicaciones de código." width="960" height="541" loading="lazy" decoding="async" />
  </picture>
  <figcaption><strong>Figura 3.4.</strong> Auditoría automatizada de calidad, duplicaciones de código y seguridad en <em>SonarQube</em>: verificación objetiva de originalidad técnica e integridad de dependencias dentro de proyectos de software.<span class="topic-figure__credit">Captura: Felicitousavians / Wikimedia Commons (CC BY-SA 4.0).</span></figcaption>
</figure>

## Autenticidad e Integridad de Activos Multimedia: Funciones Hash (SHA-256), Marcas de Agua Digitales y C2PA

Para proteger y verificar la originalidad de los activos audiovisuales (imágenes, audio, video y modelos `3D`) se emplean tres mecanismos matemáticos complementarios:

* **Funciones Resumen Criptográficas (*Cryptographic Hash Functions* — `SHA-256`):** Aplican una función matemática unidireccional sobre los bytes del archivo o paquete de código fuente para producir una cadena hexadecimal única de `256 bits` (`64` caracteres). Si un atacante modifica un solo bit de un píxel o una línea de código, el *hash* **`SHA-256`** cambia por completo (efecto avalancha), garantizando la **integridad inmutable** del paquete antes de su registro legal o despliegue.
* **Marcas de Agua Digitales Invisibles (*Digital Watermarking*) y Huellas Perceptuales (*Perceptual Hashing*):** A diferencia del *hash* `SHA-256` (que cambia si la imagen se recomprime a `JPEG`), el **Perceptual Hash (`pHash`)** y sistemas como **Content ID** generan una huella basada en las frecuencias visuales o acústicas dominantes, permitiendo detectar si un video o canción protegida fue resubida aunque se haya modificado su resolución o formato. A su vez, el ***Digital Watermarking* en el dominio de la frecuencia** (González & Woods, 2017; Stanković et al., 2016) incrusta un código binario de propiedad del autor directamente en los coeficientes de frecuencia media de la **Transformada Discreta del Coseno (`DCT`)** o de la **Transformada Wavelet Discreta (`DWT`)** de la imagen o audio, de modo que la marca permanece invisible al ojo humano pero sobrevive a recortes y compresiones.
* **Metadatos de Procedencia Criptográfica (`EXIF`/`XMP` y Estándar `C2PA`):** El estándar abierto **`C2PA` (*Coalition for Content Provenance and Authenticity*)** permite firmar criptográficamente el historial de creación y edición de un activo multimedia desde la cámara o el software de autoría.

## Conclusiones

> Integrar herramientas de verificación de originalidad (sobre textos, árboles `AST` de código y dependencias `SCA`) junto con mecanismos criptográficos (`SHA-256`, `C2PA` y marcas de agua invisibles en el dominio de la frecuencia) constituye una práctica esencial de auditoría y aseguramiento de la calidad en la ingeniería ágil de software seguro (`AESS`) (Mihelič et al., 2023).

## Fuentes Documentales

* González, R. C., & Woods, R. E. (2017). *Digital Image Processing* (4th ed., Cap. 8: Digital Image Watermarking). Pearson Education.
* Mihelič, A., Hovelja, T., & Vrhovec, S. (2023). Identifying Key Activities, Artifacts and Roles in Agile Engineering of Secure Software with Hierarchical Clustering. *Applied Sciences*, 13(7), 4563.
* Stanković, S., Orović, I., & Sejdić, E. (2016). *Multimedia Signals and Systems*. Springer.
