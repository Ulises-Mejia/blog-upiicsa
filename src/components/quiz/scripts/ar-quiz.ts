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

const ANCHOR_DISTANCE = 1.45;
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

function computeWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 4
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line ? `${line} ${words[n]}` : words[n];
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n];
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  const finalLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    finalLines[maxLines - 1] = finalLines[maxLines - 1].replace(/[.,;:\s]*$/, '') + '…';
  }
  return finalLines;
}

/**
 * Envuelve el texto y dibuja el bloque centrado verticalmente alrededor de `centerY`.
 */
function drawCenteredTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  centerY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  const lines = computeWrappedLines(ctx, text, maxWidth, maxLines);
  const totalHeight = (lines.length - 1) * lineHeight;
  const startY = centerY - totalHeight / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
  return lines.length;
}

function createCanvasTexture(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
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

  private isARActive = false;
  private isLocked = false;
  private frameCount = 0;
  private validPoseFrames = 0;
  private nullPoseStreak = 0;
  private hasInitialAnchor = false;
  private hasUserInteracted = false;
  private usingViewerFallback = false;
  private localRefSpace: XRReferenceSpace | null = null;
  private viewerRefSpace: XRReferenceSpace | null = null;
  private anchorHoriz = new THREE.Vector2(0, -1);
  private anchorYOffset = 0;
  private smoothedCamQuat = new THREE.Quaternion();
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

    // Panel de pregunta (más compacto y de alta nitidez, sin espacio muerto)
    ({ canvas: this.questionCanvas, texture: this.questionTexture } = createCanvasTexture(1280, 500));
    const questionMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.32),
      new THREE.MeshBasicMaterial({ map: this.questionTexture, transparent: true, side: THREE.DoubleSide })
    );
    questionMesh.position.set(0, 0.21, 0);
    this.quizGroup.add(questionMesh);

    // 4 tarjetas de opción en cuadrícula 2x2 compacta justo debajo del enunciado
    const optionGeo = new THREE.PlaneGeometry(0.40, 0.175);
    const cardPositions = [
      { x: -0.21, y: -0.055, rotY: 0.05 },
      { x: 0.21, y: -0.055, rotY: -0.05 },
      { x: -0.21, y: -0.245, rotY: 0.05 },
      { x: 0.21, y: -0.245, rotY: -0.05 },
    ];
    cardPositions.forEach((pos, i) => {
      const { canvas, texture } = createCanvasTexture(768, 280);
      this.optionCanvases.push(canvas);
      this.optionTextures.push(texture);
      const mesh = new THREE.Mesh(
        optionGeo,
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
      );
      mesh.position.set(pos.x, pos.y, 0.015);
      mesh.rotation.y = pos.rotY;
      mesh.userData = { optionIndex: i };
      this.optionMeshes.push(mesh);
      this.quizGroup.add(mesh);
    });

    // Anillo decorativo institucional dorado (el aro verde fue retirado)
    this.ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.007, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.65 })
    );
    this.ring1.rotation.x = Math.PI / 2.2;
    this.ring1.position.set(0, -0.35, -0.04);
    this.quizGroup.add(this.ring1);

    // Panel de resultados (oculto hasta terminar)
    ({ canvas: this.resultsCanvas, texture: this.resultsTexture } = createCanvasTexture(1280, 680));
    this.resultsMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.44),
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
    Object.assign(renderer.domElement.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '-1',
      display: 'none',
    });
    document.body.appendChild(renderer.domElement);

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => this.onControllerSelect());
    this.scene.add(controller);

    this.renderer = renderer;
    return renderer;
  }

  private tick(_elapsed: number, frame?: XRFrame) {
    try {
      if (!this.isARActive || !this.renderer) return;
      this.frameCount++;

      // Verificar si ARCore ya entrega pose válida en el espacio `local` (6DoF / 3DoF)
      const localPose =
        frame && this.localRefSpace ? frame.getViewerPose(this.localRefSpace) : null;

      if (localPose !== null) {
        this.nullPoseStreak = 0;

        // Si estábamos en el respaldo `viewer`, regresar a `local` ahora que ARCore tiene pose
        if (this.usingViewerFallback && this.localRefSpace) {
          this.usingViewerFallback = false;
          this.validPoseFrames = 0;
          this.hasInitialAnchor = false;
          this.renderer.xr.setReferenceSpace(this.localRefSpace);
        }
      } else {
        this.nullPoseStreak++;

        // Si `local` aún no entrega pose tras ~12 cuadros (p. ej. poca luz o pared lisa en Android),
        // activar respaldo `viewer` para que el modelo flotante aparezca siempre de inmediato
        if (!this.usingViewerFallback && this.nullPoseStreak >= 12 && this.viewerRefSpace) {
          this.usingViewerFallback = true;
          this.renderer.xr.setReferenceSpace(this.viewerRefSpace);
          this.recenter();
        }
      }

      // Sincronizar `this.camera` con `cameraXR` ANTES de renderizar para que la estabilización
      // se aplique en el mismo cuadro sin 1 frame de retraso
      if (this.renderer.xr.isPresenting) {
        const xrCam = this.renderer.xr.getCamera();
        this.camera.position.copy(xrCam.position);
        this.camera.quaternion.copy(xrCam.quaternion);
      }

      if (localPose !== null && !this.usingViewerFallback) {
        this.validPoseFrames++;

        // Fijar el ancla inicial una sola vez cuando el giroscopio ya entregó su pose estable
        if (!this.hasInitialAnchor && this.validPoseFrames >= 3) {
          this.hasInitialAnchor = true;
          this.recenter();
        } else if (this.hasInitialAnchor) {
          // Auto-rescate durante los primeros 2 s si ARCore recalibra bruscamente el rumbo inicial
          if (this.validPoseFrames <= 90 && !this.hasUserInteracted) {
            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
            const horizDot = forward.x * this.anchorHoriz.x + forward.z * this.anchorHoriz.y;
            if (horizDot < 0.65) {
              this.recenter();
            }
          }
          // Actualizar ancla estabilizada (0% deriva posicional SLAM + amortiguación de pulso)
          this.updateStabilizedAnchor();
        }
      } else if (this.usingViewerFallback) {
        this.recenter();
      }

      this.ring1.rotation.z += 0.008;

      this.renderer.render(this.scene, this.camera);

      // Telemetría de depuración en el HUD (se conserva visible a petición del usuario)
      if (this.frameCount % 10 === 0 && this.statusText) {
        const p = this.objectAnchor.position;
        const c = this.camera.position;
        const modeTag = this.usingViewerFallback ? 'AR(3DoF)' : 'AR';
        this.statusText.textContent =
          `${modeTag}: Cam(${c.x.toFixed(1)}, ${c.y.toFixed(1)}, ${c.z.toFixed(1)}) | ` +
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

  /**
   * Mantiene el cuestionario a distancia constante de la cámara (eliminando el 100 % de la
   * deriva de traslación X/Y/Z de ARCore) y amortigua el micro-temblor del pulso de la mano
   * (tipo estabilizador óptico OIS) para que el texto se lea con total firmeza.
   */
  private updateStabilizedAnchor(distance = ANCHOR_DISTANCE) {
    // Filtro paso-bajo de la orientación de la mano
    this.smoothedCamQuat.slerp(this.camera.quaternion, 0.09);

    // Calcular el micro-temblor instantáneo de alta frecuencia: tremor = camQuat * inv(smoothedCamQuat)
    const invSmoothed = this.smoothedCamQuat.clone().invert();
    const tremorQuat = this.camera.quaternion.clone().multiply(invSmoothed);

    // Amortiguar el 82 % del micro-temblor (limitado a ~3.5° para no afectar giros voluntarios)
    const angle = 2 * Math.acos( Math.min(1, Math.abs(tremorQuat.w)) );
    const dampingFactor = angle < 0.065 ? 0.82 : Math.max(0, 0.82 * (1 - (angle - 0.065) / 0.12));
    const stabilizedQuat = new THREE.Quaternion().slerp(tremorQuat, dampingFactor);

    const offset = new THREE.Vector3(
      this.anchorHoriz.x * distance,
      this.anchorYOffset,
      this.anchorHoriz.y * distance
    ).applyQuaternion(stabilizedQuat);

    this.objectAnchor.position.copy(this.camera.position).add(offset);

    const yaw = Math.atan2(-offset.x, -offset.z);
    this.objectAnchor.rotation.set(0, yaw, 0);
    this.objectAnchor.updateMatrixWorld(true);
  }

  /**
   * Coloca el cuestionario frente a la cámara manteniéndolo nivelado con el horizonte
   * (sin inclinación lateral ni cabeceo brusco de la mano) para máxima estabilidad.
   */
  public recenter(distance = ANCHOR_DISTANCE) {
    if (this.usingViewerFallback) {
      this.objectAnchor.position.set(0, 0, -distance);
      this.objectAnchor.quaternion.identity();
      this.objectAnchor.updateMatrixWorld(true);
      return;
    }

    if (this.renderer?.xr.isPresenting) {
      const xrCam = this.renderer.xr.getCamera();
      this.camera.position.copy(xrCam.position);
      this.camera.quaternion.copy(xrCam.quaternion);
    }

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    if (Number.isFinite(dir.x) && Number.isFinite(dir.y) && Number.isFinite(dir.z)) {
      const horiz = new THREE.Vector2(dir.x, dir.z);
      if (horiz.lengthSq() > 1e-4) {
        horiz.normalize();
      } else {
        horiz.set(0, -1);
      }
      this.anchorHoriz.copy(horiz);
      this.anchorYOffset = THREE.MathUtils.clamp(dir.y * distance * 0.35, -0.22, 0.22);
      this.smoothedCamQuat.copy(this.camera.quaternion);
      this.updateStabilizedAnchor(distance);
    } else {
      this.objectAnchor.position.set(0, 0, -distance);
      this.objectAnchor.quaternion.identity();
      this.objectAnchor.updateMatrixWorld(true);
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

    const W = 1280;
    const H = 500;
    ctx.clearRect(0, 0, W, H);
    drawRoundedRect(ctx, 10, 10, W - 20, H - 20, 30);
    ctx.fillStyle = 'rgba(2, 34, 20, 0.96)';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Franja superior compacta y centrada
    const n = this.session.currentIndex + 1;
    const total = this.session.total;
    const qLabel = lang === 'en' ? `QUESTION ${n} / ${total}` : `PREGUNTA ${n} / ${total}`;
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(`${qLabel}   •   ${q.tema}`, W / 2, 46, W - 96);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(48, 76);
    ctx.lineTo(W - 48, 76);
    ctx.stroke();

    if (!answer) {
      const statement = t(q.enunciado, lang);
      const fontSize = statement.length > 140 ? 40 : statement.length > 95 ? 45 : 50;
      const lineHeight = Math.round(fontSize * 1.32);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
      // Centrado tanto horizontal (W / 2) como verticalmente en el área útil (76..490 -> 280)
      drawCenteredTextBlock(ctx, statement, W / 2, 280, W - 104, lineHeight, 5);
    } else {
      ctx.font = 'bold 46px system-ui, sans-serif';
      if (answer.isCorrect) {
        ctx.fillStyle = '#10B981';
        ctx.fillText(lang === 'en' ? '✅ CORRECT ANSWER!' : '✅ ¡RESPUESTA CORRECTA!', W / 2, 134);
      } else {
        ctx.fillStyle = '#EF4444';
        ctx.fillText(lang === 'en' ? '❌ INCORRECT ANSWER' : '❌ RESPUESTA INCORRECTA', W / 2, 134);
      }

      const explanation = t(q.explicacion, lang);
      const expFont = explanation.length > 165 ? 32 : 36;
      ctx.fillStyle = '#F1F5F9';
      ctx.font = `600 ${expFont}px system-ui, sans-serif`;
      drawCenteredTextBlock(ctx, explanation, W / 2, 290, W - 104, Math.round(expFont * 1.32), 4);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 26px system-ui, sans-serif';
      const moving = this.session.isLast
        ? lang === 'en' ? '⏳ Calculating your results...' : '⏳ Calculando tus resultados...'
        : lang === 'en' ? '⏳ Advancing to next question...' : '⏳ Avanzando a la siguiente pregunta...';
      ctx.fillText(moving, W / 2, 448);
    }
    this.questionTexture.needsUpdate = true;
  }

  private drawOptionCard(index: number, text: string, state: OptionState) {
    const ctx = this.optionCanvases[index].getContext('2d');
    if (!ctx) return;

    const palette: Record<OptionState, { bg: string; border: string; badge: string; badgeText: string }> = {
      normal: { bg: 'rgba(2, 34, 20, 0.96)', border: '#D4AF37', badge: '#D4AF37', badgeText: '#00361F' },
      correct: { bg: 'rgba(6, 95, 70, 0.97)', border: '#10B981', badge: '#10B981', badgeText: '#FFFFFF' },
      incorrect: { bg: 'rgba(127, 29, 29, 0.97)', border: '#EF4444', badge: '#EF4444', badgeText: '#FFFFFF' },
      reveal: { bg: 'rgba(6, 78, 59, 0.97)', border: '#34D399', badge: '#34D399', badgeText: '#00361F' },
    };
    const c = palette[state];

    const W = 768;
    const H = 280;
    ctx.clearRect(0, 0, W, H);
    drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 24);
    ctx.fillStyle = c.bg;
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = c.border;
    ctx.stroke();

    // Insignia circular de letra (A, B, C, D)
    ctx.beginPath();
    ctx.arc(62, H / 2, 38, 0, Math.PI * 2);
    ctx.fillStyle = c.badge;
    ctx.fill();

    ctx.fillStyle = c.badgeText;
    ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(OPTION_LETTERS[index], 62, H / 2);

    // Texto de la opción centrado tanto horizontal como verticalmente dentro del área disponible
    const textAreaLeft = 114;
    const textAreaRight = W - 24;
    const textCenterX = (textAreaLeft + textAreaRight) / 2;
    const textMaxWidth = textAreaRight - textAreaLeft;

    const optFont = text.length <= 26 ? 42 : text.length <= 60 ? 36 : 31;
    const optLineHeight = Math.round(optFont * 1.28);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${optFont}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCenteredTextBlock(ctx, text, textCenterX, H / 2, textMaxWidth, optLineHeight, 4);

    this.optionTextures[index].needsUpdate = true;
  }

  private drawResultsCard(lang: Lang) {
    const ctx = this.resultsCanvas.getContext('2d');
    if (!ctx) return;
    const { score, total, percent } = this.session;

    const W = 1280;
    const H = 680;
    ctx.clearRect(0, 0, W, H);
    drawRoundedRect(ctx, 14, 14, W - 28, H - 28, 32);
    ctx.fillStyle = 'rgba(2, 34, 20, 0.96)';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '78px system-ui, sans-serif';
    ctx.fillText('🏆', W / 2, 96);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.fillText(lang === 'en' ? 'QUIZ COMPLETED!' : '¡CUESTIONARIO COMPLETADO!', W / 2, 185);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 58px system-ui, sans-serif';
    ctx.fillText(
      `${lang === 'en' ? 'SCORE' : 'PUNTAJE'}: ${score} / ${total} (${percent}%)`,
      W / 2,
      275
    );

    ctx.fillStyle = '#F1F5F9';
    ctx.font = '600 32px system-ui, sans-serif';
    drawCenteredTextBlock(ctx, getResultMessage(percent, lang), W / 2, 385, W - 120, 44, 3);

    drawRoundedRect(ctx, (W - 620) / 2, 495, 620, 100, 24);
    ctx.fillStyle = '#00643A';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText(lang === 'en' ? '🔄 TAP HERE TO RETRY' : '🔄 TOCA AQUÍ PARA REINTENTAR', W / 2, 545);

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
    this.hasUserInteracted = true;

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
    // Respaldo exclusivo para dispositivos sin dom-overlay: si dom-overlay está activo,
    // los toques ya se procesan con coordenadas exactas en #ar-touch-plane.
    if (this.xrSession?.domOverlayState) return;
    this.handleRay(0, 0);
  }

  private bindOverlayEvents() {
    // Evitar que toques en los controles del HUD disparen eventos `select` de WebXR o raycasts
    const hudZones = this.overlay?.querySelectorAll('.ar-hud-header, .ar-hud-bottom, .ar-results-modal');
    hudZones?.forEach((zone) => {
      zone.addEventListener('beforexrselect', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      zone.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
      zone.addEventListener('touchend', (e) => e.stopPropagation(), { passive: true });
      zone.addEventListener('click', (e) => e.stopPropagation());
    });

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
      this.lastInteractionTime = performance.now();
      this.recenter();
      vibrate(30);
    });
    document.getElementById('btn-results-retry')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.lastInteractionTime = performance.now();
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

    // Solo pedimos `local` y `dom-overlay` (sin `hit-test` ni `local-floor` para evitar que
    // ARCore bloquee el inicio esperando detección de planos del suelo en interiores)
    const sessionInit: XRSessionInit = {
      requiredFeatures: ['local'],
      optionalFeatures: ['dom-overlay'],
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
        this.validPoseFrames = 0;
        this.nullPoseStreak = 0;
        this.hasInitialAnchor = false;
        this.hasUserInteracted = false;
        this.usingViewerFallback = false;

        // Limpiar coordenadas previas de la cámara para no heredar poses de una sesión anterior
        this.camera.position.set(0, 0, 0);
        this.camera.quaternion.identity();
        this.camera.updateMatrixWorld(true);

        xrSession.addEventListener('end', () => this.onSessionEnded());

        renderer.domElement.style.display = 'block';
        renderer.xr.setReferenceSpaceType('local');
        await renderer.xr.setSession(xrSession);

        this.localRefSpace = renderer.xr.getReferenceSpace();
        try {
          this.viewerRefSpace = await xrSession.requestReferenceSpace('viewer');
        } catch {
          this.viewerRefSpace = null;
        }

        const clock = new THREE.Clock();
        renderer.setAnimationLoop((_time, frame) => this.tick(clock.getElapsedTime(), frame));

        syncLanguageVisibility(this.overlay ?? document);
        this.restart();
      })
      .catch((err: any) => {
        console.error('[WebXR] Fallo al iniciar sesión AR:', err);
        if (this.overlay) this.overlay.style.display = 'none';
        if (this.renderer) this.renderer.domElement.style.display = 'none';
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
    this.validPoseFrames = 0;
    this.nullPoseStreak = 0;
    this.hasInitialAnchor = false;
    this.usingViewerFallback = false;
    this.localRefSpace = null;
    this.viewerRefSpace = null;
    this.xrSession = null;

    if (this.overlay) this.overlay.style.display = 'none';
    if (this.resultsModal) this.resultsModal.style.display = 'none';
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.renderer.domElement.style.display = 'none';
    }

    this.callbacks.onSessionEnd();
  }
}
