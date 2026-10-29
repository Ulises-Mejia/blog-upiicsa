---
title: "La Evolución de la Computación Gráfica en la Multimedia"
description: "Plantilla académica para 1.1.2: La Evolución de la Computación Gráfica en la Multimedia"
---

## Introducción

Hoy resulta natural que un teléfono inteligente renderice mundos tridimensionales con sombras suaves y reflejos en tiempo real a 120 cuadros por segundo. Sin embargo, en la década de 1950 las computadoras ocupaban habitaciones enteras y solo entregaban resultados mediante tarjetas perforadas o teletipos de papel. La evolución de la computación gráfica es la historia de cómo transformamos los números binarios abstractos de la memoria en imágenes interactivas en pantalla, pasando de trazar líneas verdes en osciloscopios militares a las actuales Unidades de Procesamiento Gráfico (GPUs) con miles de núcleos paralelos (Marschner & Shirley, 2016).

## De los Precursores Conceptuales a las Primeras Interfaces Gráficas (1945–1980)

La genealogía de la computación gráfica y la multimedia interactiva se articula en cinco hitos fundacionales (Ojeda Linares, 2012; Adell, 2021):

* **1945 — El Memex de Vannevar Bush:** En su ensayo *As We May Think*, Bush concibió un escritorio electromecánico capaz de almacenar libros, fotografías y notas enlazándolos por asociación de ideas en lugar de índices alfabéticos, sentando la base teórica de la hipermedia.  
* **1963 — Sketchpad de Ivan Sutherland (MIT):** Considerado el nacimiento de la computación gráfica interactiva moderna y del diseño asistido por computadora (CAD). Utilizando un lápiz óptico sobre un monitor vectorial CRT, Sutherland introdujo estructuras de datos jerárquicas de objetos gráficos, restricciones geométricas y zoom interactivo.  
* **1965–1968 — Proyecto Xanadu (Ted Nelson) y el sistema NLS (Douglas Engelbart):** Nelson acuñó los términos *hipertexto* e *hipermedia*, mientras que Engelbart demostró en *The Mother of All Demos* (1968) el primer ratón (*mouse*), ventanas múltiples, videoconferencia en pantalla y edición colaborativa en tiempo real.  
* **Década de 1970 — Del Display Vectorial al Framebuffer Raster (Xerox PARC y Universidad de Utah):** Se sustituyeron los monitores vectoriales por pantallas de barrido (*raster*) respaldadas por una memoria de cuadro (*framebuffer*) donde cada píxel correspondía a una dirección de memoria RAM. En esta etapa, pioneros como Gouraud, Phong, Catmull y Blinn formularon los algoritmos de sombreado suave, mapeo de texturas, curvas spline y el búfer de profundidad (*Z-Buffer*) (Marschner & Shirley, 2016).

## La Era de la Multimedia Personal y las GPUs Programables (1987–Actualidad)

En **1987**, Apple lanzó **HyperCard**, el primer sistema de autoría hipermedia masivo basado en la metáfora de pilas de tarjetas interactivas. En **1990**, un consorcio liderado por Microsoft estableció el estándar **MPC (Multimedia Personal Computer)**, que incorporó unidades de CD-ROM (650 MB) y tarjetas de sonido de 16 bits a las computadoras personales (Ojeda Linares, 2012). Finalmente, a partir de **1999** (con la aparición del término GPU con la GeForce 256) y la llegada de **OpenGL 2.0 / DirectX 9**, el hardware gráfico abandonó el pipeline de función fija (*fixed-function pipeline*) para adoptar un **pipeline de sombreadores programables (*programmable shaders*)**, culminando en las arquitecturas actuales capaces de ejecutar trazado de rayos en tiempo real (*hardware-accelerated ray tracing*) y reconstrucción de imagen por inteligencia artificial (Marschner & Shirley, 2016).

## Conclusiones

Comprender la evolución de la computación gráfica demuestra que cada salto en la expresividad de las herramientas multimedia ha sido impulsado por innovaciones matemáticas en estructuras de datos y por la transición del procesamiento secuencial en CPU al paralelismo masivo en GPU.

## Fuentes Documentales

* Adell, F. (2021). *Fundamentos y evolución de la multimedia*. Universitat Oberta de Catalunya (UOC).  
* Marschner, S., & Shirley, P. (2016). *Fundamentals of Computer Graphics* (4th ed.). CRC Press.  
* Ojeda Linares, N. D. (2012). *Introducción a la multimedia*. Red Tercer Milenio.
