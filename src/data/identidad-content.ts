import { getCollection } from 'astro:content';
import { identidadEN } from './identidad-vr-en';

const CONTENT_ID = 'es/identidad-ipn';
const CONTENT_FILE = '/src/content/docs/es/identidad-ipn.md';

export interface LocalizedText {
  es: string;
  en: string;
}

export interface HimnoSeccion {
  id: string;
  tipo: 'estrofa' | 'coro';
  titulo: LocalizedText;
  lineas: LocalizedText[];
}

export interface IdentidadContent {
  lema: LocalizedText;
  decalogo: LocalizedText[];
  porra: {
    es: string[];
    en: string[];
  };
  himno: {
    titulo: LocalizedText;
    autorLetra: LocalizedText;
    autorMusica: LocalizedText;
    secciones: HimnoSeccion[];
  };
}

const LYRIC_SECTIONS = [
  { id: 'estrofa-inicial', heading: '#### Estrofa Inicial', tipo: 'estrofa', extract: 'blockquote' },
  { id: 'coro', heading: '#### Coro Oficial', tipo: 'coro', extract: 'note' },
  { id: 'estrofa-i', heading: '#### Estrofa I', tipo: 'estrofa', extract: 'blockquote' },
  { id: 'estrofa-ii', heading: '#### Estrofa II', tipo: 'estrofa', extract: 'blockquote' },
  { id: 'estrofa-iii', heading: '#### Estrofa III', tipo: 'estrofa', extract: 'blockquote' }
] as const;

type LyricSectionId = (typeof LYRIC_SECTIONS)[number]['id'];

function cleanMarkdown(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Devuelve el contenido entre un encabezado y el siguiente encabezado de nivel 2-4. */
function sliceSection(markdown: string, heading: string): string {
  const start = markdown.indexOf(heading);
  if (start === -1) {
    throw new Error(`No se encontró la sección "${heading}" en ${CONTENT_FILE}.`);
  }
  const rest = markdown.slice(start + heading.length);
  const nextHeading = rest.search(/\n#{2,4}\s/);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function extractBlockquotes(section: string): string[] {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('>'))
    .map((line) => cleanMarkdown(line.replace(/^>\s?/, '')))
    .filter(Boolean);
}

function extractNoteLines(section: string): string[] {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(':::'))
    .map((line) => cleanMarkdown(line))
    .filter(Boolean);
}

function expectCount(name: string, values: unknown[], expected: number): void {
  if (values.length !== expected) {
    throw new Error(
      `Contenido inesperado en ${CONTENT_FILE}: ${name} tiene ${values.length} elementos, se esperaban ${expected}.`
    );
  }
}

function buildContent(markdown: string): IdentidadContent {
  const decalogoSection = sliceSection(markdown, '## 📜 Decálogo del Politécnico');
  const decalogoEs = [...decalogoSection.matchAll(/^\s*\d+\.\s+(.+)$/gm)]
    .map((match) => cleanMarkdown(match[1]))
    .filter(Boolean);
  expectCount('el Decálogo', decalogoEs, 10);

  const lemaSection = sliceSection(markdown, '### Lema Institucional');
  const lemaEs = extractBlockquotes(lemaSection)[0]?.replace(/^"(.*)"$/, '$1');
  if (!lemaEs) {
    throw new Error(`No se encontró el lema en ${CONTENT_FILE}.`);
  }

  const porraSection = sliceSection(markdown, '### Porra Politécnica (El Huélum)');
  const porraEs = extractBlockquotes(porraSection);
  expectCount('la porra', porraEs, 5);

  const himnoSection = sliceSection(markdown, '## 🎵 Himno del Instituto Politécnico Nacional');
  const tituloEs = markdown.match(/^##\s+🎵\s+(.+)$/m)?.[1]?.trim();
  const autorLetraEs = himnoSection.match(/\*\*Letra:\*\*\s*(.+?)\.\s*$/m)?.[1]?.trim();
  const autorMusicaEs = himnoSection.match(/\*\*Música:\*\*\s*(.+?)\.\s*$/m)?.[1]?.trim();

  if (!tituloEs || !autorLetraEs || !autorMusicaEs) {
    throw new Error(`No se pudieron extraer los datos del himno en ${CONTENT_FILE}.`);
  }

  const secciones: HimnoSeccion[] = LYRIC_SECTIONS.map((config) => {
    const section = sliceSection(markdown, config.heading);
    const lineasEs =
      config.extract === 'note' ? extractNoteLines(section) : extractBlockquotes(section);
    const translation = identidadEN.himno.secciones[config.id as LyricSectionId];

    if (!lineasEs.length) {
      throw new Error(`La sección "${config.heading}" no tiene letra en ${CONTENT_FILE}.`);
    }
    if (lineasEs.length !== translation.lineas.length) {
      throw new Error(
        `La traducción de "${config.heading}" tiene ${translation.lineas.length} líneas y el Markdown ${lineasEs.length}.`
      );
    }

    return {
      id: config.id,
      tipo: config.tipo,
      titulo: {
        es: cleanMarkdown(config.heading.replace(/^####\s+/, '')),
        en: translation.titulo
      },
      lineas: lineasEs.map((es, index) => {
        const en = translation.lineas[index];
        if (!en) {
          throw new Error(`Falta la traducción de la línea ${index + 1} de "${config.heading}".`);
        }
        return { es, en };
      })
    };
  });

  const decalogo = decalogoEs.map((es, index) => {
    const en = identidadEN.decalogo[index];
    if (!en) {
      throw new Error(`Falta la traducción del punto ${index + 1} del Decálogo.`);
    }
    return { es, en };
  });

  return {
    lema: { es: lemaEs, en: identidadEN.lema },
    decalogo,
    porra: { es: porraEs, en: [...identidadEN.porra] },
    himno: {
      titulo: { es: tituloEs, en: identidadEN.himno.titulo },
      autorLetra: { es: autorLetraEs, en: identidadEN.himno.autorLetra },
      autorMusica: { es: autorMusicaEs, en: identidadEN.himno.autorMusica },
      secciones
    }
  };
}

async function readMarkdown(): Promise<string> {
  try {
    const entries = await getCollection('docs');
    const entry = entries.find((item) => item.id === CONTENT_ID || item.id === `${CONTENT_ID}.md`);
    if (entry?.body) return entry.body;
  } catch {
    // Fallback de Vite para cuando el content layer no expone el body.
  }

  const files = import.meta.glob('/src/content/docs/es/identidad-ipn.md', {
    query: '?raw',
    import: 'default',
    eager: true
  }) as Record<string, string>;
  const raw = files[CONTENT_FILE];
  if (!raw) {
    throw new Error(`No se pudo leer ${CONTENT_FILE}.`);
  }
  return raw.replace(/^---[\s\S]*?---\s*/, '');
}

export async function getIdentidadContent(): Promise<IdentidadContent> {
  return buildContent(await readMarkdown());
}
