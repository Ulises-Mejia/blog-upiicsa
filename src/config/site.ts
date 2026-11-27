/**
 * Configuración de Marca e Identidad de UPII
 *
 * Modifica este archivo para cambiar el logo o títulos en todo el sitio:
 * - El Header y la Cortina de Bienvenida se actualizarán automáticamente.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const siteBrand = {
  // Rutas a los logos oficiales en /public/
  ipnLogoUrl: `${base}/ipn_logo.svg`,
  ipnLogoAlt: 'Escudo Oficial IPN',
  upiicsaLogoUrl: `${base}/upiicsa_logo.svg`,
  upiicsaLogoAlt: 'Escudo Oficial UPIICSA',

  // Compatibilidad con referencias previas
  logoUrl: `${base}/upiicsa_logo.svg`,
  logoAlt: 'Escudos Oficiales IPN y UPIICSA',

  // Títulos y subtítulos principales
  title: 'UPII',
  badge: 'UPIICSA',
  institution: 'INSTITUTO POLITÉCNICO NACIONAL',
  campus: 'UPIICSA',

  subtitle: {
    es: 'HERRAMIENTAS MULTIMEDIA',
    en: 'MULTIMEDIA TOOLS',
  },

  welcomeTitle: {
    es: 'Bienvenido a UPII',
    en: 'Welcome to UPII',
  },

  welcomeButton: {
    es: 'Ingresar',
    en: 'Enter',
  },
};
