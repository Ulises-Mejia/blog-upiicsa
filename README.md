# 🏛️ Repositorio Web Multimedia - UPIICSA (IPN)

Plataforma web estática desarrollada con tecnologías **Web Vanilla** (HTML5 semántico, CSS3 puro y JavaScript mínimo) diseñada para funcionar como el repositorio digital de conocimientos de la asignatura de **Multimedia** en la **Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas (UPIICSA - IPN)**.

---

## 🎯 Características Principales

- **Arquitectura Nivel Iframe:** La página central `index.html` gestiona el Header, Sidebar y Footer, cargando los temas en un `<iframe name="visor-temas">` mediante enlaces nativos con `target="visor-temas"`, sin recargar la página ni usar frameworks.
- **Identidad Institucional IPN / UPIICSA:**
  - **Verde UPIICSA (`#00643A`):** Cabecera y fondo del árbol de navegación.
  - **Dorado / Mostaza (`#D4AF37`):** Líneas de acento, bordes, estados hover y badges.
  - **Gris Claro / Blanco (`#F8F9FA` / `#FFFFFF`):** Área de lectura con alto contraste y legibilidad tipográfica.
- **Splash Screen de Bienvenida:** Pantalla completa de presentación en Verde UPIICSA con animación de desvanecimiento suave (`fade-out`). Utiliza `sessionStorage` para mostrarse únicamente la primera vez en cada sesión de navegación.
- **Menú de Navegación Jerárquico:** Construido de forma nativa con etiquetas `<details>` y `<summary>` para explorar las Unidades I, II y III con sus respectivos subtemas.
- **25 Subtemas Oficiales + Bienvenida y Autores:** Cada tema cuenta con un archivo HTML independiente en la carpeta `/vistas/`, estructurado con marco teórico, tablas comparativas, resúmenes y una **Zona de Contribución Estudiantil**.

---

## 📁 Estructura del Proyecto

```
/blog_upiicsa
├── index.html                     # Estructura maestra (Header, Sidebar, Iframe, Footer, Splash)
├── README.md                      # Documentación del proyecto
├── css/
│   ├── style.css                  # Estilos globales y diseño responsivo del layout
│   └── vista.css                  # Estilos institucionales para los documentos internos del iframe
├── js/
│   └── app.js                     # Control del Splash Screen (sessionStorage) y menú móvil
├── assets/
│   ├── ipn_logo.svg               # Identidad vectorial SVG del IPN
│   └── upiicsa_logo.svg           # Identidad vectorial SVG de la UPIICSA
└── vistas/
    ├── inicio.html                # Portada principal y guía para alumnos
    ├── autores.html               # Créditos de estudiantes y docentes
    │
    │   # UNIDAD I: Contexto de la multimedia para aplicaciones informáticas
    ├── 1-1-1-elementos.html
    ├── 1-1-2-evolucion.html
    ├── 1-1-3-web.html
    ├── 1-1-4-formatos.html
    ├── 1-2-1-etapas.html
    ├── 1-2-2-camara.html
    ├── 1-2-3-imagen.html
    ├── 1-2-4-audio.html
    ├── 1-3-1-conceptualizacion.html
    ├── 1-3-2-tipos.html
    ├── 1-3-3-procesos.html
    ├── 1-4-1-tecnologias.html
    ├── 1-4-2-base-rv.html
    │
    │   # UNIDAD II: Tecnologías emergentes en las herramientas multimedias
    ├── 2-1-1-caracteristicas.html
    ├── 2-1-2-diferencias.html
    ├── 2-1-3-hibridacion.html
    ├── 2-2-1-recorridos.html
    ├── 2-2-2-software.html
    ├── 2-2-3-herramientas.html
    ├── 2-2-4-aplicaciones.html
    ├── 2-2-5-motores.html
    ├── 2-3-1-lenguajes-web.html
    ├── 2-3-2-lenguajes-grafica.html
    ├── 2-4-1-ambientes.html
    ├── 2-4-2-integracion.html
    ├── 2-4-3-aplicaciones.html
    │
    │   # UNIDAD III: Desarrollo e integración de herramientas multimedia
    ├── 3-1-1-edicion-video.html
    ├── 3-1-2-herramientas.html
    ├── 3-2-1-software-autoria.html
    ├── 3-2-2-software-originalidad.html
    ├── 3-2-3-registro.html
    └── 3-2-bis-etapas-planeacion.html
```

---

## 🚀 Despliegue en GitHub Pages

Al estar construido enteramente con archivos estáticos y rutas relativas, el despliegue es inmediato:

1. Crea un repositorio en tu cuenta de GitHub (por ejemplo: `repositorio-multimedia-upiicsa`).
2. Sube los archivos del proyecto a la rama `main` o `master`:
   ```bash
   git init
   git add .
   git commit -m "feat: Repositorio Web Multimedia UPIICSA inicial"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/repositorio-multimedia-upiicsa.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings** &rarr; **Pages**.
4. En **Build and deployment** / **Branch**, selecciona `main` y la carpeta `/(root)`.
5. Haz clic en **Save**. En un par de minutos tu sitio estará en línea en:
   `https://<tu-usuario>.github.io/repositorio-multimedia-upiicsa/`

---

## 🤝 ¿Cómo contribuir como estudiante?

Cada archivo en `/vistas/` cuenta con la siguiente sección editable para que futuros alumnos añadan contenido:

```html
<!-- ===================================================================
     ZONA DE CONTRIBUCIÓN ESTUDIANTIL
     Agrega aquí tus notas de clase o ejemplos prácticos.
     =================================================================== -->
<div class="contribution-zone">
  ...
</div>
```

Puedes agregar apuntes, enlaces a videos, ejercicios en Python/OpenCV o snippets de código sin romper el estilo visual de la plataforma.

---

**Instituto Politécnico Nacional — UPIICSA**  
*“La Técnica al Servicio de la Patria”*
