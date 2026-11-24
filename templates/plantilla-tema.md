---
title: "Título del Tema (Ej. 1.X.X Nombre)"
description: "Resumen conciso del tema en una o dos oraciones para SEO y metadatos."
---

<!--
  GUÍA RÁPIDA DE USO:
  1. Copia este archivo desde `templates/plantilla-tema.md` a la carpeta de su unidad:
     `src/content/docs/es/unidad-1/`, `unidad-2/` o `unidad-3/`
     usando la nomenclatura del temario (ej. `1-2-5-nuevo-tema.md`).
  2. Actualiza el frontmatter superior (`title` y `description` real, no dejes texto de plantilla).
  3. Redacta el contenido reemplazando las secciones de ejemplo y elimina las que no uses.
  4. Si necesitas componentes interactivos de Starlight (como `<Tabs>`), guarda el archivo
     con extensión `.mdx` en lugar de `.md`.
-->

## 📌 Introducción al Tema

Escribe aquí la introducción conceptual del tema. Explica por qué es relevante, cuál es su propósito en el contexto de la multimedia y qué conceptos se abordarán a lo largo del documento.

:::note[Definición Clave]
Coloca aquí una definición destacada o el principio teórico más importante de este subtema.
:::

---

## 📚 Desarrollo del Contenido

Desarrolla los fundamentos técnicos y teóricos organizados con subtítulos claros (`###`).

### 1. Conceptos Fundamentales

Explica los conceptos base utilizando listas y tipografía enriquecida:

* **Concepto A:** Descripción del componente o tecnología.
* **Concepto B:** Explicación técnica de su funcionamiento.
* **Concepto C:** Casos de uso típicos en la industria informática.

:::tip[Consejo Práctico / Buena Práctica]
Utiliza este bloque para destacar recomendaciones, estándares de la industria o consejos técnicos de producción.
:::

### 2. Pestañas Interactivas (requiere extensión `.mdx`)

Si necesitas alternar comparativas o código en pestañas interactivas, renombra el tema a `.mdx` y coloca el `import` justo después del frontmatter:

```mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs>
  <TabItem label="Enfoque A">
    Explicación detallada del enfoque o metodología A.
  </TabItem>
  <TabItem label="Enfoque B">
    Explicación detallada del enfoque o metodología B.
  </TabItem>
</Tabs>
```

### 3. Tabla Comparativa de Tecnologías / Formatos

| Parámetro / Criterio | Formato / Tecnología A | Formato / Tecnología B |
| :--- | :--- | :--- |
| **Resolución Máxima** | 1920 × 1080 (Full HD) | 3840 × 2160 (4K UHD) |
| **Tasa de Compresión** | Media (Menor consumo CPU) | Alta (Mayor eficiencia) |
| **Soporte Web** | Universal | Moderno / Requiere códec específico |

:::caution[Advertencia Técnica]
Usa este bloque para advertir sobre incompatibilidades de navegadores, formatos obsoletos o posibles errores comunes.
:::

---

## 🎬 Zona de Recursos Multimedia

<!-- Elimina los bloques multimedia que no utilices en tu redacción final. -->
<!-- Nota: incluye el prefijo base `/blog-upiicsa` en rutas absolutas a `public/`. -->

### 1. Imagen Ilustrativa o Diagrama
Guarda tu imagen en `public/images/nombre-imagen.png` y úsala así:

```html
<div class="media-container">
  <img src="/blog-upiicsa/images/nombre-imagen.png" alt="Diagrama explicativo" />
  <div class="media-caption">📷 Figura 1: Descripción representativa de la imagen o diagrama.</div>
</div>
```

### 2. Video de YouTube (16:9 Adaptable)
```html
<div class="video-wrapper">
  <iframe
    src="https://www.youtube.com/embed/ID_DEL_VIDEO"
    title="Título descriptivo del video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
```

### 3. Video Local (MP4 / WebM)
Guarda el video en `public/videos/nombre-video.mp4`:

```html
<video controls style="width: 100%; border-radius: 8px; margin: 1rem 0;">
  <source src="/blog-upiicsa/videos/nombre-video.mp4" type="video/mp4" />
  Tu navegador no soporta video HTML5.
</video>
```

### 4. Audio Local (MP3 / WAV)
Guarda el audio en `public/audios/nombre-audio.mp3`:

```html
<audio controls style="width: 100%; margin: 1rem 0;">
  <source src="/blog-upiicsa/audios/nombre-audio.mp3" type="audio/mpeg" />
  Tu navegador no soporta audio HTML5.
</audio>
```

---

## 📝 Conclusiones y Resumen

> Sintetiza las conclusiones principales del tema, su impacto en el desarrollo de software multimedia y el aprendizaje adquirido.

---

## 🔗 Fuentes Documentales

* Autor, A. (Año). *Título de la obra*. Editorial.
* [MDN Web Docs — Multimedia y Embebidos](https://developer.mozilla.org/es/docs/Learn/HTML/Multimedia_and_embedding)
