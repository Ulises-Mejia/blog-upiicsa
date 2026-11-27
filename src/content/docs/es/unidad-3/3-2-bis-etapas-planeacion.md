---
title: "Etapas de Planeación para Proyectos con Herramientas Multimedia Disruptivas"
description: "Hoja de ruta integral que articula la metodología MEDESME, los estándares ISO/IEC/IEEE 12207 y 29148 y la ingeniería ágil de software seguro (AESS) para proyectos multimedia disruptivos."
next: false
---

## Introducción

Construir un proyecto final integrador que combine herramientas multimedia disruptivas —como una plataforma web con recorridos virtuales `3D`, módulos de Realidad Aumentada, procesamiento de imagen o video adaptativo— requiere articular tres disciplinas que suelen enseñarse por separado: la **metodología de producción multimedia (`MEDESME`)**, los **estándares internacionales de ciclo de vida e ingeniería de requisitos de software (`ISO/IEC/IEEE 12207` y `29148`)** y la **ingeniería ágil de software seguro (`AESS`)**. Este último subtema integra todo el programa de estudios en una hoja de ruta maestra para planear, construir, validar y desplegar sistemas multimedia de vanguardia (García Sánchez et al., 2016; Mihelič et al., 2023).

## Articulación de las Etapas de Planeación: MEDESME + Estándares ISO/IEC/IEEE 12207 y 29148

Como demuestran García Sánchez et al. (2016) en la metodología `MEDESME` y Mihelič et al. (2023) al analizar los estándares internacionales **`ISO/IEC/IEEE 12207:2017`** (Procesos del Ciclo de Vida del Software), **`ISO/IEC/IEEE 24748-1:2018`** e **`ISO/IEC/IEEE 29148:2018`** (Ingeniería de Requisitos), la planeación y construcción de un proyecto informático con herramientas multimedia disruptivas se estructura en seis etapas integradas con criterios formales de entrada y salida:

<ol class="editorial-timeline" aria-label="Etapas iniciales de planeación MEDESME e ISO/IEC/IEEE 12207 y 29148 (Etapas 1 a 3)">
  <li>
    <details class="editorial-timeline__item" open>
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Etapa 1</span><span class="editorial-timeline__title">Concepción, alcance y estudio de viabilidad (ISO 24748 / MEDESME Fase 1)</span></summary>
      <div class="editorial-timeline__body"><p>Identificación del problema real u oportunidad de innovación, definición de la propuesta de valor de la tecnología disruptiva (justificando por qué se requiere <code>RV</code>, <code>RA</code>, visión artificial o animación <code>3D</code> en lugar de una interfaz convencional), integración de roles del equipo multidisciplinario y evaluación de factibilidad técnica, operativa, económica y de tiempos.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Etapa 2</span><span class="editorial-timeline__title">Ingeniería de requisitos y análisis multimodal (ISO/IEC/IEEE 29148 / MEDESME Fase 2)</span></summary>
      <div class="editorial-timeline__body"><p>Especificación de requerimientos de usuario, requerimientos funcionales y <strong>requerimientos no funcionales críticos en multimedia</strong> (tasa mínima de fotogramas de <code>60–90 FPS</code>, latencia máxima <em>motion-to-photon</em> <code>&lt; 20 ms</code>, peso máximo de activos en red, compatibilidad de navegadores/dispositivos y seguridad; Glover &amp; Linowes, 2019), junto con la caracterización del perfil del usuario y el catálogo de medios a producir.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Etapa 3</span><span class="editorial-timeline__title">Diseño arquitectónico, estructural, comunicacional y de seguridad (MEDESME Fase 3 / AESS)</span></summary>
      <div class="editorial-timeline__body"><p>Elaboración de las Fichas General, Psicopedagógica y Educativa-Técnica; modelado del <strong>Diseño Estructural</strong> (Mapa de navegación, <em>Storyboards</em> de escenas <code>2D</code>/<code>3D</code>, Diagramas de Casos de Uso <code>UML</code>, Diagrama Entidad-Relación de datos y arquitectura de integración cliente-servidor/<code>CDN</code>) y diseño de la interfaz de usuario y controles de interacción.</p></div>
    </details>
  </li>
</ol>

<figure class="media-container topic-figure">
  <picture>
    <source type="image/avif" srcset="../../../images/temas/u3/3-2-bis-planeacion-agil-scrum-480.avif 480w, ../../../images/temas/u3/3-2-bis-planeacion-agil-scrum-960.avif 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <source type="image/webp" srcset="../../../images/temas/u3/3-2-bis-planeacion-agil-scrum-480.webp 480w, ../../../images/temas/u3/3-2-bis-planeacion-agil-scrum-960.webp 960w" sizes="(max-width: 640px) 100vw, 860px" />
    <img src="../../../images/temas/u3/3-2-bis-planeacion-agil-scrum-960.webp" alt="Equipo multidisciplinario de ingeniería de software reunido frente a un tablero ágil Scrum con columnas de tareas, trabajo en progreso, pruebas y gráfica de avance iterativo." width="960" height="647" loading="lazy" decoding="async" />
  </picture>
  <figcaption><strong>Figura 3.6.</strong> Seguimiento iterativo en un equipo multidisciplinario frente a un tablero ágil (<em>Scrum</em>) con trazabilidad de tareas, pruebas y gráfica de avance: práctica central en la articulación entre <code>MEDESME</code> e ingeniería ágil segura (<code>AESS</code>).<span class="topic-figure__credit">Fotografía: Nghungdo / Wikimedia Commons (CC BY-SA 4.0).</span></figcaption>
</figure>

## Desarrollo Ágil Seguro (AESS), Validación con Normas ISO y Despliegue en Infraestructura Escalable

<ol class="editorial-timeline" aria-label="Etapas de desarrollo ágil seguro, validación ISO y despliegue (Etapas 4 a 6)">
  <li>
    <details class="editorial-timeline__item" open>
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Etapa 4</span><span class="editorial-timeline__title">Desarrollo iterativo, integración y gobernanza AESS (MEDESME Fases 4 y 5)</span></summary>
      <div class="editorial-timeline__body"><p>Producción y optimización de activos multimedia (modelado <code>3D</code> <em>low-poly</em>, texturas <code>PBR</code>, audio limpio, video <code>HLS</code>/<code>MPEG-DASH</code>), codificación modular en el ambiente seleccionado (<strong>Unity</strong>, <code>OpenGL</code>, <code>OpenCV</code>/<code>Python</code>, <code>HTML5</code>/<code>WebGL</code>) y aplicación de los componentes de <strong>Ingeniería Ágil de Software Seguro (<code>AESS</code>)</strong> de Mihelič et al. (2023), documentando toda la solución en el <strong>Manual Técnico</strong>: <strong>7 actividades clave</strong> (auditoría de código, pruebas de seguridad, capacitación, monitoreo, gestión de riesgos, modelado de amenazas y requisitos de seguridad), <strong>5 artefactos</strong> (casos de abuso, <em>security backlogs</em>, reportes, <em>s-tags</em> y políticas) y <strong>4 roles</strong> (<em>Security Master</em>, <em>Security Architect</em>, <em>Penetration Tester</em> y <em>Security Team</em>).</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Etapa 5</span><span class="editorial-timeline__title">Evaluación, pruebas piloto y certificación de calidad (MEDESME Fase 6)</span></summary>
      <div class="editorial-timeline__body"><p>Ejecución de pruebas piloto iterativas de rendimiento gráfico (<em>profiling</em> de <code>CPU</code>/<code>GPU</code>), pruebas de usabilidad e inclusión con usuarios reales bajo la norma <strong><code>ISO 9241-11</code></strong> (como se valida en entornos inclusivos de aprendizaje con <code>RA</code> en García García et al., 2023) y evaluación de calidad externa conforme a <strong><code>ISO/IEC 9126-2</code> / <code>ISO/IEC 25010</code></strong>.</p></div>
    </details>
  </li>
  <li>
    <details class="editorial-timeline__item">
      <summary class="editorial-timeline__trigger"><span class="editorial-timeline__year">Etapa 6</span><span class="editorial-timeline__title">Producción, registro legal, despliegue en la nube/CDN y material complementario (MEDESME Fases 7 y 8)</span></summary>
      <div class="editorial-timeline__body"><p>Generación de huellas criptográficas <code>SHA-256</code> y expediente de registro ante <strong><code>INDAUTOR</code></strong>, despliegue de activos pesados en almacenamiento de objetos y <strong>Redes de Distribución de Contenido (<code>CDN</code>)</strong> para garantizar baja latencia global, y entrega del <strong>Manual de Usuario</strong>.</p></div>
    </details>
  </li>
</ol>

## Conclusiones

> Al integrar la metodología `MEDESME` con los estándares internacionales `ISO/IEC/IEEE 12207`, `29148`, `9241-11` y el marco de seguridad ágil `AESS`, el profesional de la Licenciatura en Ciencias de la Informática adquiere una visión completa de ingeniería: no solo domina herramientas de imagen, audio, video, animación, `RV`, `RA` y visión artificial, sino que es capaz de planear, construir, proteger e integrar soluciones multimedia disruptivas de clase mundial.

## Fuentes Documentales

* García García, L. I., et al. (2023). Realidad aumentada como mecanismo para incrementar el grado de aprendizaje en individuos con discapacidades. *Ciencia ergo-sum*, 30(3).
* García Sánchez, E., Vite Chávez, O., Navarrete Sánchez, M. Á., García Sánchez, M. Á., & Torres Cosío, V. (2016). Metodología para el desarrollo de software multimedia educativo MEDESME. *CPU-e, Revista de Investigación Educativa*, (23), 216-226.
* Glover, J., & Linowes, J. (2019). *Complete Virtual Reality and Augmented Reality Development with Unity*. Packt Publishing.
* Mihelič, A., Hovelja, T., & Vrhovec, S. (2023). Identifying Key Activities, Artifacts and Roles in Agile Engineering of Secure Software with Hierarchical Clustering. *Applied Sciences*, 13(7), 4563.

---

:::tip[¿Listo para poner a prueba tus conocimientos?]
Has concluido todos los temas de la **Unidad III: Integración y Autoría Multimedia**. Pon a prueba lo aprendido interactuando con preguntas en Realidad Aumentada o en modo clásico:

<div style="text-align: center; margin: 1.5rem 0 0.5rem 0;">
  <a href="../cuestionario/" class="quiz-cta-btn">
    🥽 Iniciar Cuestionario de Evaluación (Unidad III) →
  </a>
</div>
:::
