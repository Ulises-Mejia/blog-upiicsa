---
title: "Tecnología de Recorridos Virtuales"
description: "Plantilla académica para 2.2.1: Tecnología de Recorridos Virtuales"
---

## Introducción

Cuando buscas rentar un departamento en otra ciudad, visitas la página de un museo como el Louvre o el Museo Nacional de Antropología, o exploras el campus de una universidad desde tu navegador usando *Street View*, estás utilizando un **recorrido virtual (*Virtual Walkthrough / Virtual Tour*)**. Esta tecnología permite a cualquier usuario desplazarse e inspeccionar un espacio arquitectónico, natural o histórico a distancia como si caminara físicamente por sus pasillos, combinando fotografía omnidireccional, reconstrucción geométrica tridimensional y puntos de interacción hipermedia (Otero & Flores, 2011).

## Arquitecturas Técnicas: Recorridos Panorámicos Esféricos (360°) vs. Recorridos Geométricos 3D en Tiempo Real

Como analizan Otero y Flores (2011) en su estudio de casos sobre paseos virtuales museográficos, existen dos arquitecturas técnicas fundamentales para construir un recorrido virtual:

* **1. Recorridos Basados en Imagen Omnidireccional (Panoramas Esféricos o Cúbicos $360^\circ$):** Se capturan fotografías reales desde múltiples puntos estratégicos del recinto utilizando cámaras de doble lente ojo de pez ($360^\circ$) o cabezales robóticos panorámicos. Las imágenes se unen matemáticamente mediante algoritmos de **cosido fotogramétrico (*Image Stitching*)** que detectan puntos característicos invariantes (como descriptores SIFT/ORB) en las zonas de traslape y las proyectan en un mapa **equirrectangular** (relación de aspecto $2:1$, donde el eje horizontal abarca $360^\circ$ de longitud y el vertical $180^\circ$ de latitud) o en las seis caras de un cubo (***Cube Map / Skybox***). En el visor web, la cámara del usuario se sitúa en el centro de la esfera o cubo y salta de un nodo a otro mediante flechas de transición.  
* **2. Recorridos Basados en Geometría Tridimensional en Tiempo Real (*3D Real-Time Walkthroughs*):** El edificio o espacio se modela por completo como una malla poligonal 3D con texturas PBR e iluminación precalculada (*Baked Lightmaps*), o bien se escanea con sensores láser **LiDAR / Fotogrametría** (como en cámaras Matterport) para generar el modelo tridimensional («vista de casa de muñecas» o *Dollhouse View*). Aquí el usuario no está limitado a saltar entre puntos fijos, sino que puede caminar libremente por cualquier coordenada $(X, Y, Z)$ con detección de colisiones en paredes y pisos.

## Elementos de Interacción Hipermedia (Hotspots), Orientación Espacial (Wayfinding) y Optimización

Para que un recorrido virtual sea una herramienta informática informativa y no solo una galería pasiva, incorpora tres capas de diseño (Otero & Flores, 2011):

* **Puntos de Interacción o *Hotspots*:** Nodos anclados a coordenadas esféricas $(\theta, \phi)$ o tridimensionales $(X, Y, Z)$ que, al hacer clic o fijar la mirada sobre ellos, despliegan fichas de texto, locuciones de audioguía, videos explicativos o modelos 3D inspeccionables.  
* **Sistemas de Orientación (*Wayfinding*):** Inclusión de minimapas de planta arquitectónica con indicador de radar del campo visual actual, brújula y menú de salto directo por zonas para evitar que el usuario se desoriente.  
* **Carga Progresiva (*Multi-Resolution Tiling*):** Dividir los panoramas de ultra alta resolución (8K a 16K) en teselas piramidales que solo se descargan a máxima calidad en la región exacta hacia donde el usuario está mirando en ese instante.

## Conclusiones

La tecnología de recorridos virtuales democratiza el acceso a espacios físicos remotos o inexistentes, combinando la precisión óptica de las proyecciones esféricas con la interactividad hipermedia para aplicaciones educativas, turísticas, museográficas e inmobiliarias.

## Fuentes Documentales

* Marschner, S., & Shirley, P. (2016). *Fundamentals of Computer Graphics* (4th ed., Cap. 11: Texture Mapping). CRC Press.  
* Otero, A., & Flores, J. (2011). Realidad virtual: un medio de comunicación de contenidos. Aplicación como herramienta educativa y factores de diseño e implantación en museos y espacios públicos. *Revista ICONO 14*, 9(2), 185-211.
