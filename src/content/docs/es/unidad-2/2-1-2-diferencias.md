---
title: "Diferencias entre Realidad Virtual, Aumentada y Mixta"
description: "Diferencias técnicas entre Realidad Virtual, Aumentada y Mixta en el Continuo de Virtualidad de Milgram y Kishino, el marco XR y los niveles evolutivos de la RA."
---

## Introducción

Es común que en el lenguaje cotidiano se confundan los términos Realidad Virtual (RV), Realidad Aumentada (RA) y Realidad Mixta (RM), pero en el diseño de sistemas informáticos responden a necesidades opuestas: si quieres entrenar a un cirujano en un quirófano simulado desde su casa, necesitas **Realidad Virtual** que reemplace su habitación por completo; en cambio, si ese cirujano ya está operando a un paciente real y necesita ver proyectada la ubicación de una arteria sobre el cuerpo sin perder de vista sus manos ni el instrumental físico, necesitas **Realidad Aumentada o Mixta** (Prendes Espinosa, 2015; Cejudo-Mejías et al., 2023).

## El Continuo de Virtualidad de Milgram y Kishino y el Marco de la Realidad Extendida (XR)

Para clasificar rigurosamente estas tecnologías, Paul Milgram y Fumio Kishino formularon en **1994** el **Continuo de Virtualidad (*Reality-Virtuality Continuum*)**, una escala continua cuyos dos extremos son el **Entorno Real** (el mundo físico sin ninguna intervención digital) y el **Entorno Virtual Puro (Realidad Virtual)**, donde el 100 % de lo que percibe el usuario es generado por computadora. Todo el espectro intermedio donde se mezclan píxeles digitales y átomos físicos se denomina hoy bajo el término paraguas de **Realidad Extendida (XR)** (Cejudo-Mejías et al., 2023; Prendes Espinosa, 2015):

* **Realidad Virtual (`RV / VR`):** Aísla visual y auditivamente al usuario del mundo físico para transportarlo a un entorno completamente sintético.  
* **Realidad Aumentada (`RA / AR`):** Mantiene el mundo real como escenario principal y **superpone capas de información digital** (modelos 3D, textos, videos o indicadores) sobre la vista del entorno físico. Conforme a la definición clásica de Ronald Azuma (1997) citada por Prendes Espinosa (2015), todo sistema de RA debe cumplir tres requisitos esenciales:
  1. Combinar elementos reales y virtuales.
  2. Ser interactivo en tiempo real.
  3. Estar registrado espacialmente en tres dimensiones (`3D`).  
* **Virtualidad Aumentada (`VA / AV`):** Caso inverso a la RA donde el entorno base es virtual pero se incrustan objetos o video en vivo del mundo físico (por ejemplo, ver tus propias manos reales o tu teclado físico recortados dentro de una oficina virtual).  
* **Realidad Mixta (`RM / MR`):** Representa la convergencia avanzada donde los objetos virtuales no solo se dibujan encima de la imagen de la cámara, sino que **comprenden la geometría tridimensional de la habitación real**: un personaje virtual puede esconderse detrás de tu sillón físico (**oclusión espacial**), rebotar contra tus paredes reales (**colisiones con malla espacial**) y recibir sombras acordes a la lámpara de tu sala.

<figure class="media-container topic-figure">
  <picture>
    <source type="image/avif" srcset="../../../images/temas/u2/2-1-2-hololens-malla-espacial-480.avif 480w, ../../../images/temas/u2/2-1-2-hololens-malla-espacial-960.avif 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <source type="image/webp" srcset="../../../images/temas/u2/2-1-2-hololens-malla-espacial-480.webp 480w, ../../../images/temas/u2/2-1-2-hololens-malla-espacial-960.webp 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <img src="../../../images/temas/u2/2-1-2-hololens-malla-espacial-960.webp" alt="Usuario portando un visor de realidad mixta Microsoft HoloLens e interactuando con gesto manual mientras la pantalla detrás muestra la malla poligonal de escaneo espacial triangulada en vivo sobre las sillas y muebles reales." width="960" height="641" loading="lazy" decoding="async" />
  </picture>
  <figcaption><strong>Figura 2.2.</strong> Mapeo espacial tridimensional en Realidad Mixta (<em>Microsoft HoloLens</em>): la malla de triángulos reconstruida en vivo sobre el mobiliario real habilita oclusión y colisiones físicas con objetos virtuales.<span class="topic-figure__credit">Fotografía: Kai Kowalewski / Wikimedia Commons (CC BY-SA 4.0).</span></figcaption>
</figure>

## Los Cuatro Niveles Evolutivos de la Realidad Aumentada (Prendes Espinosa, 2015)

En su estudio en *Pixel-Bit*, Carlos Prendes Espinosa (2015) detalla la taxonomía de **niveles de Realidad Aumentada** propuesta por Lens-Fitzgerald según el tipo de activador (*trigger*) y capacidad de seguimiento:

<ol class="editorial-timeline" aria-label="Cuatro niveles evolutivos de la Realidad Aumentada (Nivel 0 a Nivel 3)">
  <li>
    <details class="editorial-timeline__item" open>
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Nivel 0</span><span class="editorial-timeline__title">Hiperenlazando el mundo físico</span></summary>
      <div class="editorial-timeline__body"><p>Basado en códigos de barras y códigos <code>QR</code> 2D que únicamente redirigen a una URL o archivo digital sin realizar registro espacial tridimensional.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Nivel 1</span><span class="editorial-timeline__title">RA basada en marcadores</span></summary>
      <div class="editorial-timeline__body"><p>Reconoce patrones fiduciales impresos en blanco y negro o imágenes planas (<em>Image Targets</em>) para calcular la pose de cámara y anclar un modelo <code>3D</code> sobre el papel.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Nivel 2</span><span class="editorial-timeline__title">RA sin marcadores (Markerless) y geolocalizada</span></summary>
      <div class="editorial-timeline__body"><p>Utiliza el <code>GPS</code>, brújula y acelerómetro del móvil (como en <em>Pokémon GO</em> o guías turísticas urbanas) o algoritmos <code>SLAM</code> de detección de planos horizontales y verticales (mesas, pisos y paredes) sin requerir plantillas impresas.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Nivel 3</span><span class="editorial-timeline__title">Visión aumentada y Realidad Mixta con visores</span></summary>
      <div class="editorial-timeline__body"><p>Emplea gafas inteligentes translúcidas (<em>Optical See-Through</em> como HoloLens) o visores con cámaras <em>Video Pass-Through</em> de alta resolución capaces de mapear la geometría espacial <code>3D</code> con operación manos libres.</p></div>
    </details>
  </li>
</ol>

## Conclusiones

> Comprender las diferencias técnicas entre `RV`, `RA` y `RM` a lo largo del **Continuo de Virtualidad** permite seleccionar el paradigma exacto que requiere cada problema informático: aislar para simular mundos inexistentes (`RV`), superponer para enriquecer el entorno con datos móviles (`RA`) o fusionar geométricamente ambos mundos para asistir tareas complejas manos libres (`RM`).

## Fuentes Documentales

* Cejudo-Mejías, V., Gallego-Trijueque, S., & Oliva-Marañón, C. (2023). Estudio del metaverso y las posibilidades de los entornos virtuales inmersivos. *Dialnet / UNIR*.  
* García García, L. I., et al. (2023). Realidad aumentada como mecanismo para incrementar el grado de aprendizaje. *Ciencia ergo-sum*, 30(3).  
* Otero, A., & Flores, J. (2011). Realidad virtual: un medio de comunicación de contenidos. *Revista ICONO 14*, 9(2), 185-211.  
* Prendes Espinosa, C. (2015). Realidad aumentada y educación: análisis de experiencias prácticas. *Pixel-Bit. Revista de Medios y Educación*, (46), 187-203.
