---
title: "Herramientas de Realidad Virtual y Realidad Aumentada"
description: "Plantilla académica para 2.2.3: Herramientas de Realidad Virtual y Realidad Aumentada"
---

## Introducción

Para que un teléfono inteligente reconozca la portada de un libro de texto y haga emerger sobre ella un corazón humano tridimensional latiendo al compás del pulso, o para que un casco de realidad virtual detecte exactamente dónde están tus manos en el aire y te permita agarrar una pieza mecánica virtual, el programador no escribe desde cero las ecuaciones ópticas de las cámaras ni los filtros de los giroscopios: utiliza **Kits de Desarrollo de Software (SDKs) y herramientas especializadas de RV y RA** que encapsulan décadas de investigación en visión artificial y seguimiento espacial (Prendes Espinosa, 2015; García García et al., 2023).

## Arquitectura y SDKs de Realidad Aumentada (Reconocimiento de Imágenes, Planos y Geolocalización)

Con base en el análisis de Prendes Espinosa (2015) y la implementación experimental de García García et al. (2023), todo sistema de Realidad Aumentada requiere articular cuatro componentes: (1) sensor de captura de cámara, (2) unidad de procesamiento con el SDK de seguimiento, (3) elemento disparador o *trigger* y (4) pantalla de proyección mezclada. Los principales SDKs de desarrollo de RA en la industria informática son:

* **Vuforia Engine:** Es uno de los SDKs multiplataforma más utilizados en educación e industria (empleado junto con Unity y C# en el proyecto *MiCTL* de García et al., 2023). Utiliza algoritmos de detección de características naturales de esquinas y bordes para rastrear **Image Targets** (imágenes planas calificadas de 1 a 5 estrellas según su riqueza de contraste y asimetría), **Model Targets** (reconocimiento de objetos físicos 3D por su silueta CAD), cilindros y planos del suelo (*Ground Plane*).  
* **Google ARCore (Android) y Apple ARKit (iOS):** Son los frameworks nativos a nivel de sistema operativo móvil que ejecutan **Odometría Visual-Inercial (VIO)**, combinando las imágenes de la cámara a 60 FPS con el acelerómetro y giroscopio (IMU) a 200+ Hz para detectar mesas, pisos y paredes sin marcadores, estimar la intensidad y temperatura de color de la luz real de la habitación, y calcular mapas de profundidad para oclusión.  
* **Unity AR Foundation:** Capa de abstracción oficial dentro de Unity que permite al ingeniero programar la lógica de Realidad Aumentada una sola vez en C# y desplegarla de forma nativa tanto en dispositivos Android (vía ARCore) como en iOS (vía ARKit) y visores de Realidad Mixta (Glover & Linowes, 2019).  
* **Herramientas de WebAR (AR.js, MindAR, 8thWall, `<model-viewer>`):** Permiten ejecutar experiencias de Realidad Aumentada directamente desde el navegador del teléfono al escanear un código QR, eliminando la fricción de obligar al usuario a descargar e instalar una aplicación `.apk` o `.ipa`.

## Estándares y Herramientas de Desarrollo para Realidad Virtual (OpenXR y XR Interaction Toolkit)

En el desarrollo de Realidad Virtual, históricamente cada fabricante de visores (Meta/Oculus, HTC Vive, Valve, Sony, Microsoft) exigía su propio SDK incompatible con los demás. Para resolver esta fragmentación, el consorcio Khronos Group creó **OpenXR**, el estándar abierto y libre de regalías que unifica la comunicación entre los motores gráficos y cualquier casco o controlador de RV/RM. Sobre OpenXR operan frameworks de alto nivel como el **Unity XR Interaction Toolkit**, que provee componentes listos para usar de locomoción (teletransportación, giro gradual *snap-turn* y movimiento continuo), agarre físico de objetos (*XR Grab Interactable*), punteros láser para menús en espacio de mundo (*World Space UI*) y seguimiento de manos (Glover & Linowes, 2019).

## Conclusiones

El dominio de herramientas como Vuforia, AR Foundation, WebAR y OpenXR permite al ingeniero abstraer la complejidad matemática de la odometría visual-inercial y concentrarse en diseñar interacciones espaciales útiles, accesibles y multiplataforma.

## Fuentes Documentales

* García García, L. I., et al. (2023). Realidad aumentada como mecanismo para incrementar el grado de aprendizaje en individuos con discapacidades. *Ciencia ergo-sum*, 30(3).  
* Glover, J., & Linowes, J. (2019). *Complete Virtual Reality and Augmented Reality Development with Unity*. Packt Publishing.  
* Prendes Espinosa, C. (2015). Realidad aumentada y educación: análisis de experiencias prácticas. *Pixel-Bit. Revista de Medios y Educación*, (46), 187-203.
