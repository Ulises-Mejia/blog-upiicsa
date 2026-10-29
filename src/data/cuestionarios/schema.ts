import { z } from 'astro/zod';

export const localizedStringSchema = z.object({
  es: z.string().min(1, 'El texto en español es obligatorio'),
  en: z.string().min(1, 'English text is required'),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  unidad: z.number().int().min(1).max(3),
  tema: z.string(),
  nivel: z.enum(['basico', 'intermedio', 'avanzado']),
  pendiente: z.boolean().optional().default(false),
  enunciado: localizedStringSchema,
  opciones: z.array(localizedStringSchema).length(4, 'Deben existir exactamente 4 opciones de respuesta'),
  respuestaCorrecta: z.number().int().min(0).max(3),
  explicacion: localizedStringSchema,
});

export const quizDataSchema = z.object({
  unidad: z.number().int().min(1).max(3),
  titulo: localizedStringSchema,
  descripcion: localizedStringSchema,
  estado: z.enum(['completo', 'pendiente']),
  preguntas: z.array(quizQuestionSchema),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizData = z.infer<typeof quizDataSchema>;
