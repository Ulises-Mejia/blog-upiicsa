import { quizDataSchema, type QuizData } from './schema';
import unidad1Data from './unidad-1.json';
import unidad2Data from './unidad-2.json';
import unidad3Data from './unidad-3.json';

// Validación en tiempo de compilación / importación mediante Zod
export const quizUnidad1: QuizData = quizDataSchema.parse(unidad1Data);
export const quizUnidad2: QuizData = quizDataSchema.parse(unidad2Data);
export const quizUnidad3: QuizData = quizDataSchema.parse(unidad3Data);

export const allQuizzes: Record<number, QuizData> = {
  1: quizUnidad1,
  2: quizUnidad2,
  3: quizUnidad3,
};

export function getQuizByUnit(unit: number): QuizData | undefined {
  return allQuizzes[unit];
}

export * from './schema';
