---
title: "Tipos y Características de la Animación"
description: "Plantilla académica para 1.3.2: Tipos y Características de la Animación"
---

## Introducción

Desde los dibujos pintados a mano de las películas clásicas de estudio y las figuras de plastilina fotografiadas cuadro por cuadro en *stop-motion*, hasta los personajes tridimensionales de Pixar, los gráficos tipográficos animados de un noticiero y las explosiones de humo calculadas por ecuaciones de dinámica de fluidos en un videojuego, no existe una sola forma de animar. Clasificar los **tipos de animación y sus características técnicas** permite al ingeniero en informática elegir la técnica óptima según el estilo visual, el presupuesto de cómputo y el grado de interactividad del proyecto (de Vega, 2017; Marschner & Shirley, 2016).

## Animación Bidimensional (Tradicional Cuadro a Cuadro vs. Digital por Interpolación y Huesos 2D)

En el espacio bidimensional (*X*, *Y*) se distinguen tres vertientes principales (de Vega, 2017; Williams, 2019):

* **Animación Tradicional 2D (*Cel / Frame-by-Frame*):** Cada fotograma se dibuja individualmente (hoy en tabletas digitales usando capas y papel cebolla virtual u *onion skinning* en software como Toon Boom Harmony, Krita o TVPaint). Ofrece libertad expresiva absoluta en cambios de perspectiva, pero exige un alto costo de producción artesanal.  
* **Animación 2D por Interpolación Vectorial (*Tweening* y *Morphing*) y Recortes (*Cut-Out*):** El artista define únicamente los fotogramas clave (*Keyframes*) y el software calcula matemáticamente la posición, rotación, escala, opacidad o deformación de los vértices vectoriales en los cuadros intermedios. En la variante *Cut-Out* y de **esqueletos 2D** (como en Spine, Live2D o Adobe Animate), el personaje se divide en piezas articuladas vinculadas a una jerarquía de huesos 2D y mallas deformables, reduciendo drásticamente el peso de memoria en videojuegos móviles y aplicaciones web.  
* **Motion Graphics (Gráficos en Movimiento):** Se enfoca en la animación de elementos de diseño gráfico, tipografía cinética, logotipos, iconos y visualización dinámica de datos (por ejemplo, en After Effects, `CSS3` o `Lottie/JSON`) para interfaces de usuario, presentaciones corporativas y videos explicativos.

## Stop-Motion, Animación 3D por Computadora (CGI) y Animación Procedimental / Física

* **Animación *Stop-Motion* (Cuadro a Cuadro Físico):** Consiste en construir modelos reales en un set físico iluminado, moverlos milimétricamente y capturar una fotografía digital por cada fracción de movimiento (utilizando software como Dragonframe). Incluye subgéneros como *Claymation* (plastilina o arcilla maleable), marionetas con esqueleto metálico interno (*armatures*), *Cut-out* físico de papel y *Pixilación* (donde actores humanos reales son fotografiados cuadro a cuadro).  
* **Animación 3D Generada por Computadora (CGI):** Los objetos se construyen como mallas poligonales tridimensionales en un espacio cartesiano (*X*, *Y*, *Z*), dotadas de un esqueleto virtual (*rig*) y materiales que reaccionan a luces y cámaras virtuales (Marschner & Shirley, 2016). Una vez modelado y articulado el personaje, puede observarse desde cualquier ángulo de cámara y reutilizarse tanto en películas prerenderizadas como en motores en tiempo real.  
* **Animación Procedimental y Basada en Simulación Física:** En lugar de ser animada manualmente por un artista cuadro por cuadro, el movimiento emerge automáticamente en tiempo de ejecución a partir de algoritmos matemáticos, ecuaciones diferenciales de la física (gravedad, colisiones de cuerpos rígidos, telas, fluidos de Navier-Stokes, sistemas de partículas para fuego/lluvia) o reglas de comportamiento autónomo de multitudes (*boids*) (Marschner & Shirley, 2016, Cap. 16).

## Conclusiones

> Conocer las características técnicas de cada tipo de animación permite combinar lo mejor de cada enfoque: por ejemplo, usar *Motion Graphics* vectoriales ligeros para la interfaz de una aplicación, animación `3D` esquelética para su avatar principal y sistemas de partículas procedimentales para sus efectos ambientales.

## Fuentes Documentales

* de Vega, A. (2017). *Animación de elementos*. Alfaomega.  
* Marschner, S., & Shirley, P. (2016). *Fundamentals of Computer Graphics* (4th ed., Cap. 16). CRC Press.  
* Ojeda Linares, N. D. (2012). *Introducción a la multimedia* (Unidad 5). Red Tercer Milenio.  
* Williams, R. (2019). *Técnicas de animación. Dibujos animados, animación 3D y videojuegos*. Anaya Multimedia.
