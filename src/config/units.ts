/**
 * Configuración centralizada de las unidades temáticas del repositorio.
 * Fuente única de verdad para sidebar, cabecera, panel lateral (TOC) y cuestionarios.
 */

export interface UnitConfig {
  id: 1 | 2 | 3;
  roman: 'I' | 'II' | 'III';
  short: 'U-I' | 'U-II' | 'U-III';
  label: string;
  sidebarLabel: string;
  directory: `unidad-${1 | 2 | 3}`;
  lastTopicSlug: string;
}

export const UNITS: readonly UnitConfig[] = [
  {
    id: 1,
    roman: 'I',
    short: 'U-I',
    label: 'Unidad I',
    sidebarLabel: 'Unidad I: Contexto y Fundamentos',
    directory: 'unidad-1',
    lastTopicSlug: 'unidad-1/1-4-2-base-rv',
  },
  {
    id: 2,
    roman: 'II',
    short: 'U-II',
    label: 'Unidad II',
    sidebarLabel: 'Unidad II: Tecnologías Emergentes',
    directory: 'unidad-2',
    lastTopicSlug: 'unidad-2/2-4-3-aplicaciones',
  },
  {
    id: 3,
    roman: 'III',
    short: 'U-III',
    label: 'Unidad III',
    sidebarLabel: 'Unidad III: Integración y Autoría',
    directory: 'unidad-3',
    lastTopicSlug: 'unidad-3/3-2-bis-etapas-planeacion',
  },
] as const;

export function getUnitById(id: number): UnitConfig | undefined {
  return UNITS.find((unit) => unit.id === id);
}

export function getUnitByPath(pathname: string): UnitConfig | undefined {
  return UNITS.find((unit) => pathname.includes(`/${unit.directory}/`));
}

export function getUnitQuizHref(unit: UnitConfig, base: string): string {
  return `${base}/es/${unit.directory}/cuestionario/`;
}
