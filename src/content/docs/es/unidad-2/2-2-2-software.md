---
title: "Software de Entornos Virtuales"
description: "Plantilla académica para 2.2.2: Software de Entornos Virtuales"
---

## Introducción

Ningún entorno virtual interactivo se construye con una sola herramienta: igual que en el desarrollo web intervienen programas de diseño de interfaces, editores de código, gestores de bases de datos y servidores de despliegue, la creación de un mundo virtual requiere una cadena de software especializada (**pipeline de creación de entornos virtuales**) donde las herramientas de modelado 3D, texturizado físico, edición de audio espacial y motores de visualización trabajan en perfecta sincronía (García García et al., 2023; Glover & Linowes, 2019).

## Clasificación Funcional del Software de Entornos Virtuales

Como se documenta en la metodología de desarrollo de García García et al. (2023) y en Glover y Linowes (2019), el software involucrado en la construcción y ejecución de entornos virtuales se divide en cuatro capas tecnológicas:

* **1. Software de Creación de Contenido Digital 3D (*DCC - Digital Content Creation*):** Son las herramientas donde se esculpen, modelan, mapean en UV y articulan (*rigging*) los objetos, edificios y personajes tridimensionales que poblarán el entorno. Destaca **Blender** (como estándar abierto gratuito empleado en investigaciones académicas como el proyecto *MiCTL* de García et al., 2023), junto con **Autodesk Maya**, **3ds Max**, **Cinema 4D** y software CAD/BIM arquitectónico (como **Revit** o **SketchUp**) para importar planos de ingeniería.  
* **2. Software de Autoría de Materiales Físicos (PBR) y Fotogrametría:** Programas dedicados a generar mapas de texturas realistas (color, rugosidad, metalicidad, normales y oclusión ambiental) como **Adobe Substance 3D Painter/Designer**, **Quixel Mixer** o **ArmorPaint**, así como software de reconstrucción fotogramétrica (**Meshroom**, **RealityCapture**, **Metashape**) que convierte fotografías de objetos reales en modelos 3D.  
* **3. Plataformas Especializadas en Recorridos Panorámicos y Mundos Web:** Herramientas orientadas a ensamblar recorridos virtuales y espacios multiusuario directamente para el navegador web sin requerir programación compleja desde cero, tales como **Pano2VR**, **3DVista**, **Krpano**, **Marzipano** (código abierto de Google para panoramas 360°) y frameworks declarativos de WebXR como **A-Frame** y **Three.js**.  
* **4. Motores de Simulación e Integración en Tiempo Real:** Entornos donde convergen todos los activos anteriores para dotarlos de iluminación, colisiones físicas, sonido espacial 3D y lógica interactiva (como **Unity**, **Unreal Engine** y **Godot**).

## Interoperabilidad, Optimización de Mallas (Polígonos y Draw Calls) y Flujo de Trabajo

El reto crítico al comunicar estas distintas piezas de software es el **presupuesto de rendimiento en tiempo real**: un modelo esculpido en un software DCC puede tener 5 millones de polígonos, pero para ejecutarse fluidamente en un entorno virtual web o móvil debe someterse a **decimación o retopología** (*Low-Poly*), transferencia de detalles a mapas de normales (*Normal Map Baking*), compresión de texturas en potencias de dos (1024 × 1024 o 2048 × 2048) y exportación en estándares de intercambio limpios como **glTF 2.0 / GLB** o **FBX** (Glover & Linowes, 2019; Marschner & Shirley, 2016).

## Conclusiones

> Seleccionar y articular correctamente el software de entornos virtuales permite separar la creación artística de activos `3D` de la programación lógica del sistema, logrando flujos de trabajo modulares donde diseñadores e ingenieros en informática colaboran sobre formatos estándar como `glTF 2.0` y `FBX`.

## Fuentes Documentales

* García García, L. I., et al. (2023). Realidad aumentada como mecanismo para incrementar el grado de aprendizaje en individuos con discapacidades. *Ciencia ergo-sum*, 30(3).  
* Glover, J., & Linowes, J. (2019). *Complete Virtual Reality and Augmented Reality Development with Unity*. Packt Publishing.  
* Otero, A., & Flores, J. (2011). Realidad virtual: un medio de comunicación de contenidos. *Revista ICONO 14*, 9(2), 185-211.
