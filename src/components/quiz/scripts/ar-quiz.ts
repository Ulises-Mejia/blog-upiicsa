/**
 * Cuestionario en Realidad Aumentada (WebXR `immersive-ar`) con Three.js.
 * Este módulo se carga de forma diferida (import dinámico) solo en dispositivos
 * compatibles con RA, para no penalizar la versión 2D ni el resto del sitio.
 */
import * as THREE from 'three';
import {
  QuizSession,
  SoundFX,
  OPTION_LETTERS,
  HAPTIC_CORRECT,
  HAPTIC_INCORRECT,
  HAPTIC_FINISH,
  getCurrentLang,
  getResultMessage,
  syncLanguageVisibility,
  t,
  vibrate,
  type Lang,
  type QuizData,
} from './quiz-core';

type OptionState = 'normal' | 'correct' | 'incorrect' | 'reveal';

const ANCHOR_DISTANCE = 1.5;
const ADVANCE_DELAY_CORRECT = 2400;
const ADVANCE_DELAY_INCORRECT = 3400;

/* ------------------------------------------------------------------ */
/* Utilidades de dibujo en Canvas 2D                                    */
/* ------------------------------------------------------------------ */

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  ctx.closePath();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const finalLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) finalLines[maxLines - 1] += '...';
  finalLines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return finalLines.length;
}

function createCanvasTexture(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return { canvas, texture };
}

/* ------------------------------------------------------------------ */
/* Controlador RA                                                       */
/* ------------------------------------------------------------------ */

export interface ARQuizCallbacks {
  /** Se invoca cuando la sesión RA termina (por el usuario o por el sistema). */
  onSessionEnd: () => void;
  /** Se invoca si no se pudo iniciar la sesión RA. */
  onError: (message: string) => void;
}

export class ARQuizController {
  private session: QuizSession;
  private soundFX: SoundFX;
  private callbacks: ARQuizCallbacks;

  private xrSession: XRSession | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private raycaster = new THREE.Raycaster();

  private objectAnchor!: THREE.Group;
  private quizGroup!: THREE.Group;
  private questionCanvas!: HTMLCanvasElement;
  private questionTexture!: THREE.CanvasTexture;
  private optionMeshes: THREE.Mesh[] = [];
  private optionCanvases: HTMLCanvasElement[] = [];
  private optionTextures: THREE.CanvasTexture[] = [];
  private resultsMesh!: THREE.Mesh;
  private resultsCanvas!: HTMLCanvasElement;
  private resultsTexture!: THREE.CanvasTexture;
  private ring1!: THREE.Mesh;
  private ring2!: THREE.Mesh;

  private isARActive = false;
  private isLocked = false;
  private frameCount = 0;
  private lastInteractionTime = 0;
  private advanceTimer: number | null = null;

  // Elementos del overlay DOM
  private overlay = document.getElementById('ar-dom-overlay');
  private statusText = document.getElementById('ar-status-text');
  private hudProgressText = document.getElementById('hud-progress-text');
  private hudScoreText = document.getElementById('hud-score-text');
  private resultsModal = document.getElementById('ar-results-modal');
  private hudResultsScore = document.getElementById('hud-results-score');
  private hudResultsFeedback = document.getElementById('hud-results-feedback');

  constructor(data: QuizData, soundFX: SoundFX, callbacks: ARQuizCallbacks) {
    this.session = new QuizSession(data);
    this.soundFX = soundFX;
    this.callbacks = callbacks;
    this.buildScene();
    this.bindOverlayEvents();
  }

  /* ---------------------------- Escena 3D ---------------------------- */

  private buildScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 25);

    this.scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(1.5, 3, 2);
    this.scene.add(dirLight);
    const dirLightGold = new THREE.DirectionalLight(0xd4af37, 1.8);
    dirLightGold.position.set(-1.5, -1, 1.5);
    this.scene.add(dirLightGold);

    // Ancla mundial: se recoloca frente a la cámara
    this.objectAnchor = new THREE.Group();
    this.objectAnchor.position.set(0, 0, -ANCHOR_DISTANCE);
    this.scene.add(this.objectAnchor);

    this.quizGroup = new THREE.Group();
    this.objectAnchor.add(this.quizGroup);

    // Panel de pregunta
    ({ canvas: this.questionCanvas, texture: this.questionTexture } = createCanvasTexture(1024, 540));
    const questionMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.74, 0.39),
      new THREE.MeshBasicMaterial({ map: this.questionTexture, transparent: true, side: THREE.DoubleSide })
    );
    questionMesh.position.set(0, 0.23, 0);
    this.quizGroup.add(questionMesh);

    // 4 tarjetas de opción en cuadrícula 2x2 ligeramente orientadas hacia el usuario
    const optionGeo = new THREE.PlaneGeometry(0.44, 0.16);
    const cardPositions = [
      { x: -0.24, y: -0.04, rotY: 0.08 },
      { x: 0.24, y: -0.04, rotY: -0.08 },
      { x: -0.24, y: -0.22, rotY: 0.08 },
      { x: 0.24, y: -0.22, rotY: -0.08 },
    ];
    cardPositions.forEach((pos, i) => {
      const { canvas, texture } = createCanvasTexture(512, 186);
      this.optionCanvases.push(canvas);
      this.optionTextures.push(texture);
      const mesh = new THREE.Mesh(
        optionGeo,
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
      );
      mesh.position.set(pos.x, pos.y, 0.02);
      mesh.rotation.y = pos.rotY;
      mesh.userData = { optionIndex: i };
      this.optionMeshes.push(mesh);
      this.quizGroup.add(mesh);
    });

    // Anillos decorativos institucionales
    this.ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.008, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.7 })
    );
    this.ring1.rotation.x = Math.PI / 2.2;
    this.ring1.position.set(0, -0.32, -0.04);
    this.quizGroup.add(this.ring1);

    this.ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.006, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.5 })
    );
    this.ring2.rotation.y = Math.PI / 4;
    this.ring2.position.set(0, -0.32, -0.04);
    this.quizGroup.add(this.ring2);

    // Panel de resultados (oculto hasta terminar)
    ({ canvas: this.resultsCanvas, texture: this.resultsTexture } = createCanvasTexture(1024, 600));
    this.resultsMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.78, 0.46),
      new THREE.MeshBasicMaterial({ map: this.resultsTexture, transparent: true, side: THREE.DoubleSide })
    );
    this.resultsMesh.position.set(0, 0.02, 0);
    this.resultsMesh.visible = false;
    this.objectAnchor.add(this.resultsMesh);

    this.render();
  }

  /** Crea el renderizador WebGL bajo demanda (solo al iniciar RA). */
  private ensureRenderer(): THREE.WebGLRenderer {
    if (this.renderer) return this.renderer;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.xr.enabled = true;
    renderer.domElement.style.display = 'none';
    document.body.appendChild(renderer.domElement);

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => this.onControllerSelect());
    this.scene.add(controller);

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => this.tick(clock.getElapsedTime()));

    this.renderer = renderer;
    return renderer;
  }

  private tick(elapsed: number) {
    try {
      this.frameCount++;

      // En los primeros fotogramas el rastreo se estabiliza: recolocar al frente
      if (this.isARActive && (this.frameCount === 3 || this.frameCount === 12 || this.frameCount === 30)) {
        this.recenter();
      }

      this.ring1.rotation.z += 0.008;
      this.ring2.rotation.z -= 0.006;
      if (!this.session.isFinished) {
        this.quizGroup.position.y = Math.sin(elapsed * 1.5) * 0.012;
      }

      if (this.renderer) this.renderer.render(this.scene, this.camera);

      // Telemetría de depuración en el HUD (se conserva visible a petición del usuario)
      if (this.isARActive && this.frameCount % 10 === 0 && this.statusText) {
        const p = this.objectAnchor.position;
        const c = this.camera.position;
        this.statusText.textContent =
          `AR: Cam(${c.x.toFixed(1)}, ${c.y.toFixed(1)}, ${c.z.toFixed(1)}) | ` +
          `Q(${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)})`;
      }
    } catch (err: any) {
      if (this.statusText) {
        this.statusText.textContent = `Error 3D: ${err?.message || err}`;
        this.statusText.style.color = '#EF4444';
      }
      console.error('[WebXR Loop Error]', err);
    }
  }

  /** Coloca el cuestionario frente a la cámara usando su pose real (actualizada por Three.js en cada frame). */
  public recenter(distance = ANCHOR_DISTANCE) {
    const forward = new THREE.Vector3(0, 0, -distance)
      .applyQuaternion(this.camera.quaternion)
      .add(this.camera.position);
    if (Number.isFinite(forward.x) && Number.isFinite(forward.y) && Number.isFinite(forward.z)) {
      this.objectAnchor.position.copy(forward);
      this.objectAnchor.quaternion.copy(this.camera.quaternion);
    } else {
      this.objectAnchor.position.set(0, 0, -distance);
      this.objectAnchor.quaternion.identity();
    }
  }

  /* ----------------------------- Dibujo ------------------------------ */

  /** Redibuja paneles y HUD con el estado y el idioma actuales. */
  public render() {
    const lang = getCurrentLang();
    this.updateHUD(lang);

    if (this.session.isFinished) {
      this.drawResultsCard(lang);
      return;
    }
    this.drawQuestionPanel(lang);

    const q = this.session.current;
    const answer = this.session.lastAnswer;
    for (let i = 0; i < 4; i++) {
      let state: OptionState = 'normal';
      if (answer) {
        if (i === answer.correct) state = answer.isCorrect ? 'correct' : 'reveal';
        else if (i === answer.selected) state = 'incorrect';
      }
      this.drawOptionCard(i, q ? t(q.opciones[i], lang) : '', state);
    }
  }

  private drawQuestionPanel(lang: Lang) {
    const q = this.session.current;
    const ctx = this.questionCanvas.getContext('2d');
    if (!ctx || !q) return;
    const answer = this.session.lastAnswer;

    ctx.clearRect(0, 0, 1024, 540);
    drawRoundedRect(ctx, 12, 12, 1000, 516, 28);
    ctx.fillStyle = 'rgba(2, 34, 20, 0.95)';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 19px system-ui, sans-serif';
    ctx.fillText('INSTITUTO POLITÉCNICO NACIONAL • UPIICSA', 512, 52);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 78);
    ctx.lineTo(944, 78);
    ctx.stroke();

    const n = this.session.currentIndex + 1;
    const total = this.session.total;
    const qLabel = lang === 'en' ? `QUESTION ${n} OF ${total}` : `PREGUNTA ${n} DE ${total}`;
    const topicLabel = lang === 'en' ? `Topic: ${q.tema}` : `Tema: ${q.tema}`;
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(`${qLabel}  •  ${topicLabel}`, 512, 110);

    if (!answer) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px system-ui, sans-serif';
      wrapTextLines(ctx, t(q.enunciado, lang), 512, 210, 880, 44, 4);

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(
        lang === 'en'
          ? '👇 Tap the correct option card below on your screen'
          : '👇 Toca la tarjeta de la opción correcta abajo en tu pantalla',
        512,
        455
      );
    } else {
      ctx.font = 'bold 36px system-ui, sans-serif';
      if (answer.isCorrect) {
        ctx.fillStyle = '#10B981';
        ctx.fillText(lang === 'en' ? '✅ CORRECT ANSWER!' : '✅ ¡RESPUESTA CORRECTA!', 512, 190);
      } else {
        ctx.fillStyle = '#EF4444';
        ctx.fillText(lang === 'en' ? '❌ INCORRECT ANSWER' : '❌ RESPUESTA INCORRECTA', 512, 190);
      }

      ctx.fillStyle = '#E5E7EB';
      ctx.font = '22px system-ui, sans-serif';
      wrapTextLines(ctx, t(q.explicacion, lang), 512, 270, 860, 36, 4);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 18px system-ui, sans-serif';
      const moving = this.session.isLast
        ? lang === 'en' ? '⏳ Calculating your results...' : '⏳ Calculando tus resultados...'
        : lang === 'en' ? '⏳ Advancing to next question...' : '⏳ Avanzando a la siguiente pregunta...';
      ctx.fillText(moving, 512, 460);
    }
    this.questionTexture.needsUpdate = true;
  }

  private drawOptionCard(index: number, text: string, state: OptionState) {
    const ctx = this.optionCanvases[index].getContext('2d');
    if (!ctx) return;

    const palette: Record<OptionState, { bg: string; border: string; badge: string; badgeText: string }> = {
      normal: { bg: 'rgba(2, 34, 20, 0.94)', border: '#D4AF37', badge: '#D4AF37', badgeText: '#00361F' },
      correct: { bg: 'rgba(6, 95, 70, 0.96)', border: '#10B981', badge: '#10B981', badgeText: '#FFFFFF' },
      incorrect: { bg: 'rgba(127, 29, 29, 0.96)', border: '#EF4444', badge: '#EF4444', badgeText: '#FFFFFF' },
      reveal: { bg: 'rgba(6, 78, 59, 0.96)', border: '#34D399', badge: '#34D399', badgeText: '#00361F' },
    };
    const c = palette[state];

    ctx.clearRect(0, 0, 512, 186);
    drawRoundedRect(ctx, 8, 8, 496, 170, 18);
    ctx.fillStyle = c.bg;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = c.border;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(46, 93, 26, 0, Math.PI * 2);
    ctx.fillStyle = c.badge;
    ctx.fill();

    ctx.fillStyle = c.badgeText;
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(OPTION_LETTERS[index], 46, 94);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    wrapTextLines(ctx, text, 88, 70, 395, 28, 3);

    this.optionTextures[index].needsUpdate = true;
  }

  private drawResultsCard(lang: Lang) {
    const ctx = this.resultsCanvas.getContext('2d');
    if (!ctx) return;
    const { score, total, percent } = this.session;

    ctx.clearRect(0, 0, 1024, 600);
    drawRoundedRect(ctx, 16, 16, 992, 568, 30);
    ctx.fillStyle = 'rgba(2, 34, 20, 0.96)';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '64px system-ui, sans-serif';
    ctx.fillText('🏆', 512, 90);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.fillText(lang === 'en' ? 'QUIZ COMPLETED!' : '¡CUESTIONARIO COMPLETADO!', 512, 165);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 46px system-ui, sans-serif';
    ctx.fillText(
      `${lang === 'en' ? 'SCORE' : 'PUNTAJE'}: ${score} / ${total} (${percent}%)`,
      512,
      245
    );

    ctx.fillStyle = '#E5E7EB';
    ctx.font = '22px system-ui, sans-serif';
    wrapTextLines(ctx, getResultMessage(percent, lang), 512, 315, 880, 34, 2);

    drawRoundedRect(ctx, 262, 410, 500, 78, 20);
    ctx.fillStyle = '#00643A';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText(lang === 'en' ? '🔄 TAP HERE TO RETRY' : '🔄 TOCA AQUÍ PARA REINTENTAR', 512, 450);

    this.resultsTexture.needsUpdate = true;
  }

  private updateHUD(lang: Lang) {
    const { currentIndex, total, score, percent } = this.session;
    if (this.hudProgressText) {
      this.hudProgressText.textContent = `${lang === 'en' ? 'Q' : 'P'} ${Math.min(currentIndex + 1, total)} / ${total}`;
    }
    if (this.hudScoreText) {
      this.hudScoreText.textContent = `${lang === 'en' ? 'Score' : 'Aciertos'}: ${score}`;
    }
    if (this.hudResultsScore) {
      this.hudResultsScore.textContent = `${score} / ${total} (${percent}%)`;
    }
    if (this.hudResultsFeedback) {
      this.hudResultsFeedback.textContent = getResultMessage(percent, lang);
    }
  }

  /* --------------------------- Animaciones --------------------------- */

  private pulseMesh(mesh: THREE.Mesh, duration = 320) {
    const start = performance.now();
    const orig = mesh.scale.clone();
    const step = (now: number) => {
      const k = (now - start) / duration;
      if (k < 1) {
        const f = 1 + Math.sin(k * Math.PI) * 0.16;
        mesh.scale.set(orig.x * f, orig.y * f, orig.z);
        requestAnimationFrame(step);
      } else {
        mesh.scale.copy(orig);
      }
    };
    requestAnimationFrame(step);
  }

  private shakeMesh(mesh: THREE.Mesh, duration = 400) {
    const start = performance.now();
    const origX = mesh.position.x;
    const step = (now: number) => {
      const k = (now - start) / duration;
      if (k < 1) {
        mesh.position.x = origX + Math.sin(k * Math.PI * 7) * 0.024;
        requestAnimationFrame(step);
      } else {
        mesh.position.x = origX;
      }
    };
    requestAnimationFrame(step);
  }

  /* ------------------------ Lógica del cuestionario ------------------------ */

  private selectOption(index: number) {
    if (this.isLocked || this.session.isFinished) return;
    const result = this.session.answer(index);
    if (!result) return;
    this.isLocked = true;

    const mesh = this.optionMeshes[index];
    if (result.isCorrect) {
      this.soundFX.playCorrect();
      vibrate(HAPTIC_CORRECT);
      this.pulseMesh(mesh);
    } else {
      this.soundFX.playIncorrect();
      vibrate(HAPTIC_INCORRECT);
      this.shakeMesh(mesh);
    }
    this.render();

    this.advanceTimer = window.setTimeout(
      () => {
        this.advanceTimer = null;
        if (this.session.next()) {
          this.isLocked = false;
          this.render();
        } else {
          this.finish();
        }
      },
      result.isCorrect ? ADVANCE_DELAY_CORRECT : ADVANCE_DELAY_INCORRECT
    );
  }

  private finish() {
    this.isLocked = false;
    this.soundFX.playFanfare();
    vibrate(HAPTIC_FINISH);

    this.quizGroup.visible = false;
    this.resultsMesh.visible = true;
    this.render();

    if (this.resultsModal) this.resultsModal.style.display = 'flex';
    syncLanguageVisibility(this.overlay ?? document);
  }

  public restart() {
    if (this.advanceTimer !== null) {
      clearTimeout(this.advanceTimer);
      this.advanceTimer = null;
    }
    this.session.restart();
    this.isLocked = false;
    if (this.resultsModal) this.resultsModal.style.display = 'none';
    this.resultsMesh.visible = false;
    this.quizGroup.visible = true;
    this.render();
    this.recenter();
  }

  /* ---------------------------- Interacción ---------------------------- */

  /** Resuelve un toque: opción → responder; resultados → reintentar; vacío → recentrar. */
  private handleRay(ndcX: number, ndcY: number) {
    const now = performance.now();
    if (now - this.lastInteractionTime < 280) return;
    this.lastInteractionTime = now;

    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);

    if (this.session.isFinished) {
      if (this.resultsMesh.visible && this.raycaster.intersectObject(this.resultsMesh).length > 0) {
        this.restart();
        return;
      }
    } else if (!this.isLocked) {
      const hits = this.raycaster.intersectObjects(this.optionMeshes);
      const optIdx = hits[0]?.object.userData.optionIndex;
      if (typeof optIdx === 'number') {
        this.selectOption(optIdx);
        return;
      }
    }

    this.recenter();
    vibrate(30);
  }

  private onScreenTap(clientX: number, clientY: number) {
    this.handleRay((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  }

  private onControllerSelect() {
    // Respaldo para dispositivos sin dom-overlay: rayo desde el centro de la vista
    this.handleRay(0, 0);
  }

  private bindOverlayEvents() {
    const touchPlane = document.getElementById('ar-touch-plane');
    touchPlane?.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      this.onScreenTap(e.clientX, e.clientY);
    });
    touchPlane?.addEventListener(
      'touchend',
      (e: TouchEvent) => {
        const touch = e.changedTouches?.[0];
        if (!touch) return;
        e.stopPropagation();
        this.onScreenTap(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    document.getElementById('btn-exit-ar')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.end();
    });
    document.getElementById('btn-recenter-ar')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.recenter();
    });
    document.getElementById('btn-results-retry')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.restart();
    });
    document.getElementById('btn-results-exit')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.end();
    });
  }

  /* ----------------------------- Sesión XR ----------------------------- */

  /**
   * Inicia la sesión RA. Debe llamarse directamente desde el gesto del usuario:
   * no hay ningún `await` antes de `requestSession` para conservar la activación.
   */
  public start() {
    if (!navigator.xr) {
      this.callbacks.onError('WebXR no disponible en este navegador.');
      return;
    }
    const renderer = this.ensureRenderer();

    const sessionInit: XRSessionInit = {
      requiredFeatures: ['local'],
      optionalFeatures: ['dom-overlay', 'hit-test', 'local-floor'],
    };
    if (this.overlay) {
      this.overlay.style.display = 'flex';
      sessionInit.domOverlay = { root: this.overlay };
    }

    navigator.xr
      .requestSession('immersive-ar', sessionInit)
      .then(async (xrSession) => {
        this.xrSession = xrSession;
        this.isARActive = true;
        this.frameCount = 0;
        xrSession.addEventListener('end', () => this.onSessionEnded());

        renderer.xr.setReferenceSpaceType('local');
        await renderer.xr.setSession(xrSession);

        syncLanguageVisibility(this.overlay ?? document);
        this.restart();
      })
      .catch((err: any) => {
        console.error('[WebXR] Fallo al iniciar sesión AR:', err);
        if (this.overlay) this.overlay.style.display = 'none';
        this.callbacks.onError(
          err?.message || 'Permiso de cámara denegado o error de inicialización en el dispositivo.'
        );
      });
  }

  public end() {
    this.xrSession?.end().catch(() => {});
  }

  private onSessionEnded() {
    if (this.advanceTimer !== null) {
      clearTimeout(this.advanceTimer);
      this.advanceTimer = null;
    }
    this.isARActive = false;
    this.isLocked = false;
    this.frameCount = 0;
    this.xrSession = null;

    if (this.overlay) this.overlay.style.display = 'none';
    if (this.resultsModal) this.resultsModal.style.display = 'none';
    if (this.renderer) this.renderer.domElement.style.display = 'none';

    this.callbacks.onSessionEnd();
  }
}
