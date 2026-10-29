/**
 * Versión 2D accesible del cuestionario (sin Realidad Aumentada).
 * Usa el mismo banco de preguntas y la misma lógica que la versión RA.
 *
 * Accesibilidad:
 * - Opciones como <button> nativos (teclado, lector de pantalla).
 * - Atajos de teclado 1–4 / A–D.
 * - Gestión de foco: pregunta → retroalimentación → siguiente pregunta → resultados.
 * - Avance manual (sin límites de tiempo) para respetar el ritmo de lectura.
 * - Sonido desactivable y animaciones que respetan `prefers-reduced-motion`.
 */
import {
  QuizSession,
  SoundFX,
  OPTION_LETTERS,
  HAPTIC_CORRECT,
  HAPTIC_INCORRECT,
  HAPTIC_FINISH,
  getCurrentLang,
  getResultMessage,
  isSoundEnabled,
  setSoundEnabled,
  syncLanguageVisibility,
  t,
  vibrate,
  type Lang,
  type QuizData,
} from './quiz-core';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;

export interface Quiz2DCallbacks {
  /** El usuario pidió volver a la pantalla de selección de modo. */
  onExit: () => void;
}

export class Quiz2D {
  private session: QuizSession;
  private soundFX: SoundFX;
  private callbacks: Quiz2DCallbacks;

  private root = $('quiz-2d');
  private playView = $('q2d-play');
  private resultsView = $('q2d-results');
  private progressLabel = $('q2d-progress-label');
  private scoreLabel = $('q2d-score-label');
  private progressBar = $('q2d-progress');
  private progressFill = $('q2d-progress-fill');
  private topic = $('q2d-topic');
  private question = $('q2d-question');
  private optionButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('#quiz-2d .q2d-option'));
  private feedback = $('q2d-feedback');
  private feedbackTitle = $('q2d-feedback-title');
  private feedbackText = $('q2d-feedback-text');
  private nextBtn = $<HTMLButtonElement>('q2d-next');
  private soundToggle = $<HTMLButtonElement>('q2d-sound-toggle');
  private resultsHeading = $('q2d-results-heading');
  private resultsScore = $('q2d-results-score');
  private resultsMessage = $('q2d-results-message');
  private reviewList = $('q2d-review');

  constructor(data: QuizData, soundFX: SoundFX, callbacks: Quiz2DCallbacks) {
    this.session = new QuizSession(data);
    this.soundFX = soundFX;
    this.callbacks = callbacks;
    this.bindEvents();
    this.updateSoundToggle();
  }

  /* ------------------------------ Ciclo ------------------------------ */

  public open() {
    this.session.restart();
    if (this.root) this.root.hidden = false;
    this.render();
    this.question?.focus();
    this.root?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  public close() {
    if (this.root) this.root.hidden = true;
  }

  public get isOpen(): boolean {
    return !!this.root && !this.root.hidden;
  }

  /* ----------------------------- Render ------------------------------ */

  /** Redibuja la vista completa con el estado y el idioma actuales. */
  public render() {
    const lang = getCurrentLang();
    const finished = this.session.isFinished && !this.session.lastAnswer;

    if (this.playView) this.playView.hidden = finished;
    if (this.resultsView) this.resultsView.hidden = !finished;

    this.renderHeader(lang);
    if (finished) {
      this.renderResults(lang);
    } else {
      this.renderQuestion(lang);
    }
    syncLanguageVisibility(this.root ?? document);
  }

  private renderHeader(lang: Lang) {
    const { currentIndex, total, score } = this.session;
    const n = Math.min(currentIndex + 1, total);
    if (this.progressLabel) {
      this.progressLabel.textContent = lang === 'en' ? `Question ${n} of ${total}` : `Pregunta ${n} de ${total}`;
    }
    if (this.scoreLabel) {
      this.scoreLabel.textContent = lang === 'en' ? `Correct: ${score}` : `Aciertos: ${score}`;
    }
    const answered = this.session.answers.length;
    if (this.progressBar) {
      this.progressBar.setAttribute('aria-valuenow', String(answered));
      this.progressBar.setAttribute('aria-valuemax', String(total));
      this.progressBar.setAttribute(
        'aria-valuetext',
        lang === 'en' ? `${answered} of ${total} answered` : `${answered} de ${total} respondidas`
      );
    }
    if (this.progressFill) {
      this.progressFill.style.width = `${total ? (answered / total) * 100 : 0}%`;
    }
  }

  private renderQuestion(lang: Lang) {
    const q = this.session.current;
    if (!q) return;
    const answer = this.session.lastAnswer;

    if (this.topic) this.topic.textContent = q.tema;
    if (this.question) this.question.textContent = t(q.enunciado, lang);

    this.optionButtons.forEach((btn, i) => {
      const text = btn.querySelector('.q2d-option-text');
      const status = btn.querySelector('.q2d-option-status');
      const srStatus = btn.querySelector('.q2d-option-sr');
      if (text) text.textContent = t(q.opciones[i], lang);

      btn.classList.remove('is-correct', 'is-incorrect', 'is-reveal', 'is-dimmed');
      btn.setAttribute('aria-disabled', answer ? 'true' : 'false');
      let statusIcon = '';
      let srText = '';

      if (answer) {
        if (i === answer.correct) {
          btn.classList.add(answer.isCorrect ? 'is-correct' : 'is-reveal');
          statusIcon = '✓';
          srText = answer.isCorrect
            ? lang === 'en' ? ' (your answer, correct)' : ' (tu respuesta, correcta)'
            : lang === 'en' ? ' (correct answer)' : ' (respuesta correcta)';
        } else if (i === answer.selected) {
          btn.classList.add('is-incorrect');
          statusIcon = '✗';
          srText = lang === 'en' ? ' (your answer, incorrect)' : ' (tu respuesta, incorrecta)';
        } else {
          btn.classList.add('is-dimmed');
        }
      }
      if (status) status.textContent = statusIcon;
      if (srStatus) srStatus.textContent = srText;
    });

    if (this.feedback) {
      this.feedback.hidden = !answer;
      this.feedback.classList.toggle('is-correct', !!answer?.isCorrect);
      this.feedback.classList.toggle('is-incorrect', !!answer && !answer.isCorrect);
    }
    if (answer) {
      if (this.feedbackTitle) {
        this.feedbackTitle.textContent = answer.isCorrect
          ? lang === 'en' ? '✅ Correct answer!' : '✅ ¡Respuesta correcta!'
          : lang === 'en'
            ? `❌ Incorrect. The correct answer is ${OPTION_LETTERS[answer.correct]}.`
            : `❌ Incorrecto. La respuesta correcta es la ${OPTION_LETTERS[answer.correct]}.`;
      }
      if (this.feedbackText) this.feedbackText.textContent = t(q.explicacion, lang);
      if (this.nextBtn) {
        this.nextBtn.textContent = this.session.isLast
          ? lang === 'en' ? 'See results →' : 'Ver resultados →'
          : lang === 'en' ? 'Next question →' : 'Siguiente pregunta →';
      }
    }
  }

  private renderResults(lang: Lang) {
    const { score, total, percent } = this.session;
    if (this.resultsScore) this.resultsScore.textContent = `${score} / ${total} (${percent}%)`;
    if (this.resultsMessage) this.resultsMessage.textContent = getResultMessage(percent, lang);

    if (this.reviewList) {
      this.reviewList.replaceChildren();
      this.session.data.preguntas.forEach((q, i) => {
        const a = this.session.answers[i];
        if (!a) return;
        const li = document.createElement('li');
        li.className = a.isCorrect ? 'is-correct' : 'is-incorrect';

        const icon = document.createElement('span');
        icon.className = 'review-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = a.isCorrect ? '✓' : '✗';

        const body = document.createElement('div');
        const qText = document.createElement('p');
        qText.className = 'review-question';
        qText.textContent = t(q.enunciado, lang);

        const detail = document.createElement('p');
        detail.className = 'review-detail';
        const correctText = `${OPTION_LETTERS[a.correct]}) ${t(q.opciones[a.correct], lang)}`;
        if (a.isCorrect) {
          detail.textContent = (lang === 'en' ? 'Correct: ' : 'Correcta: ') + correctText;
        } else {
          const yours = `${OPTION_LETTERS[a.selected]}) ${t(q.opciones[a.selected], lang)}`;
          detail.textContent =
            (lang === 'en' ? 'Your answer: ' : 'Tu respuesta: ') + yours +
            (lang === 'en' ? ' · Correct: ' : ' · Correcta: ') + correctText;
        }

        body.append(qText, detail);
        li.append(icon, body);
        this.reviewList!.append(li);
      });
    }
  }

  /* ---------------------------- Acciones ----------------------------- */

  private select(index: number) {
    if (this.session.lastAnswer || this.session.isFinished) return;
    this.soundFX.init();
    const result = this.session.answer(index);
    if (!result) return;

    const btn = this.optionButtons[index];
    if (result.isCorrect) {
      this.soundFX.playCorrect();
      vibrate(HAPTIC_CORRECT);
      btn?.classList.add('anim-pulse');
    } else {
      this.soundFX.playIncorrect();
      vibrate(HAPTIC_INCORRECT);
      btn?.classList.add('anim-shake');
    }
    setTimeout(() => btn?.classList.remove('anim-pulse', 'anim-shake'), 500);

    this.render();
    this.feedbackTitle?.focus();
  }

  private next() {
    if (!this.session.lastAnswer) return;
    if (this.session.next()) {
      this.render();
      this.question?.focus();
    } else {
      // Fin del cuestionario
      this.session.lastAnswer = null;
      this.soundFX.playFanfare();
      vibrate(HAPTIC_FINISH);
      this.render();
      this.resultsHeading?.focus();
    }
  }

  private updateSoundToggle() {
    if (!this.soundToggle) return;
    const on = isSoundEnabled();
    this.soundToggle.setAttribute('aria-pressed', String(on));
    this.soundToggle.classList.toggle('is-off', !on);
    const icon = this.soundToggle.querySelector('.sound-icon');
    if (icon) icon.textContent = on ? '🔊' : '🔇';
  }

  private bindEvents() {
    this.optionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('aria-disabled') === 'true') return;
        this.select(Number(btn.dataset.index));
      });
    });

    this.nextBtn?.addEventListener('click', () => this.next());

    this.soundToggle?.addEventListener('click', () => {
      setSoundEnabled(!isSoundEnabled());
      this.updateSoundToggle();
    });

    $('q2d-retry')?.addEventListener('click', () => this.open());
    $('q2d-exit')?.addEventListener('click', () => this.callbacks.onExit());
    $('q2d-results-exit')?.addEventListener('click', () => this.callbacks.onExit());

    // Atajos de teclado: 1–4 o A–D para responder
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (this.session.lastAnswer || this.session.isFinished) return;

      const key = e.key.toLowerCase();
      const idx = ['1', '2', '3', '4'].indexOf(key) !== -1 ? Number(key) - 1 : ['a', 'b', 'c', 'd'].indexOf(key);
      if (idx >= 0 && idx < this.optionButtons.length) {
        e.preventDefault();
        this.optionButtons[idx].focus();
        this.select(idx);
      }
    });
  }
}
