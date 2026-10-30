---
title: "Características de la Realidad Virtual"
description: "Plantilla académica para 2.1.1: Características de la Realidad Virtual"
---

## Introducción

Cuando un piloto de aviación entrena una maniobra de emergencia dentro de un simulador de vuelo inmersivo, su ritmo cardíaco se acelera igual que si estuviera a diez mil metros de altura, a pesar de saber racionalmente que se encuentra en una habitación segura en tierra. Esta capacidad de generar una experiencia sensorial y cognitiva convincente dentro de un entorno generado por computadora es lo que define a la **Realidad Virtual (RV)** y la distingue de cualquier pantalla bidimensional tradicional (Otero & Flores, 2011; Jerald, 2016).

## Definición y el Triángulo Fundamental de la Realidad Virtual (Las 3 'I' + Presencia)

Como exponen Otero y Flores (2011) y Jerald (2016), la Realidad Virtual es una tecnología informática que genera un entorno tridimensional sintético con el que una o más personas pueden interactuar en tiempo real a través de canales multisensoriales. Su arquitectura conceptual se sostiene sobre cuatro características esenciales:

* **Inmersión (*Immersion*):** Es el grado objetivo y medible en que el hardware del sistema aísla al usuario de los estímulos del mundo físico exterior y los sustituye por estímulos digitales envolventes (campo de visión amplio o FOV de 100° a 120°, visión estereoscópica 3D, audio espacial binaural 360° y mandos hápticos).  
* **Interacción en Tiempo Real (*Interaction*):** Es la capacidad del usuario para modificar el mundo virtual y manipular sus objetos mediante acciones naturales (girar la cabeza, caminar, tomar objetos con las manos) recibiendo respuesta inmediata del sistema sin demora perceptible.  
* **Imaginación (*Imagination*, modelo de Burdea y Coiffet):** La capacidad de la mente humana para integrar las señales multisensoriales y dotar de significado y resolución de problemas a la simulación.  
* **Sentido de Presencia y *Embodiment*:** Es la respuesta subjetiva y psicológica del usuario de sentir que «está físicamente dentro» del entorno virtual (*Place Illusion*), que los eventos que ocurren ahí son reales (*Plausibility Illusion*) y que el cuerpo o manos virtuales le pertenecen (*Sense of Embodiment*).

## Grados de Libertad (3DoF vs. 6DoF) y Modalidades de Inmersión

Técnicamente, los sistemas de RV se clasifican según su **nivel de inmersión**:

* **RV No Inmersiva o de Escritorio:** Navegada en un monitor convencional con ratón y teclado.
* **RV Semi-Inmersiva:** Proyecciones envolventes tipo domo o cuevas multiproyector (`CAVE`).
* **RV Totalmente Inmersiva:** Mediante visores de casco (*Head-Mounted Display*, `HMD`).

Asimismo, se clasifican según sus **Grados de Libertad (*Degrees of Freedom*, `DoF`)** de seguimiento espacial (Glover & Linowes, 2019):

* **Seguimiento `3DoF` (Tres Grados de Libertad):** Registra únicamente las tres rotaciones de la cabeza sobre su propio eje mediante giroscopios y acelerómetros (cabeceo / *Pitch*, guiñada / *Yaw* y alabeo / *Roll*). Si el usuario camina hacia adelante, la escena no se acerca; se usa en visores básicos para ver videos esféricos `360°`.  
* **Seguimiento `6DoF` (Seis Grados de Libertad):** Registra tanto las tres rotaciones (*Pitch, Yaw, Roll*) como las tres traslaciones posicionales en el espacio (*X*, *Y*, *Z*) mediante cámaras integradas en el casco (*Inside-Out SLAM tracking*) o sensores externos, permitiendo caminar físicamente alrededor de los objetos virtuales y acercarse a inspeccionarlos.

## Conclusiones

> Las características técnicas de la Realidad Virtual —inmersión multisensorial, interacción sin latencia, seguimiento espacial `6DoF` y sentido de presencia— convierten a la computadora de una ventana que miramos desde afuera en un espacio habitable desde adentro.

## Fuentes Documentales

* Glover, J., & Linowes, J. (2019). *Complete Virtual Reality and Augmented Reality Development with Unity*. Packt Publishing.  
* Jerald, J. (2016). *The VR Book: Human-Centered Design for Virtual Reality*. ACM Books / Morgan & Claypool.  
* Otero, A., & Flores, J. (2011). Realidad virtual: un medio de comunicación de contenidos. *Revista ICONO 14*, 9(2), 185-211.
