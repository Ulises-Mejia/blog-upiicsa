---
title: "La Evolución de la Computación Gráfica en la Multimedia"
description: "Recorrido histórico de la computación gráfica en la multimedia, desde los precursores conceptuales y primeras interfaces gráficas hasta las GPU programables modernas."
---

## Introducción

Hoy resulta natural que un teléfono inteligente renderice mundos tridimensionales con sombras suaves y reflejos en tiempo real a 120 cuadros por segundo. Sin embargo, en la década de 1950 las computadoras ocupaban habitaciones enteras y solo entregaban resultados mediante tarjetas perforadas o teletipos de papel. La evolución de la computación gráfica es la historia de cómo transformamos los números binarios abstractos de la memoria en imágenes interactivas en pantalla, pasando de trazar líneas verdes en osciloscopios militares a las actuales Unidades de Procesamiento Gráfico (GPUs) con miles de núcleos paralelos (Marschner & Shirley, 2016).

## De los Precursores Conceptuales a las Primeras Interfaces Gráficas (1945–1980)

La genealogía de la computación gráfica y la multimedia interactiva se articula en hitos fundacionales que pueden explorarse cronológicamente (Ojeda Linares, 2012; Adell, 2021):

<ol class="editorial-timeline" aria-label="Hitos fundacionales de la computación gráfica (1945–1980)">
  <li>
    <details class="editorial-timeline__item" open>
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">1945</span><span class="editorial-timeline__title">El Memex de Vannevar Bush</span></summary>
      <div class="editorial-timeline__body"><p>En su ensayo <em>As We May Think</em>, Bush concibió un escritorio electromecánico capaz de almacenar libros, fotografías y notas enlazándolos por asociación de ideas en lugar de índices alfabéticos, sentando la base teórica de la hipermedia.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">1963</span><span class="editorial-timeline__title">Sketchpad de Ivan Sutherland (MIT)</span></summary>
      <div class="editorial-timeline__body"><p>Considerado el nacimiento de la computación gráfica interactiva moderna y del diseño asistido por computadora (CAD). Utilizando un lápiz óptico sobre un monitor vectorial CRT, Sutherland introdujo estructuras de datos jerárquicas de objetos gráficos, restricciones geométricas y zoom interactivo.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">1965–1968</span><span class="editorial-timeline__title">Proyecto Xanadu (Ted Nelson) y sistema NLS (Douglas Engelbart)</span></summary>
      <div class="editorial-timeline__body"><p>Nelson acuñó los términos <em>hipertexto</em> e <em>hipermedia</em>, mientras que Engelbart demostró en <em>The Mother of All Demos</em> (1968) el primer ratón (<em>mouse</em>), ventanas múltiples, videoconferencia en pantalla y edición colaborativa en tiempo real.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Década de 1970</span><span class="editorial-timeline__title">Del display vectorial al framebuffer raster (Xerox PARC y Universidad de Utah)</span></summary>
      <div class="editorial-timeline__body"><p>Se sustituyeron los monitores vectoriales por pantallas de barrido (<em>raster</em>) respaldadas por una memoria de cuadro (<em>framebuffer</em>) donde cada píxel correspondía a una dirección de memoria RAM. Pioneros como Gouraud, Phong, Catmull y Blinn formularon los algoritmos de sombreado suave, mapeo de texturas, curvas spline y el búfer de profundidad (<em>Z-Buffer</em>) (Marschner &amp; Shirley, 2016).</p></div>
    </details>
  </li>
</ol>

<figure class="media-container topic-figure">
  <picture>
    <source type="image/avif" srcset="../../../images/temas/u1/1-1-2-xerox-alto-480.avif 480w, ../../../images/temas/u1/1-1-2-xerox-alto-960.avif 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <source type="image/webp" srcset="../../../images/temas/u1/1-1-2-xerox-alto-480.webp 480w, ../../../images/temas/u1/1-1-2-xerox-alto-960.webp 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <img src="../../../images/temas/u1/1-1-2-xerox-alto-960.webp" alt="Estación de trabajo histórica Xerox Alto I de 1973 con monitor raster vertical, teclado principal, teclado de acordes de cinco teclas y ratón de tres botones." width="960" height="768" loading="lazy" decoding="async" />
  </picture>
  <figcaption><strong>Figura 1.2.</strong> Estación de trabajo <em>Xerox Alto I</em> (1973, Xerox PARC): hito en la transición hacia pantallas <em>raster</em> con <em>framebuffer</em>, interfaz gráfica y ratón.<span class="topic-figure__credit">Fotografía: The wub (Computer History Museum) / Wikimedia Commons (CC BY-SA 4.0).</span></figcaption>
</figure>

## La Era de la Multimedia Personal y las GPUs Programables (1987–Actualidad)

A partir de finales de los años ochenta, la evolución gráfica aceleró su llegada al usuario final a través de tres grandes etapas tecnológicas:

<ol class="editorial-timeline" aria-label="Evolución de la multimedia personal y las GPU programables (1987–Actualidad)">
  <li>
    <details class="editorial-timeline__item" open>
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">1987</span><span class="editorial-timeline__title">Autoría Hipermedia Personal (Apple HyperCard)</span></summary>
      <div class="editorial-timeline__body"><p>Apple lanzó <strong>HyperCard</strong>, el primer sistema de autoría hipermedia masivo basado en la metáfora de pilas de tarjetas interactivas enlazables mediante guiones.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">1990</span><span class="editorial-timeline__title">El estándar MPC (Multimedia Personal Computer)</span></summary>
      <div class="editorial-timeline__body"><p>Un consorcio liderado por Microsoft estableció la especificación <code>MPC</code>, que incorporó unidades de <code>CD-ROM</code> (650 MB) y tarjetas de sonido de 16 bits a las computadoras personales (Ojeda Linares, 2012).</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">1999–Actualidad</span><span class="editorial-timeline__title">GPUs programables y trazado de rayos en tiempo real</span></summary>
      <div class="editorial-timeline__body"><p>Con la introducción de la primera <code>GPU</code> dedicada (GeForce 256) y las especificaciones <code>OpenGL 2.0</code> / <code>DirectX 9</code>, el hardware gráfico abandonó el pipeline de función fija para adoptar un <strong>pipeline de sombreadores programables (<em>programmable shaders</em>)</strong>, culminando en las arquitecturas actuales con trazado de rayos acelerado por hardware y reconstrucción por inteligencia artificial (Marschner &amp; Shirley, 2016).</p></div>
    </details>
  </li>
</ol>

## Conclusiones

> Comprender la evolución de la computación gráfica demuestra que cada salto en la expresividad de las herramientas multimedia ha sido impulsado por innovaciones matemáticas en estructuras de datos y por la transición del procesamiento secuencial en `CPU` al paralelismo masivo en `GPU`.

## Fuentes Documentales

* Adell, F. (2021). *Fundamentos y evolución de la multimedia*. Universitat Oberta de Catalunya (UOC).  
* Marschner, S., & Shirley, P. (2016). *Fundamentals of Computer Graphics* (4th ed.). CRC Press.  
* Ojeda Linares, N. D. (2012). *Introducción a la multimedia*. Red Tercer Milenio.
