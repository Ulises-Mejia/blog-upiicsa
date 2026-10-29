---
title: "Diferencias entre Realidad Virtual, Aumentada y Mixta"
description: "Plantilla académica para 2.1.2: Diferencias entre Realidad Virtual, Aumentada y Mixta"
---

## Introducción

Es común que en el lenguaje cotidiano se confundan los términos Realidad Virtual (RV), Realidad Aumentada (RA) y Realidad Mixta (RM), pero en el diseño de sistemas informáticos responden a necesidades opuestas: si quieres entrenar a un cirujano en un quirófano simulado desde su casa, necesitas **Realidad Virtual** que reemplace su habitación por completo; en cambio, si ese cirujano ya está operando a un paciente real y necesita ver proyectada la ubicación de una arteria sobre el cuerpo sin perder de vista sus manos ni el instrumental físico, necesitas **Realidad Aumentada o Mixta** (Prendes Espinosa, 2015; Cejudo-Mejías et al., 2023).

## El Continuo de Virtualidad de Milgram y Kishino y el Marco de la Realidad Extendida (XR)

Para clasificar rigurosamente estas tecnologías, Paul Milgram y Fumio Kishino formularon en **1994** el **Continuo de Virtualidad (*Reality-Virtuality Continuum*)**, una escala continua cuyos dos extremos son el **Entorno Real** (el mundo físico sin ninguna intervención digital) y el **Entorno Virtual Puro (Realidad Virtual)**, donde el 100 % de lo que percibe el usuario es generado por computadora. Todo el espectro intermedio donde se mezclan píxeles digitales y átomos físicos se denomina hoy bajo el término paraguas de **Realidad Extendida (XR)** (Cejudo-Mejías et al., 2023; Prendes Espinosa, 2015):

* **Realidad Virtual (RV / VR):** Aísla visual y auditivamente al usuario del mundo físico para transportarlo a un entorno completamente sintético.  
* **Realidad Aumentada (RA / AR):** Mantiene el mundo real como escenario principal y **superpone capas de información digital** (modelos 3D, textos, videos o indicadores) sobre la vista del entorno físico. Conforme a la definición clásica de Ronald Azuma (1997) citada por Prendes Espinosa (2015), todo sistema de RA debe cumplir tres requisitos: **(1) combinar elementos reales y virtuales**, **(2) ser interactivo en tiempo real** y **(3) estar registrado espacialmente en tres dimensiones (3D)**.  
* **Virtualidad Aumentada (VA / AV):** Caso inverso a la RA donde el entorno base es virtual pero se incrustan objetos o video en vivo del mundo físico (por ejemplo, ver tus propias manos reales o tu teclado físico recortados dentro de una oficina virtual).  
* **Realidad Mixta (RM / MR):** Representa la convergencia avanzada donde los objetos virtuales no solo se dibujan encima de la imagen de la cámara, sino que **comprenden la geometría tridimensional de la habitación real**: un personaje virtual puede esconderse detrás de tu sillón físico (**oclusión espacial**), rebotar contra tus paredes reales (**colisiones con malla espacial**) y recibir sombras acordes a la lámpara de tu sala.

## Los Cuatro Niveles Evolutivos de la Realidad Aumentada (Prendes Espinosa, 2015)

En su estudio en *Pixel-Bit*, Carlos Prendes Espinosa (2015) detalla la taxonomía de **niveles de Realidad Aumentada** propuesta por Lens-Fitzgerald según el tipo de activador (*trigger*) y capacidad de seguimiento:

* **Nivel 0 (Hiperenlazando el mundo físico):** Basado en códigos de barras y códigos QR 2D que sólo redirigen a una URL o archivo sin registro 3D.  
* **Nivel 1 (RA basada en marcadores):** Reconoce patrones fiduciales impresos en blanco y negro o imágenes planas (*Image Targets*) para anclar un modelo 3D sobre el papel.  
* **Nivel 2 (RA sin marcadores / *Markerless* y Geolocalizada):** Utiliza el GPS, brújula y acelerómetro del móvil (como en *Pokémon GO* o guías turísticas urbanas) o algoritmos SLAM de detección de planos horizontales y verticales (mesas, pisos y paredes) sin requerir plantillas impresas.  
* **Nivel 3 (Visión Aumentada / Realidad Mixta con Visores):** Emplea gafas inteligentes translúcidas (*Optical See-Through* como HoloLens o visores con cámaras *Video Pass-Through* de alta resolución) con mapeo espacial 3D manos libres.

## Conclusiones

Comprender las diferencias técnicas entre RV, RA y RM a lo largo del Continuo de Virtualidad permite seleccionar el paradigma exacto que requiere cada problema informático: aislar para simular mundos inexistentes (RV), superponer para enriquecer el entorno con datos móviles (RA) o fusionar geométricamente ambos mundos para asistir tareas complejas manos libres (RM).

## Fuentes Documentales

* Cejudo-Mejías, V., Gallego-Trijueque, S., & Oliva-Marañón, C. (2023). Estudio del metaverso y las posibilidades de los entornos virtuales inmersivos. *Dialnet / UNIR*.  
* García García, L. I., et al. (2023). Realidad aumentada como mecanismo para incrementar el grado de aprendizaje. *Ciencia ergo-sum*, 30(3).  
* Otero, A., & Flores, J. (2011). Realidad virtual: un medio de comunicación de contenidos. *Revista ICONO 14*, 9(2), 185-211.  
* Prendes Espinosa, C. (2015). Realidad aumentada y educación: análisis de experiencias prácticas. *Pixel-Bit. Revista de Medios y Educación*, (46), 187-203.
