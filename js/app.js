/**
 * Repositorio Web Multimedia UPIICSA - Control de Experiencia de Usuario
 * - Manejo de Splash Screen con sessionStorage y animación de desvanecimiento CSS.
 * - Soporte responsivo para menú móvil y resalte de tema activo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const splashOverlay = document.getElementById('splashOverlay');
  const splashDismissBtn = document.getElementById('splashDismissBtn');
  const sidebar = document.getElementById('mainSidebar');
  const menuToggle = document.getElementById('menuToggle');
  const topicLinks = document.querySelectorAll('.topic-list a, .nav-root-link');

  // =========================================================================
  // 1. GESTIÓN DEL SPLASH SCREEN MEDIANTE sessionStorage
  // =========================================================================
  const STORAGE_KEY = 'upiicsa_multimedia_splash_visto';

  function closeSplashScreen() {
    if (!splashOverlay) return;

    // Agregar clase de desvanecimiento para activar animación CSS
    splashOverlay.classList.add('fade-out');

    // Registrar en sessionStorage para evitar mostrarlo nuevamente en la sesión
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('sessionStorage no disponible:', e);
    }

    // Remover completamente del flujo una vez que termine la transición
    setTimeout(() => {
      splashOverlay.style.display = 'none';
    }, 550);
  }

  // Comprobar si ya fue visto en esta sesión
  const splashYaVisto = sessionStorage.getItem(STORAGE_KEY);

  if (splashYaVisto === 'true') {
    // Si ya fue visto, ocultar inmediatamente sin bloquear la vista
    if (splashOverlay) {
      splashOverlay.style.display = 'none';
    }
  } else {
    // Si no ha sido visto, permitir cerrar con clic en cualquier parte o botón
    if (splashOverlay) {
      splashOverlay.addEventListener('click', (event) => {
        closeSplashScreen();
      });
    }

    if (splashDismissBtn) {
      splashDismissBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        closeSplashScreen();
      });
    }
  }

  // =========================================================================
  // 2. RESALTADO VISUAL DE ENLACE ACTIVO EN EL MENÚ Y CIERRE EN MÓVIL
  // =========================================================================
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function closeMobileSidebar() {
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      if (sidebarBackdrop) {
        sidebarBackdrop.classList.remove('active');
      }
    }
  }

  topicLinks.forEach(link => {
    link.addEventListener('click', () => {
      topicLinks.forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');

      // En pantallas móviles, cerrar la barra lateral al seleccionar un tema
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    });
  });

  // =========================================================================
  // 3. CONTROL DE MENÚ (VISIBLE Y ACTIVO EN TODO MOMENTO)
  // =========================================================================
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // En móviles/tablets: alternar visibilidad flotante (open)
        const willOpen = !sidebar.classList.contains('open');
        sidebar.classList.toggle('open', willOpen);
        menuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (sidebarBackdrop) {
          sidebarBackdrop.classList.toggle('active', willOpen);
        }
      } else {
        // En escritorio: colapsar o expandir hacia la izquierda
        const willCollapse = !sidebar.classList.contains('collapsed');
        sidebar.classList.toggle('collapsed', willCollapse);
        menuToggle.setAttribute('aria-expanded', willCollapse ? 'false' : 'true');
      }
    });

    // Cerrar sidebar si se hace clic en el fondo semitransparente (móvil)
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => {
        closeMobileSidebar();
      });
    }

    // Cerrar sidebar si se hace clic fuera de él en pantallas pequeñas
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
          closeMobileSidebar();
        }
      }
    });
  }
});
