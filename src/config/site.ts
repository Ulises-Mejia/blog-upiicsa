/**
 * Configuración de Marca e Identidad del Repositorio
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
  title: 'MULTIMEDIA',
  badge: 'UPIICSA',
  institution: 'INSTITUTO POLITÉCNICO NACIONAL',
  campus: 'UPIICSA',
  
  subtitle: {
    es: 'REPOSITORIO DIGITAL DE CONOCIMIENTOS',
    en: 'DIGITAL KNOWLEDGE REPOSITORY',
  },
  
  welcomeDescription: {
    es: 'Repositorio Digital de Conocimientos y Recursos Multimedia para la Unidad de Aprendizaje de Herramientas Multimedia.',
    en: 'Digital Knowledge and Multimedia Resources Repository for the Multimedia Tools Academic Unit.',
  },
  
  welcomeButton: {
    es: 'Ingresar al Repositorio',
    en: 'Enter Repository',
  },
};
