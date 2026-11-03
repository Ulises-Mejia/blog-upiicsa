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
  play: { es: "Reproducir", en: "Play" },
  pause: { es: "Pausar", en: "Pause" },
  audioError: { es: "No se pudo reproducir el audio", en: "Audio could not be played" },
  lyrics: { es: "Mostrar letra", en: "Show lyrics" },
  hideLyrics: { es: "Ocultar letra", en: "Hide lyrics" },
  decalogue: { es: "DECÁLOGO POLITÉCNICO", en: "POLYTECHNIC DECALOGUE" },
  cheer: { es: "PORRA POLITÉCNICA", en: "POLYTECHNIC CHEER" },
  approach: { es: "Acércate para leer", en: "Approach to read" },
  center: { es: "Escudo IPN", en: "IPN Shield" },
  teleport: { es: "Teletransporte: toca el piso para moverte", en: "Teleport: tap the floor to move" },
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

function applyContent(content) {
  document.documentElement.lang = lang;

  // Estación Himno
  setText('himno-title', t(identidadUI.hymn));
  setText('himno-subtitle', t(content.himno.titulo));
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
  setText('porra-tagline', content.porra[lang]?.[0] || content.porra.es[0]);

  // Escudo y lema
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

function setupHimno(content) {
  const button = document.getElementById('himno-btn');
  const buttonText = document.getElementById('himno-btn-text');
  const audio = document.getElementById('himno-audio');
  const info = document.getElementById('himno-info');
  const lyricsToggle = document.getElementById('himno-lyrics-toggle');
  const lyricsText = document.getElementById('himno-lyrics-text');
  const lyricsPanel = document.getElementById('lyrics-panel');
  const lyricsClose = document.getElementById('lyrics-close');
  let playing = false;

  function updateButton() {
    buttonText?.setAttribute('value', t(playing ? identidadUI.pause : identidadUI.play));
  }

  audio?.addEventListener('ended', () => {
    playing = false;
    updateButton();
  });

  audio?.addEventListener('pause', () => {
    playing = false;
    updateButton();
  });

  button?.addEventListener('click', () => {
    if (!audio) return;
    if (playing) {
      audio.pause();
      playing = false;
      updateButton();
      return;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          playing = true;
          updateButton();
        })
        .catch(() => {
          playing = false;
          updateButton();
          if (info) {
            info.setAttribute('value', t(identidadUI.audioError));
            window.setTimeout(() => {
              info.setAttribute('value', `${t(content.himno.autorLetra)}\n${t(content.himno.autorMusica)}`);
            }, 2200);
          }
        });
    } else {
      playing = true;
      updateButton();
    }
  });

  lyricsToggle?.addEventListener('click', () => {
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

  updateButton();
}

function setupDecalogo() {
  const button = document.getElementById('decalogo-btn');
  const panel = document.getElementById('decalogue-panel');
  const close = document.getElementById('decalogue-close');

  button?.addEventListener('click', () => panel?.classList.add('visible'));
  close?.addEventListener('click', () => panel?.classList.remove('visible'));
}

function setupPorra(content) {
  const button = document.getElementById('porra-btn');
  const buttonText = document.getElementById('porra-btn-text');
  const current = document.getElementById('porra-current');
  const lines = content.porra[lang] || content.porra.es;
  let playing = false;

  function reset() {
    playing = false;
    buttonText?.setAttribute('value', t(identidadUI.play));
    current?.setAttribute('value', '');
  }

  button?.addEventListener('click', () => {
    if (playing) {
      window.speechSynthesis?.cancel();
      reset();
      return;
    }

    if (!window.speechSynthesis) {
      current?.setAttribute('value', t(identidadUI.ttsUnavailable));
      window.setTimeout(() => current?.setAttribute('value', ''), 2000);
      return;
    }

    playing = true;
    buttonText?.setAttribute('value', t(identidadUI.pause));
    window.speechSynthesis.cancel();

    lines.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.lang = lang === 'es' ? 'es-MX' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => current?.setAttribute('value', line);
      utterance.onend = () => {
        if (index === lines.length - 1) {
          playing = false;
          buttonText?.setAttribute('value', t(identidadUI.play));
          window.setTimeout(() => current?.setAttribute('value', ''), 1000);
        }
      };
      window.speechSynthesis.speak(utterance);
    });
  });
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
  const fullscreen = document.getElementById('btn-fullscreen');
  fullscreen?.addEventListener('click', () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
  });

  const vr = document.getElementById('btn-vr');
  vr?.addEventListener('click', () => {
    const scene = document.querySelector('a-scene');
    if (scene && scene.enterVR) scene.enterVR();
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

    const hud = document.getElementById('hud');
    if (hud) {
      const help = document.getElementById('hud-help');
      if (help) help.textContent = t(identidadUI.teleport);
      hud.classList.remove('hidden');
    }

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
