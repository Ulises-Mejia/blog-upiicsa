// Textos de interfaz (no son contenido editorial).
const identidadUI = {
  fullscreen: { es: "Pantalla completa", en: "Fullscreen" },
  vrMode: { es: "Entrar en modo VR", en: "Enter VR mode" },
  noWebGL: {
    es: "Este navegador no soporta WebGL. No es posible mostrar la sala de realidad virtual.",
    en: "This browser does not support WebGL. The virtual reality room cannot be displayed."
  },
  loadError: {
    es: "No se pudo cargar el contenido de la sala. Recarga la página para intentarlo de nuevo.",
    en: "The room content could not be loaded. Reload the page to try again."
  },
  hymn: { es: "HIMNO POLITÉCNICO", en: "POLYTECHNIC HYMN" },
  hymnSubtitle: { es: "Símbolo institucional", en: "Institutional symbol" },
  play: { es: "Reproducir", en: "Play" },
  pause: { es: "Pausar", en: "Pause" },
  audioError: { es: "No se pudo reproducir el audio", en: "Audio could not be played" },
  lyrics: { es: "Mostrar letra", en: "Show lyrics" },
  hideLyrics: { es: "Ocultar letra", en: "Hide lyrics" },
  decalogue: { es: "DECÁLOGO POLITÉCNICO", en: "POLYTECHNIC DECALOGUE" },
  cheer: { es: "PORRA POLITÉCNICA", en: "POLYTECHNIC CHEER" },
  approach: { es: "Acércate para leer", en: "Approach to read" },
  center: { es: "Escudo IPN", en: "IPN Shield" },
  moveHelp: { es: "Muévete con el joystick o WASD", en: "Move with the joystick or WASD" },
  vrHelp: { es: "Teletransporte con el thumbstick", en: "Teleport with the thumbstick" },
  hudHimnoPlay: { es: "Reproducir himno", en: "Play hymn" },
  hudHimnoPause: { es: "Pausar himno", en: "Pause hymn" },
  quiz: { es: "Quiz Identidad", en: "Identity Quiz" },
  bannerTitle: { es: "IDENTIDAD INSTITUCIONAL", en: "INSTITUTIONAL IDENTITY" },
  bannerSubtitle: {
    es: "INSTITUTO POLITÉCNICO NACIONAL",
    en: "NATIONAL POLYTECHNIC INSTITUTE"
  },
  joystick: { es: "Mover", en: "Move" },
  lookAround: {
    es: "Mira a tu alrededor para explorar las estaciones",
    en: "Look around to explore the stations"
  },
  loading: { es: "Cargando sala...", en: "Loading room..." },
  viewDecalogue: { es: "Ver Decálogo", en: "View Decalogue" },
  ttsUnavailable: { es: "TTS no disponible", en: "TTS not available" }
};

// El quiz sigue siendo un módulo independiente; no se toca en esta fase.
const identidadQuiz = {
  es: {
    title: "Quiz Identidad Institucional IPN",
    subtitle: "Pon a prueba tus conocimientos",
    start: "Iniciar Quiz",
    next: "Siguiente",
    finish: "Finalizar",
    restart: "Reintentar",
    score: "Puntuación",
    correct: "Correcta",
    incorrect: "Incorrecta",
    questions: [
      { pregunta: "¿Quién escribió la letra del Himno del IPN?", opciones: ["José Vasconcelos", "Carmen de la Fuente", "Jaime Torres Bodet", "Justo Sierra"], correcta: 1 },
      { pregunta: "¿Cuál es el lema del Instituto Politécnico Nacional?", opciones: ["Educar para Transformar", "La Técnica al Servicio de la Patria", "Ciencia y Patria", "Por una Patria Mejor"], correcta: 1 },
      { pregunta: "¿Cuántos puntos tiene el Decálogo Politécnico?", opciones: ["5", "7", "10", "12"], correcta: 2 },
      { pregunta: "¿Qué colores representa la tradición politécnica?", opciones: ["Azul y Oro", "Guinda y Blanco", "Verde y Blanco", "Rojo y Negro"], correcta: 1 },
      { pregunta: "¿Cómo se llama la porra politécnica?", opciones: ["Goya", "Huélum", "Olé", "Hala"], correcta: 1 }
    ]
  },
  en: {
    title: "IPN Institutional Identity Quiz",
    subtitle: "Test your knowledge",
    start: "Start Quiz",
    next: "Next",
    finish: "Finish",
    restart: "Retry",
    score: "Score",
    correct: "Correct",
    incorrect: "Incorrect",
    questions: [
      { pregunta: "Who wrote the lyrics of the IPN Hymn?", opciones: ["José Vasconcelos", "Carmen de la Fuente", "Jaime Torres Bodet", "Justo Sierra"], correcta: 1 },
      { pregunta: "What is the motto of the National Polytechnic Institute?", opciones: ["Educate to Transform", "Technology at the Service of the Nation", "Science and Homeland", "For a Better Homeland"], correcta: 1 },
      { pregunta: "How many points does the Polytechnic Decalogue have?", opciones: ["5", "7", "10", "12"], correcta: 2 },
      { pregunta: "What colors represent the polytechnic tradition?", opciones: ["Blue and Gold", "Guinda and White", "Green and White", "Red and Black"], correcta: 1 },
      { pregunta: "What is the name of the polytechnic cheer?", opciones: ["Goya", "Huélum", "Olé", "Hala"], correcta: 1 }
    ]
  }
};

function getLang() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('lang') === 'en') return 'en';
    if (urlParams.get('lang') === 'es') return 'es';
    const stored = localStorage.getItem('upiicsa_gt_lang');
    if (stored === 'en' || stored === 'es') return stored;
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    if (match) {
      const cookie = decodeURIComponent(match[1]);
      if (cookie.includes('/en')) return 'en';
      if (cookie.includes('/es')) return 'es';
    }
  } catch (e) {}
  return 'es';
}

const lang = getLang();
const t = (obj) => (obj && (obj[lang] || obj.es)) || '';

function checkWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('no webgl');
    return true;
  } catch (e) {
    const panel = document.getElementById('no-webgl');
    const text = document.getElementById('no-webgl-text');
    if (panel) panel.style.display = 'block';
    if (text) text.textContent = t(identidadUI.noWebGL);
    return false;
  }
}

async function loadContent() {
  const url = new URL('../api/identidad-vr.json', window.location.href);
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${url}: HTTP ${response.status}`);
  }
  return response.json();
}

function sceneReady() {
  const scene = document.querySelector('a-scene');
  if (!scene) return Promise.resolve();
  if (scene.hasLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    scene.addEventListener('loaded', resolve, { once: true });
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('value', value);
}

// A-Frame emite click por touch y por el mouse sintetizado; sin este filtro
// un toque en móvil abre/cierra o reproduce/pausa dos veces seguidas.
function addClickOnce(el, handler) {
  if (!el) return;
  let lastClick = 0;
  el.addEventListener('click', (event) => {
    const now = performance.now();
    if (now - lastClick < 350) return;
    lastClick = now;
    handler(event);
  });
}

function applyContent(content) {
  document.documentElement.lang = lang;

  // Estación Himno
  setText('himno-title', t(identidadUI.hymn));
  setText('himno-subtitle', t(identidadUI.hymnSubtitle));
  setText(
    'himno-info',
    `${t(content.himno.autorLetra)}\n${t(content.himno.autorMusica)}`
  );
  setText('himno-btn-text', t(identidadUI.play));
  setText('himno-lyrics-text', t(identidadUI.lyrics));

  // Estación Decálogo
  setText('decalogo-title', t(identidadUI.decalogue));
  setText('decalogo-btn-text', t(identidadUI.viewDecalogue));
  setText('decalogo-approach', t(identidadUI.approach));
  const decalogueTitle = document.getElementById('decalogue-title');
  if (decalogueTitle) decalogueTitle.textContent = t(identidadUI.decalogue);

  // Estación Porra
  setText('porra-title', t(identidadUI.cheer));
  setText('porra-btn-text', t(identidadUI.play));
  const porraLines = content.porra[lang] || content.porra.es;
  porraLines.forEach((line, index) => setText(`porra-line-${index}`, line));
  setText('porra-status', '');

  // Banner, escudo y lema
  setText('banner-title', t(identidadUI.bannerTitle));
  setText('banner-subtitle', t(identidadUI.bannerSubtitle));
  setText('escudo-label', t(identidadUI.center));
  setText('lema-text', t(content.lema));

  // Panel del Decálogo
  const decalogueContent = document.getElementById('decalogue-content');
  if (decalogueContent) {
    decalogueContent.innerHTML = '';
    content.decalogo.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'decalogue-item';
      const number = document.createElement('strong');
      number.textContent = `${index + 1}.`;
      div.append(number, document.createTextNode(` ${t(item)}`));
      decalogueContent.appendChild(div);
    });
  }

  // Panel de letra completa del himno
  const lyricsTitle = document.getElementById('lyrics-title');
  if (lyricsTitle) lyricsTitle.textContent = t(content.himno.titulo);
  const lyricsContent = document.getElementById('lyrics-content');
  if (lyricsContent) {
    lyricsContent.innerHTML = '';
    content.himno.secciones.forEach((section) => {
      const heading = document.createElement('h3');
      heading.textContent = t(section.titulo);
      const stanza = document.createElement('div');
      stanza.className = 'lyrics-stanza';
      section.lineas.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = t(line);
        stanza.appendChild(p);
      });
      lyricsContent.append(heading, stanza);
    });
  }
}

function pausePageAudio() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.document.querySelectorAll('audio').forEach((audio) => {
        if (!audio.paused) audio.pause();
      });
    }
  } catch (error) {
    // El iframe puede estar aislado; no es un fallo de la escena.
  }
}

function setupHimno(content) {
  const button = document.getElementById('himno-btn');
  const buttonText = document.getElementById('himno-btn-text');
  const hudButton = document.getElementById('btn-himno');
  const audio = document.getElementById('himno-audio');
  const info = document.getElementById('himno-info');
  const lyricsToggle = document.getElementById('himno-lyrics-toggle');
  const lyricsText = document.getElementById('himno-lyrics-text');
  const lyricsPanel = document.getElementById('lyrics-panel');
  const lyricsClose = document.getElementById('lyrics-close');
  let infoTimer = null;

  function defaultInfo() {
    return `${t(content.himno.autorLetra)}\n${t(content.himno.autorMusica)}`;
  }

  function updateButton() {
    const playing = !!audio && !audio.paused;
    buttonText?.setAttribute('value', t(playing ? identidadUI.pause : identidadUI.play));
    if (hudButton) {
      hudButton.textContent = t(playing ? identidadUI.hudHimnoPause : identidadUI.hudHimnoPlay);
      hudButton.setAttribute('aria-pressed', String(playing));
    }
  }

  function showInfo(message) {
    if (!info) return;
    info.setAttribute('value', message);
    if (infoTimer) window.clearTimeout(infoTimer);
    infoTimer = window.setTimeout(() => {
      info.setAttribute('value', defaultInfo());
    }, 2600);
  }

  async function toggle() {
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }

    pausePageAudio();
    if (audio.ended) audio.currentTime = 0;

    try {
      await audio.play();
    } catch (error) {
      updateButton();
      showInfo(t(identidadUI.audioError));
    }
  }

  audio?.addEventListener('play', updateButton);
  audio?.addEventListener('pause', updateButton);
  audio?.addEventListener('ended', updateButton);
  audio?.addEventListener('error', () => showInfo(t(identidadUI.audioError)));

  addClickOnce(button, toggle);
  hudButton?.addEventListener('click', toggle);

  addClickOnce(lyricsToggle, () => {
    if (!lyricsPanel) return;
    const visible = lyricsPanel.classList.toggle('visible');
    if (lyricsText) {
      lyricsText.setAttribute('value', t(visible ? identidadUI.hideLyrics : identidadUI.lyrics));
    }
  });

  lyricsClose?.addEventListener('click', () => {
    lyricsPanel?.classList.remove('visible');
    if (lyricsText) lyricsText.setAttribute('value', t(identidadUI.lyrics));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audio && !audio.paused) audio.pause();
  });

  updateButton();
}

function setupDecalogo() {
  const button = document.getElementById('decalogo-btn');
  const panel = document.getElementById('decalogue-panel');
  const close = document.getElementById('decalogue-close');

  addClickOnce(button, () => panel?.classList.add('visible'));
  close?.addEventListener('click', () => panel?.classList.remove('visible'));
}

function setupResponsiveCamera() {
  const cameraEl = document.querySelector('[camera]');
  const rig = document.getElementById('cameraRig');
  if (!cameraEl || !rig) return;

  let initialPositionSet = false;

  function apply() {
    const aspect = window.innerWidth / window.innerHeight;
    let fov = 60;

    if (aspect < 1) {
      // En vertical el FOV horizontal se estrecha mucho; abrimos la cámara
      // para que las estaciones laterales sigan entrando en pantalla.
      const targetHorizontal = (64 * Math.PI) / 180;
      const vertical = 2 * Math.atan(Math.tan(targetHorizontal / 2) / aspect);
      fov = Math.min(102, Math.max(60, (vertical * 180) / Math.PI));
    } else if (aspect < 1.3) {
      fov = 75;
    }

    cameraEl.setAttribute('camera', 'fov', fov);

    if (!initialPositionSet && aspect < 1) {
      rig.setAttribute('position', '0 0 5.2');
      initialPositionSet = true;
    }
  }

  apply();
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', () => window.setTimeout(apply, 250));
}

function setupJoystick() {
  const joystick = document.getElementById('joystick');
  const base = document.getElementById('joystick-base');
  const knob = document.getElementById('joystick-knob');
  const scene = document.querySelector('a-scene');
  const rig = document.getElementById('cameraRig');
  if (!joystick || !base || !knob || !scene || !rig) return;

  const maxRadius = 38;
  const speed = 2.4;
  const limit = 7.35;
  const minRadius = 1.5;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const forward = new AFRAME.THREE.Vector3();
  const right = new AFRAME.THREE.Vector3();
  const movement = new AFRAME.THREE.Vector3();

  let pointerId = null;
  let center = { x: 0, y: 0 };
  const vector = { x: 0, y: 0 };

  function setKnob(dx, dy) {
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  }

  function update(clientX, clientY) {
    let dx = clientX - center.x;
    let dy = clientY - center.y;
    const distance = Math.hypot(dx, dy);
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    setKnob(dx, dy);
    vector.x = dx / maxRadius;
    vector.y = dy / maxRadius;
  }

  function start(event) {
    if (scene.is('vr-mode') || pointerId !== null) return;
    pointerId = event.pointerId;
    base.setPointerCapture?.(pointerId);
    const rect = base.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    update(event.clientX, event.clientY);
    event.preventDefault();
    event.stopPropagation();
  }

  function move(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    update(event.clientX, event.clientY);
    event.preventDefault();
    event.stopPropagation();
  }

  function end(event) {
    if (pointerId === null || (event && event.pointerId !== pointerId)) return;
    pointerId = null;
    vector.x = 0;
    vector.y = 0;
    setKnob(0, 0);
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  base.addEventListener('pointerdown', start);
  base.addEventListener('pointermove', move);
  base.addEventListener('pointerup', end);
  base.addEventListener('pointercancel', end);
  base.addEventListener('lostpointercapture', end);

  let previous = performance.now();

  function animate(now) {
    const delta = Math.min((now - previous) / 1000, 0.05);
    previous = now;

    if (!scene.is('vr-mode') && (vector.x || vector.y)) {
      const camera = scene.camera;
      if (camera) {
        camera.getWorldDirection(forward);
        forward.y = 0;
        if (forward.lengthSq() >= 0.0001) {
          forward.normalize();
          right.set(-forward.z, 0, forward.x);

          movement.set(0, 0, 0);
          movement.addScaledVector(forward, -vector.y);
          movement.addScaledVector(right, vector.x);
          if (movement.lengthSq() > 1) movement.normalize();

          const position = rig.object3D.position;
          let nextX = clamp(position.x + movement.x * speed * delta, -limit, limit);
          let nextZ = clamp(position.z + movement.z * speed * delta, -limit, limit);
          const radius = Math.hypot(nextX, nextZ);

          if (radius < minRadius) {
            if (radius > 0.0001) {
              nextX = (nextX / radius) * minRadius;
              nextZ = (nextZ / radius) * minRadius;
            } else {
              nextZ = minRadius;
            }
          }

          position.x = nextX;
          position.z = nextZ;
        }
      }
    }

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);
  joystick.classList.add('visible');
}

function setupPorra(content) {
  const button = document.getElementById('porra-btn');
  const buttonText = document.getElementById('porra-btn-text');
  const status = document.getElementById('porra-status');
  const lines = content.porra[lang] || content.porra.es;
  const lineEls = lines.map((_, index) => document.getElementById(`porra-line-${index}`));
  let playing = false;
  let runId = 0;

  function paint(activeIndex) {
    lineEls.forEach((el, index) => {
      el?.setAttribute('color', index === activeIndex ? '#D4AF37' : '#ffffff');
    });
  }

  function reset() {
    runId++;
    playing = false;
    buttonText?.setAttribute('value', t(identidadUI.play));
    paint(-1);
    status?.setAttribute('value', '');
  }

  addClickOnce(button, () => {
    if (playing) {
      window.speechSynthesis?.cancel();
      reset();
      return;
    }

    if (!window.speechSynthesis) {
      status?.setAttribute('value', t(identidadUI.ttsUnavailable));
      window.setTimeout(() => status?.setAttribute('value', ''), 2200);
      return;
    }

    window.speechSynthesis.cancel();
    const currentRun = ++runId;
    playing = true;
    buttonText?.setAttribute('value', t(identidadUI.pause));
    paint(-1);
    status?.setAttribute('value', '');

    lines.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.lang = lang === 'es' ? 'es-MX' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => {
        if (currentRun !== runId) return;
        paint(index);
      };
      utterance.onend = () => {
        if (currentRun !== runId) return;
        if (index === lines.length - 1) {
          playing = false;
          buttonText?.setAttribute('value', t(identidadUI.play));
          window.setTimeout(() => {
            if (currentRun === runId) paint(-1);
          }, 1200);
        }
      };
      utterance.onerror = () => {
        if (currentRun !== runId) return;
        reset();
      };
      window.speechSynthesis.speak(utterance);
    });
  });

  paint(-1);
}

function setupQuiz() {
  const btnQuiz = document.getElementById('btn-quiz');
  const quizPanel = document.getElementById('quiz-panel');
  const quizClose = document.getElementById('quiz-close');
  const quizStart = document.getElementById('quiz-start');
  const quizStartBtn = document.getElementById('quiz-start-btn');
  const quizContent = document.getElementById('quiz-content');
  const quizResult = document.getElementById('quiz-result');
  const quizData = identidadQuiz[lang];

  const quizTitle = document.getElementById('quiz-title');
  const quizSubtitle = document.getElementById('quiz-subtitle');
  if (quizTitle) quizTitle.textContent = quizData.title;
  if (quizSubtitle) quizSubtitle.textContent = quizData.subtitle;
  if (quizStartBtn) quizStartBtn.textContent = quizData.start;
  const quizNext = document.getElementById('quiz-next');
  const quizRestart = document.getElementById('quiz-restart');
  if (quizNext) quizNext.textContent = quizData.next;
  if (quizRestart) quizRestart.textContent = quizData.restart;

  btnQuiz?.addEventListener('click', () => {
    if (!quizPanel) return;
    quizPanel.style.display = 'block';
    if (quizStart) quizStart.style.display = 'block';
    if (quizContent) quizContent.style.display = 'none';
    if (quizResult) quizResult.style.display = 'none';
  });
  quizClose?.addEventListener('click', () => {
    if (quizPanel) quizPanel.style.display = 'none';
  });

  let currentQuestion = 0;
  let score = 0;

  quizStartBtn?.addEventListener('click', () => {
    if (quizStart) quizStart.style.display = 'none';
    if (quizContent) quizContent.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    showQuestion();
  });

  function showQuestion() {
    const question = quizData.questions[currentQuestion];
    const progress = document.getElementById('quiz-progress');
    const scoreEl = document.getElementById('quiz-score');
    const questionEl = document.getElementById('quiz-question');
    const options = document.getElementById('quiz-options');
    if (!question || !options) return;

    if (progress) {
      progress.textContent = `${lang === 'es' ? 'Pregunta' : 'Question'} ${currentQuestion + 1} / ${quizData.questions.length}`;
    }
    if (scoreEl) scoreEl.textContent = `${quizData.score}: ${score}`;
    if (questionEl) questionEl.textContent = question.pregunta;

    options.innerHTML = '';
    question.opciones.forEach((option, index) => {
      const optionButton = document.createElement('button');
      optionButton.textContent = option;
      optionButton.style.cssText =
        'padding: 12px; background: rgba(0,100,58,0.4); color: #fff; border: 1px solid #D4AF37; border-radius: 6px; cursor: pointer; text-align: left; font-size: 0.95rem;';
      optionButton.onclick = () => {
        const all = options.querySelectorAll('button');
        all.forEach((item, itemIndex) => {
          item.disabled = true;
          if (itemIndex === question.correcta) item.style.background = 'rgba(0,150,0,0.6)';
          else if (itemIndex === index) item.style.background = 'rgba(150,0,0,0.6)';
        });
        if (index === question.correcta) score++;
        if (quizNext) quizNext.style.display = 'block';
        if (scoreEl) scoreEl.textContent = `${quizData.score}: ${score}`;
      };
      options.appendChild(optionButton);
    });
    if (quizNext) quizNext.style.display = 'none';
  }

  quizNext?.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    if (quizContent) quizContent.style.display = 'none';
    if (quizResult) quizResult.style.display = 'block';
    const percent = Math.round((score / quizData.questions.length) * 100);
    const resultTitle = document.getElementById('quiz-result-title');
    const resultScore = document.getElementById('quiz-result-score');
    if (resultTitle) {
      resultTitle.textContent =
        percent >= 80
          ? (lang === 'es' ? '¡Excelente!' : 'Excellent!')
          : percent >= 60
            ? (lang === 'es' ? '¡Bien hecho!' : 'Well done!')
            : (lang === 'es' ? 'Sigue practicando' : 'Keep practicing');
    }
    if (resultScore) {
      resultScore.textContent = `${quizData.score}: ${score}/${quizData.questions.length} (${percent}%)`;
    }
  }

  quizRestart?.addEventListener('click', () => {
    if (quizResult) quizResult.style.display = 'none';
    if (quizStart) quizStart.style.display = 'block';
  });
}

function setupUI() {
  const scene = document.querySelector('a-scene');
  const joystick = document.getElementById('joystick');
  const help = document.getElementById('hud-help');

  const fullscreen = document.getElementById('btn-fullscreen');
  if (fullscreen) {
    fullscreen.textContent = t(identidadUI.fullscreen);
    fullscreen.addEventListener('click', () => {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    });
  }

  const vr = document.getElementById('btn-vr');
  if (vr) {
    vr.textContent = t(identidadUI.vrMode);
    vr.addEventListener('click', () => {
      if (!scene || !scene.enterVR) return;
      const result = scene.enterVR();
      if (result && typeof result.catch === 'function') result.catch(() => {});
    });
  }

  const quizButton = document.getElementById('btn-quiz');
  if (quizButton) quizButton.textContent = t(identidadUI.quiz);

  const joystickLabel = document.getElementById('joystick-label');
  if (joystickLabel) joystickLabel.textContent = t(identidadUI.joystick);

  if (help) help.textContent = t(identidadUI.moveHelp);

  scene?.addEventListener('enter-vr', () => {
    if (help) help.textContent = t(identidadUI.vrHelp);
    joystick?.classList.remove('visible');
  });
  scene?.addEventListener('exit-vr', () => {
    if (help) help.textContent = t(identidadUI.moveHelp);
    joystick?.classList.add('visible');
  });
}

async function init() {
  if (!checkWebGL()) return;

  const loadingText = document.getElementById('loading-text');
  if (loadingText) loadingText.textContent = t(identidadUI.loading);

  try {
    const content = await loadContent();
    await sceneReady();

    applyContent(content);
    setupHimno(content);
    setupDecalogo();
    setupPorra(content);
    setupQuiz();
    setupUI();
    setupResponsiveCamera();
    setupJoystick();
    pausePageAudio();

    const hud = document.getElementById('hud');
    if (hud) hud.classList.remove('hidden');

    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('hidden');
      window.setTimeout(() => loading.remove(), 500);
    }
  } catch (error) {
    console.error('[Sala Identidad]', error);
    if (loadingText) loadingText.textContent = t(identidadUI.loadError);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
