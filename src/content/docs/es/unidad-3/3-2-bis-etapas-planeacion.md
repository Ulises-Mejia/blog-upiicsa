---
title: "Etapas de Planeación para Proyectos con Herramientas Multimedia Disruptivas"
description: "Hoja de ruta integral que articula la metodología MEDESME, los estándares ISO/IEC/IEEE 12207 y 29148 y la ingeniería ágil de software seguro (AESS) para proyectos multimedia disruptivos."
next: false
---

## Introducción

Construir un proyecto final integrador que combine herramientas multimedia disruptivas —como una plataforma web con recorridos virtuales `3D`, módulos de Realidad Aumentada, procesamiento de imagen o video adaptativo— requiere articular tres disciplinas que suelen enseñarse por separado: la **metodología de producción multimedia (`MEDESME`)**, los **estándares internacionales de ciclo de vida e ingeniería de requisitos de software (`ISO/IEC/IEEE 12207` y `29148`)** y la **ingeniería ágil de software seguro (`AESS`)**. Este último subtema integra todo el programa de estudios en una hoja de ruta maestra para planear, construir, validar y desplegar sistemas multimedia de vanguardia (García Sánchez et al., 2016; Mihelič et al., 2023).

## Articulación de las Etapas de Planeación: MEDESME + Estándares ISO/IEC/IEEE 12207 y 29148

Como demuestran García Sánchez et al. (2016) en la metodología `MEDESME` y Mihelič et al. (2023) al analizar los estándares internacionales **`ISO/IEC/IEEE 12207:2017`** (Procesos del Ciclo de Vida del Software), **`ISO/IEC/IEEE 24748-1:2018`** e **`ISO/IEC/IEEE 29148:2018`** (Ingeniería de Requisitos), la planeación y construcción de un proyecto informático con herramientas multimedia disruptivas se estructura en seis etapas integradas con criterios formales de entrada y salida:

* **Etapa 1 — Concepción, Alcance y Estudio de Viabilidad (Concepto `ISO 24748` / Fase 1 `MEDESME`):** Identificación del problema real u oportunidad de innovación, definición de la propuesta de valor de la tecnología disruptiva (justificando por qué se requiere `RV`, `RA`, visión artificial o animación `3D` en lugar de una interfaz convencional), integración de roles del equipo multidisciplinario y evaluación de factibilidad técnica, operativa, económica y de tiempos.
* **Etapa 2 — Ingeniería de Requisitos y Análisis Multimodal (`ISO/IEC/IEEE 29148` / Fase 2 `MEDESME`):** Especificación de requerimientos de usuario, requerimientos funcionales y **requerimientos no funcionales críticos en multimedia** (tasa mínima de fotogramas de `60–90 FPS`, latencia máxima *motion-to-photon* `< 20 ms`, peso máximo de activos en red, compatibilidad de navegadores/dispositivos y seguridad; Glover & Linowes, 2019), junto con la caracterización del perfil del usuario y el catálogo de medios a producir.
* **Etapa 3 — Diseño Arquitectónico, Estructural, Comunicacional y de Seguridad (Fase 3 `MEDESME` / `AESS`):** Elaboración de las Fichas General, Psicopedagógica y Educativa-Técnica; modelado del **Diseño Estructural** (Mapa de navegación, *Storyboards* de escenas `2D`/`3D`, Diagramas de Casos de Uso `UML`, Diagrama Entidad-Relación de datos y arquitectura de integración cliente-servidor/`CDN`) y diseño de la interfaz de usuario y controles de interacción.

## Desarrollo Ágil Seguro (AESS), Validación con Normas ISO y Despliegue en Infraestructura Escalable

* **Etapa 4 — Desarrollo Iterativo, Integración y Gobernanza `AESS` (Fases 4 y 5 `MEDESME` / Mihelič et al., 2023):** Producción y optimización de activos multimedia (modelado `3D` *low-poly*, texturas `PBR`, audio limpio, video `HLS`/`MPEG-DASH`), codificación modular en el ambiente de desarrollo seleccionado (**Unity**, `OpenGL`, `OpenCV`/`Python`, `HTML5`/`WebGL`) y aplicación de los componentes de **Ingeniería Ágil de Software Seguro (`AESS`)** identificados mediante agrupamiento jerárquico de Ward por Mihelič et al. (2023), documentando toda la solución en el **Manual Técnico**:
  * **7 Actividades Clave:** Auditoría de seguridad y código, análisis y pruebas de seguridad, capacitación del equipo, priorización y monitoreo, gestión de riesgos, planeación/modelado de amenazas e ingeniería de requisitos de seguridad.
  * **5 Artefactos Clave:** Requisitos e historias de usuario de seguridad (casos de abuso), repositorios (*security backlogs*), reportes de pruebas, etiquetas de trazabilidad (*s-tags*) y políticas de codificación segura.
  * **4 Roles Clave:** *Security Guru/Master*, *Security Developer/Architect*, *Penetration Tester* y *Security Team*.
* **Etapa 5 — Evaluación, Pruebas Piloto y Certificación de Calidad (Fase 6 `MEDESME`):** Ejecución de pruebas piloto iterativas de rendimiento gráfico (*profiling* de `CPU`/`GPU`), pruebas de usabilidad e inclusión con usuarios reales bajo la norma **`ISO 9241-11`** (como se valida en entornos inclusivos de aprendizaje con `RA` en García García et al., 2023) y evaluación de calidad externa conforme a **`ISO/IEC 9126-2` / `ISO/IEC 25010`**.
* **Etapa 6 — Producción, Registro Legal, Despliegue en la Nube/`CDN` y Material Complementario (Fases 7 y 8 `MEDESME`):** Generación de huellas criptográficas `SHA-256` y expediente de registro ante **`INDAUTOR`**, despliegue de activos pesados en almacenamiento de objetos y **Redes de Distribución de Contenido (`CDN`)** para garantizar baja latencia global, y entrega del **Manual de Usuario**.

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
  <a href="/blog-upiicsa/es/unidad-3/cuestionario/" class="quiz-cta-btn">
    🥽 Iniciar Cuestionario de Evaluación (Unidad III) →
  </a>
</div>
:::
