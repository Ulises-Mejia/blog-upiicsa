/**
 * Núcleo compartido del cuestionario (versión RA y versión 2D sin RA).
 * No depende de Three.js para que la versión 2D cargue ligera.
 */

export type Lang = 'es' | 'en';

export interface LocalizedText {
  es: string;
  en: string;
}

export interface Question {
  id: string;
  unidad: number;
  tema: string;
  nivel: string;
  pendiente?: boolean;
  enunciado: LocalizedText;
  opciones: LocalizedText[];
  respuestaCorrecta: number;
  explicacion: LocalizedText;
}

export interface QuizData {
  unidad: number;
  titulo: LocalizedText;
  descripcion: LocalizedText;
  estado: string;
  preguntas: Question[];
}

export interface AnswerResult {
  selected: number;
  correct: number;
  isCorrect: boolean;
}

/* ------------------------------------------------------------------ */
/* Idioma                                                              */
/* ------------------------------------------------------------------ */

/**
 * Idioma activo según el mecanismo del sitio (Header.astro):
 * localStorage `upiicsa_gt_lang` tiene prioridad y la cookie `googtrans` sirve de respaldo.
 */
export function getCurrentLang(): Lang {
  try {
    const stored = localStorage.getItem('upiicsa_gt_lang');
    if (stored === 'en') return 'en';
    if (stored === 'es') return 'es';
  } catch {}
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  const cookie = match ? decodeURIComponent(match[1]) : '';
  return cookie.includes('/en') ? 'en' : 'es';
}

export function t(text: LocalizedText | undefined, lang: Lang): string {
  if (!text) return '';
  return text[lang] || text.es;
}

/** Muestra/oculta los elementos `.lang-es` / `.lang-en` dentro de la raíz indicada. */
export function syncLanguageVisibility(root: ParentNode = document) {
  const isEn = getCurrentLang() === 'en';
  root.querySelectorAll<HTMLElement>('.lang-es').forEach((el) => {
    el.style.display = isEn ? 'none' : '';
  });
  root.querySelectorAll<HTMLElement>('.lang-en').forEach((el) => {
    el.style.display = isEn ? '' : 'none';
  });
}

/**
 * Notifica cambios de idioma. El botón del Header no recarga la página,
 * así que además del evento `storage` (otras pestañas) escuchamos su clic.
 */
export function onLanguageChange(callback: (lang: Lang) => void) {
  let last = getCurrentLang();
  const check = () => {
    const current = getCurrentLang();
    if (current !== last) {
      last = current;
      callback(current);
    }
  };
  window.addEventListener('storage', (e) => {
    if (e.key === 'upiicsa_gt_lang') check();
  });
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('#langToggleBtn')) setTimeout(check, 0);
  });
}

/* ------------------------------------------------------------------ */
/* Sonido (Web Audio API, sin archivos externos) y vibración            */
/* ------------------------------------------------------------------ */

const SOUND_KEY = 'upiicsa_quiz_sound';

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off');
  } catch {}
}

export class SoundFX {
  private ctx: AudioContext | null = null;

  /** Debe invocarse dentro de un gesto del usuario para desbloquear el audio en móviles. */
  public init() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.ctx = new AudioContextClass();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch {}
  }

  private tone(freq: number, start: number, duration: number, type: OscillatorType, volume: number, endFreq?: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private ready(): boolean {
    if (!isSoundEnabled()) return false;
    this.init();
    return !!this.ctx;
  }

  /** Arpegio ascendente C5 → E5 → G5. */
  public playCorrect() {
    if (!this.ready()) return;
    try {
      const now = this.ctx!.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) => this.tone(f, now + i * 0.08, 0.32, 'triangle', 0.25));
    } catch {}
  }

  /** Zumbido grave descendente. */
  public playIncorrect() {
    if (!this.ready()) return;
    try {
      this.tone(155, this.ctx!.currentTime, 0.32, 'sawtooth', 0.2, 100);
    } catch {}
  }

  /** Fanfarria C5 → E5 → G5 → C6. */
  public playFanfare() {
    if (!this.ready()) return;
    try {
      const now = this.ctx!.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, now + i * 0.1, 0.55, 'sine', 0.26));
    } catch {}
  }
}

export function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
}

export const HAPTIC_CORRECT = [40, 30, 80];
export const HAPTIC_INCORRECT = 220;
export const HAPTIC_FINISH = [70, 50, 70, 50, 150];

/* ------------------------------------------------------------------ */
/* Estado del cuestionario (compartido por RA y 2D)                     */
/* ------------------------------------------------------------------ */

export class QuizSession {
  public currentIndex = 0;
  public score = 0;
  public lastAnswer: AnswerResult | null = null;
  public answers: AnswerResult[] = [];

  constructor(public readonly data: QuizData) {}

  get total(): number {
    return this.data.preguntas.length;
  }

  get current(): Question | null {
    return this.data.preguntas[this.currentIndex] ?? null;
  }

  get isAnswered(): boolean {
    return this.lastAnswer !== null;
  }

  get isLast(): boolean {
    return this.currentIndex >= this.total - 1;
  }

  get isFinished(): boolean {
    return this.answers.length >= this.total;
  }

  get percent(): number {
    return this.total ? Math.round((this.score / this.total) * 100) : 0;
  }

  /** Registra la respuesta. Devuelve null si la pregunta ya fue contestada. */
  answer(index: number): AnswerResult | null {
    const q = this.current;
    if (!q || this.lastAnswer) return null;
    const result: AnswerResult = {
      selected: index,
      correct: q.respuestaCorrecta,
      isCorrect: index === q.respuestaCorrecta,
    };
    if (result.isCorrect) this.score++;
    this.lastAnswer = result;
    this.answers.push(result);
    return result;
  }

  /** Avanza a la siguiente pregunta. Devuelve false si ya no hay más. */
  next(): boolean {
    if (this.isLast) return false;
    this.currentIndex++;
    this.lastAnswer = null;
    return true;
  }

  restart() {
    this.currentIndex = 0;
    this.score = 0;
    this.lastAnswer = null;
    this.answers = [];
  }
}

/** Mensaje formativo según el porcentaje obtenido. */
export function getResultMessage(percent: number, lang: Lang): string {
  if (percent === 100) {
    return lang === 'en'
      ? '🏆 Outstanding! You mastered 100% of the unit concepts.'
      : '🏆 ¡Sobresaliente! Dominaste el 100% de los conceptos de la unidad.';
  }
  if (percent >= 80) {
    return lang === 'en'
      ? '✨ Great job! You showed a solid command of the topics.'
      : '✨ ¡Excelente trabajo! Demostraste un dominio sólido de los temas.';
  }
  if (percent >= 60) {
    return lang === 'en'
      ? '👍 Good attempt! Review the lessons to reinforce the details.'
      : '👍 ¡Buen intento! Repasa los temas para afianzar los detalles.';
  }
  return lang === 'en'
    ? '💡 Keep practicing! Go through the unit topics again.'
    : '💡 ¡Sigue practicando! Repasa el contenido de la unidad.';
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
