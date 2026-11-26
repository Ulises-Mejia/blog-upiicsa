// Textos de interfaz (no son contenido editorial).
const identidadUI = {
  pageTitle: {
    es: "Sala de Identidad Institucional IPN — Realidad Virtual",
    en: "IPN Institutional Identity Room — Virtual Reality"
  },
  fullscreen: { es: "Pantalla completa", en: "Fullscreen" },
  vrMode: { es: "Entrar en modo VR", en: "Enter VR mode" },
  noWebGL: {
    es: "Este navegador no soporta WebGL. No es posible mostrar la sala de realidad virtual.",
    en: "This browser does not support WebGL. The virtual reality room cannot be displayed."
  },
  loadError: {
    es: "No se pudo cargar el contenido de la sala. Comprueba tu conexión e inténtalo de nuevo.",
    en: "The room content could not be loaded. Check your connection and try again."
  },
  cdnError: {
    es: "No se pudo cargar el motor 3D (A-Frame) desde la red. Revisa tu conexión e inténtalo de nuevo.",
    en: "Could not load the 3D engine (A-Frame) from the network. Check your connection and try again."
  },
  retry: { es: "Reintentar", en: "Retry" },
  hymn: { es: "HIMNO POLITÉCNICO", en: "POLYTECHNIC HYMN" },
  hymnSubtitle: { es: "Símbolo institucional", en: "Institutional symbol" },
  play: { es: "Reproducir", en: "Play" },
  pause: { es: "Pausar", en: "Pause" },
  audioError: { es: "No se pudo reproducir el audio", en: "Audio could not be played" },
  lyrics: { es: "Mostrar letra", en: "Show lyrics" },
  hideLyrics: { es: "Ocultar letra", en: "Hide lyrics" },
  decalogue: { es: "DECÁLOGO POLITÉCNICO", en: "POLYTECHNIC DECALOGUE" },
  decaloguePointBadge: { es: "DECÁLOGO", en: "DECALOGUE" },
  cheer: { es: "PORRA POLITÉCNICA", en: "POLYTECHNIC CHEER" },
  approach: {
    es: "Acércate o toca un panel para leer",
    en: "Approach or tap a panel to read"
  },
  center: { es: "ESCUDO IPN", en: "IPN SHIELD" },
  moveHelp: {
    es: "Mueve el ratón para mirar • WASD o joystick para caminar",
    en: "Move mouse to look • WASD or joystick to walk"
  },
  vrHelp: { es: "Teletransporte con el thumbstick", en: "Teleport with the thumbstick" },
  hudHimnoPlay: { es: "Reproducir himno", en: "Play hymn" },
  hudHimnoPause: { es: "Pausar himno", en: "Pause hymn" },
  hudDecalogue: { es: "Ver Decálogo", en: "View Decalogue" },
  quiz: { es: "Quiz Identidad", en: "Identity Quiz" },
  bannerTitle: { es: "IDENTIDAD INSTITUCIONAL", en: "INSTITUTIONAL IDENTITY" },
  bannerSubtitle: {
    es: "INSTITUTO POLITÉCNICO NACIONAL",
    en: "NATIONAL POLYTECHNIC INSTITUTE"
  },
  joystick: { es: "Mover", en: "Move" },
  lookAroundBadge: { es: "RECORRIDO", en: "TOUR" },
  lookAround: {
    es: "Explora la sala: Decálogo a tu derecha, Himno al frente-izquierda, y gira para ver el lema y la porra.",
    en: "Explore the room: Decalogue on your right, Hymn front-left, and turn around for the motto and cheer."
  },
  loading: { es: "Cargando sala...", en: "Loading room..." },
  viewDecalogue: { es: "Ver Decálogo completo", en: "View full Decalogue" }
};

const SCENE_LOAD_TIMEOUT_MS = 12000;
const DECALOGUE_PROXIMITY_DIST = 2.35;
const DECALOGUE_RELEASE_DIST = 3.2;

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

function sceneReady(timeoutMs = SCENE_LOAD_TIMEOUT_MS) {
  if (window.__aframeLoadError || typeof window.AFRAME === 'undefined') {
    return Promise.reject(new Error('AFRAME_CDN_ERROR'));
  }
  const scene = document.querySelector('a-scene');
  if (!scene) return Promise.reject(new Error('AFRAME_NO_SCENE'));
  if (scene.hasLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('AFRAME_CDN_ERROR'));
    }, timeoutMs);

    scene.addEventListener(
      'loaded',
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
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

function refreshRaycasters() {
  document.querySelectorAll('[raycaster]').forEach((el) => {
    el.components?.raycaster?.refreshObjects?.();
  });
}

// Controlador centralizado del banner superior (#station-info)
let stationBannerTimer = null;
let stationBannerSource = null;

function showStationInfo(badgeText, bodyText, { source = 'info', autoHideMs = 0 } = {}) {
  const box = document.getElementById('station-info');
  if (!box) return;

  if (stationBannerTimer) {
    window.clearTimeout(stationBannerTimer);
    stationBannerTimer = null;
  }

  stationBannerSource = source;
  box.replaceChildren();

  if (badgeText) {
    const badge = document.createElement('div');
    badge.className = 'station-badge';
    badge.textContent = badgeText;
    box.appendChild(badge);
  }

  const body = document.createElement('p');
  body.className = 'station-body';
  body.textContent = bodyText;
  box.appendChild(body);
  box.classList.add('visible');

  if (autoHideMs > 0) {
    stationBannerTimer = window.setTimeout(() => {
      if (stationBannerSource === source) {
        hideStationInfo(source);
      }
    }, autoHideMs);
  }
}

function hideStationInfo(source) {
  if (source && stationBannerSource !== source) return;
  const box = document.getElementById('station-info');
  if (stationBannerTimer) {
    window.clearTimeout(stationBannerTimer);
    stationBannerTimer = null;
  }
  stationBannerSource = null;
  box?.classList.remove('visible');
}

function applyContent(content) {
  document.documentElement.lang = lang;
  document.title = t(identidadUI.pageTitle);

  // Estación Himno
  setText('himno-title', t(identidadUI.hymn));
  setText('himno-subtitle', t(identidadUI.hymnSubtitle));
  setText(
    'himno-info',
    `${t(content.himno.autorLetra)}\n${t(content.himno.autorMusica)}`
  );
  setText('himno-btn-text', t(identidadUI.play));
  setText('himno-lyrics-text', t(identidadUI.lyrics));

  // Galería Decálogo
  setText('decalogo-title', t(identidadUI.decalogue));
  setText('decalogo-btn-text', t(identidadUI.viewDecalogue));
  setText('decalogo-approach', t(identidadUI.approach));
  const decalogueTitle = document.getElementById('decalogue-title');
  if (decalogueTitle) decalogueTitle.textContent = t(identidadUI.decalogue);

  // Estación Porra
  setText('porra-title', t(identidadUI.cheer));
  const porraLines = content.porra[lang] || content.porra.es;
  porraLines.forEach((line, index) => setText(`porra-line-${index}`, line));

  // Banner, escudo y lema
  setText('banner-title', t(identidadUI.bannerTitle));
  setText('banner-subtitle', t(identidadUI.bannerSubtitle));
  setText('escudo-label', t(identidadUI.center));
  setText('lema-text', t(content.lema));

  // Modal accesible del Decálogo (fallback completo)
  const decalogueContent = document.getElementById('decalogue-content');
  if (decalogueContent) {
    const items = content.decalogo.map((item, index) => {
      const div = document.createElement('div');
      div.className = 'decalogue-item';
      const number = document.createElement('strong');
      number.textContent = `${index + 1}.`;
      div.append(number, document.createTextNode(` ${t(item)}`));
      return div;
    });
    decalogueContent.replaceChildren(...items);
  }

  // Modal de letra completa del himno
  const lyricsTitle = document.getElementById('lyrics-title');
  if (lyricsTitle) lyricsTitle.textContent = t(content.himno.titulo);
  const lyricsContent = document.getElementById('lyrics-content');
  if (lyricsContent) {
    const nodes = [];
    content.himno.secciones.forEach((section) => {
      const heading = document.createElement('h2');
      heading.textContent = t(section.titulo);
      const stanza = document.createElement('div');
      stanza.className = 'lyrics-stanza';
      section.lineas.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = t(line);
        stanza.appendChild(p);
      });
      nodes.push(heading, stanza);
    });
    lyricsContent.replaceChildren(...nodes);
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
    if (lyricsPanel.open) {
      lyricsPanel.close();
    } else {
      lyricsPanel.showModal();
      if (lyricsText) lyricsText.setAttribute('value', t(identidadUI.hideLyrics));
    }
  });

  lyricsClose?.addEventListener('click', () => {
    if (lyricsPanel?.open) lyricsPanel.close();
  });

  lyricsPanel?.addEventListener('close', () => {
    lyricsPanel.returnValue = '';
    if (lyricsText) lyricsText.setAttribute('value', t(identidadUI.lyrics));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audio && !audio.paused) audio.pause();
  });

  updateButton();
}

function setupDecalogoGallery(content) {
  const container = document.getElementById('decalogo-panels-container');
  const wallButton = document.getElementById('decalogo-btn');
  const hudButton = document.getElementById('btn-decalogo');
  const modalPanel = document.getElementById('decalogue-panel');
  const modalClose = document.getElementById('decalogue-close');

  const openModal = () => {
    if (modalPanel && !modalPanel.open) modalPanel.showModal();
  };
  const closeModal = () => {
    if (modalPanel?.open) modalPanel.close();
  };

  addClickOnce(wallButton, openModal);
  if (hudButton) {
    hudButton.textContent = t(identidadUI.hudDecalogue);
    hudButton.addEventListener('click', openModal);
  }
  modalClose?.addEventListener('click', closeModal);
  modalPanel?.addEventListener('close', () => {
    modalPanel.returnValue = '';
  });

  const panels = [];
  let activeIndex = -1;
  let pinnedIndex = -1;

  if (container && Array.isArray(content.decalogo)) {
    const cols = 5;
    const colSpacing = 2.08;
    const startX = -((cols - 1) * colSpacing) / 2;
    const rowY = [2.22, 1.14];

    container.replaceChildren();

    content.decalogo.forEach((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const localX = startX + col * colSpacing;
      const localY = rowY[row] ?? rowY[1];
      const text = t(item);
      const numLabel = String(index + 1).padStart(2, '0');

      const root = document.createElement('a-entity');
      root.setAttribute('id', `decalogo-panel-${index + 1}`);
      root.setAttribute('position', `${localX.toFixed(2)} ${localY.toFixed(2)} 0`);

      // Marco dorado
      const frame = document.createElement('a-box');
      frame.setAttribute('width', '1.92');
      frame.setAttribute('height', '0.94');
      frame.setAttribute('depth', '0.04');
      frame.setAttribute('material', 'color: #B8941F; roughness: 0.55; emissive: #000000; emissiveIntensity: 0');
      root.appendChild(frame);

      // Cara interactiva
      const bg = document.createElement('a-plane');
      bg.setAttribute('class', 'interactive');
      bg.setAttribute('width', '1.82');
      bg.setAttribute('height', '0.84');
      bg.setAttribute('position', '0 0 0.025');
      bg.setAttribute('material', 'color: #00361F; shader: flat');
      root.appendChild(bg);

      // Etiqueta numérica superior
      const badge = document.createElement('a-plane');
      badge.setAttribute('width', '0.36');
      badge.setAttribute('height', '0.16');
      badge.setAttribute('position', '0 0.31 0.03');
      badge.setAttribute('material', 'color: #D4AF37; shader: flat');
      root.appendChild(badge);

      const badgeText = document.createElement('a-text');
      badgeText.setAttribute('font', 'fonts/sala-sdf.json');
      badgeText.setAttribute('negate', 'false');
      badgeText.setAttribute('value', numLabel);
      badgeText.setAttribute('align', 'center');
      badgeText.setAttribute('position', '0 0.31 0.036');
      badgeText.setAttribute('width', '1.7');
      badgeText.setAttribute('color', '#00361F');
      root.appendChild(badgeText);

      // Texto completo del punto
      const bodyText = document.createElement('a-text');
      bodyText.setAttribute('font', 'fonts/sala-sdf.json');
      bodyText.setAttribute('negate', 'false');
      bodyText.setAttribute('value', text);
      bodyText.setAttribute('align', 'center');
      bodyText.setAttribute('anchor', 'center');
      bodyText.setAttribute('baseline', 'center');
      bodyText.setAttribute('position', '0 -0.06 0.036');
      bodyText.setAttribute('width', '1.66');
      bodyText.setAttribute('wrap-count', '31');
      bodyText.setAttribute('line-height', '50');
      bodyText.setAttribute('color', '#FFFFFF');
      root.appendChild(bodyText);

      container.appendChild(root);

      const panelEntry = {
        index,
        text,
        root,
        frame,
        bg,
        localX,
        localY,
        // Con gallery en (7.72, 0, 0) y rotación Y = -90°, local (x, y, 0) -> mundo (7.72, y, x)
        worldX: 7.72,
        worldY: localY,
        worldZ: localX
      };

      addClickOnce(bg, () => {
        pinnedIndex = pinnedIndex === index ? -1 : index;
        if (pinnedIndex === -1) {
          setActivePanel(-1);
        } else {
          setActivePanel(pinnedIndex);
        }
      });

      panels.push(panelEntry);
    });

    refreshRaycasters();
    window.setTimeout(refreshRaycasters, 350);
  }

  function stylePanel(panel, highlighted) {
    if (!panel) return;
    if (panel.root.object3D) {
      panel.root.object3D.position.z = highlighted ? 0.05 : 0;
    }
    panel.frame.setAttribute(
      'material',
      highlighted
        ? 'color: #FFD700; roughness: 0.35; emissive: #7A5C00; emissiveIntensity: 0.45'
        : 'color: #B8941F; roughness: 0.55; emissive: #000000; emissiveIntensity: 0'
    );
    panel.bg.setAttribute(
      'material',
      highlighted ? 'color: #005832; shader: flat' : 'color: #00361F; shader: flat'
    );
  }

  function setActivePanel(nextIndex) {
    if (nextIndex === activeIndex) return;
    if (activeIndex >= 0) stylePanel(panels[activeIndex], false);
    activeIndex = nextIndex;
    if (activeIndex >= 0) {
      const panel = panels[activeIndex];
      stylePanel(panel, true);
      showStationInfo(
        `${t(identidadUI.decaloguePointBadge)} · ${activeIndex + 1} / ${panels.length}`,
        panel.text,
        { source: 'decalogue' }
      );
    } else {
      hideStationInfo('decalogue');
    }
  }

  const camWorldPos = new AFRAME.THREE.Vector3();
  const camWorldDir = new AFRAME.THREE.Vector3();

  function updateProximity(rigPos, camera) {
    if (panels.length === 0 || !camera) return;

    // Si hay un panel fijado por clic, liberarlo al alejarse demasiado
    if (pinnedIndex >= 0) {
      const p = panels[pinnedIndex];
      const distPinned = Math.hypot(rigPos.x - p.worldX, rigPos.z - p.worldZ);
      if (distPinned > DECALOGUE_RELEASE_DIST) {
        pinnedIndex = -1;
      } else {
        setActivePanel(pinnedIndex);
        return;
      }
    }

    // Salida rápida cuando el jugador está lejos de la pared derecha
    if (rigPos.x < 7.72 - DECALOGUE_PROXIMITY_DIST - 0.25) {
      if (activeIndex >= 0) setActivePanel(-1);
      return;
    }

    camera.getWorldPosition(camWorldPos);
    camera.getWorldDirection(camWorldDir);

    // Proyectar mirada sobre el plano x = 7.72 para distinguir fila superior (1-5) vs inferior (6-10)
    let aimY = 1.65;
    let aimZ = rigPos.z;
    const lookingAtWall = camWorldDir.x > 0.12;
    if (lookingAtWall) {
      const tHit = (7.72 - camWorldPos.x) / camWorldDir.x;
      if (tHit > 0 && tHit < 5.5) {
        aimY = Math.min(2.9, Math.max(0.6, camWorldPos.y + camWorldDir.y * tHit));
        aimZ = camWorldPos.z + camWorldDir.z * tHit;
      }
    }

    let bestIdx = -1;
    let bestScore = Infinity;

    for (let i = 0; i < panels.length; i++) {
      const p = panels[i];
      const horizDist = Math.hypot(rigPos.x - p.worldX, rigPos.z - p.worldZ);
      if (horizDist > DECALOGUE_PROXIMITY_DIST) continue;

      // Combinar distancia física horizontal + cercanía vertical/lateral al punto de mirada
      const aimOffset = Math.hypot((p.worldZ - aimZ) * 0.75, (p.worldY - aimY) * 1.15);
      const score = horizDist + (lookingAtWall ? aimOffset : Math.abs(p.worldY - 1.65));
      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    setActivePanel(bestIdx);
  }

  return { updateProximity };
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

function setupRendererPerf() {
  const scene = document.querySelector('a-scene');
  const renderer = scene?.renderer;
  if (!renderer) return;

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const maxDpr = isCoarse ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
}

function setupJoystick() {
  const joystick = document.getElementById('joystick');
  const base = document.getElementById('joystick-base');
  const knob = document.getElementById('joystick-knob');
  const scene = document.querySelector('a-scene');
  const vector = { x: 0, y: 0 };

  if (!joystick || !base || !knob || !scene) return vector;

  const maxRadius = 38;
  let pointerId = null;
  let center = { x: 0, y: 0 };

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

  joystick.classList.add('visible');
  return vector;
}

function setupPorra(content) {
  const lines = content.porra[lang] || content.porra.es;
  lines.forEach((line, index) => {
    const el = document.getElementById(`porra-line-${index}`);
    if (el) {
      el.setAttribute('value', line);
      el.setAttribute('color', '#ffffff');
    }
  });
}

function setupQuiz(quiz) {
  const btnQuiz = document.getElementById('btn-quiz');
  const quizPanel = document.getElementById('quiz-panel');
  const quizClose = document.getElementById('quiz-close');
  const quizStart = document.getElementById('quiz-start');
  const quizStartBtn = document.getElementById('quiz-start-btn');
  const quizContent = document.getElementById('quiz-content');
  const quizResult = document.getElementById('quiz-result');
  const quizData = quiz?.[lang] || quiz?.es;
  if (!quizData || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
    if (btnQuiz) btnQuiz.style.display = 'none';
    return;
  }

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
    if (quizStart) quizStart.hidden = false;
    if (quizContent) quizContent.hidden = true;
    if (quizResult) quizResult.hidden = true;
    if (!quizPanel.open) quizPanel.showModal();
  });
  quizClose?.addEventListener('click', () => {
    if (quizPanel?.open) quizPanel.close();
  });
  quizPanel?.addEventListener('close', () => {
    quizPanel.returnValue = '';
  });

  let currentQuestion = 0;
  let score = 0;

  quizStartBtn?.addEventListener('click', () => {
    if (quizStart) quizStart.hidden = true;
    if (quizContent) quizContent.hidden = false;
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

    const optionButtons = question.opciones.map((option, index) => {
      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.className = 'quiz-option-btn';
      optionButton.textContent = option;
      optionButton.addEventListener('click', () => {
        const all = options.querySelectorAll('button');
        all.forEach((item, itemIndex) => {
          item.disabled = true;
          if (itemIndex === question.correcta) item.classList.add('is-correct');
          else if (itemIndex === index) item.classList.add('is-wrong');
        });
        if (index === question.correcta) score++;
        if (quizNext) quizNext.hidden = false;
        if (scoreEl) scoreEl.textContent = `${quizData.score}: ${score}`;
      });
      return optionButton;
    });
    options.replaceChildren(...optionButtons);
    if (quizNext) quizNext.hidden = true;
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
    if (quizContent) quizContent.hidden = true;
    if (quizResult) quizResult.hidden = false;
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
    if (quizResult) quizResult.hidden = true;
    if (quizStart) quizStart.hidden = false;
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

  // Fallback de light-dismiss para navegadores sin closedby="any" (p. ej. Safari)
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutsideDialog = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutsideDialog(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutsideDialog(e, dialog) && dialog.open) {
          dialog.close();
        }
        pressedOutside = false;
      });
    });
  }
}

function setupDesktopMouseLook() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const scene = document.querySelector('a-scene');
  const cameraEl = document.querySelector('[camera]');
  if (!scene || !cameraEl) return;

  const sensitivity = 0.0022;
  const PITCH_LIMIT = Math.PI / 2.25;

  let prevX = null;
  let prevY = null;

  function onMouseMove(e) {
    if (scene.is('vr-mode') || document.querySelector('dialog[open]')) {
      prevX = null;
      prevY = null;
      return;
    }

    const target = e.target;
    if (target && target.closest && target.closest('#hud, #decalogue-panel, #lyrics-panel, #quiz-panel, #station-info, #joystick, button, input')) {
      prevX = null;
      prevY = null;
      return;
    }

    const controls = cameraEl.components['look-controls'];
    if (!controls || !controls.yawObject || !controls.pitchObject) {
      prevX = null;
      prevY = null;
      return;
    }

    let dx = 0;
    let dy = 0;

    if (typeof e.movementX === 'number' && typeof e.movementY === 'number') {
      if (Math.abs(e.movementX) < 250 && Math.abs(e.movementY) < 250) {
        dx = e.movementX;
        dy = e.movementY;
      }
    } else {
      if (prevX !== null && prevY !== null) {
        dx = e.clientX - prevX;
        dy = e.clientY - prevY;
      }
      prevX = e.clientX;
      prevY = e.clientY;
    }

    if (dx !== 0 || dy !== 0) {
      controls.yawObject.rotation.y -= dx * sensitivity;
      controls.pitchObject.rotation.x -= dy * sensitivity;
      controls.pitchObject.rotation.x = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, controls.pitchObject.rotation.x));
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseleave', () => {
    prevX = null;
    prevY = null;
  });
  window.addEventListener('blur', () => {
    prevX = null;
    prevY = null;
  });
}

// Bucle único optimizado: joystick + consolidación WASD + colisiones + proximidad del Decálogo
function startSceneLoop(joystickVector, decalogueGallery) {
  const scene = document.querySelector('a-scene');
  const rig = document.getElementById('cameraRig');
  const cameraEl = document.querySelector('[camera]');
  if (!scene || !rig || !cameraEl) return;

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const SPEED = 2.4;
  const ROOM_LIMIT = 7.1; // Paredes perimetrales a 8.0m (galería derecha en 7.72m)
  const PLINTH_RADIUS = 1.48;

  const forward = new AFRAME.THREE.Vector3();
  const right = new AFRAME.THREE.Vector3();
  const movement = new AFRAME.THREE.Vector3();

  let previous = performance.now();

  function tick(now) {
    const delta = Math.min((now - previous) / 1000, 0.05);
    previous = now;

    if (!document.hidden) {
      const rigPos = rig.object3D.position;
      const camPos = cameraEl.object3D.position;
      const camera = scene.camera;

      // 1. Movimiento por joystick virtual (solo fuera de VR)
      if (!scene.is('vr-mode') && camera && (joystickVector.x || joystickVector.y)) {
        camera.getWorldDirection(forward);
        forward.y = 0;
        if (forward.lengthSq() >= 0.0001) {
          forward.normalize();
          right.set(-forward.z, 0, forward.x);

          movement.set(0, 0, 0);
          movement.addScaledVector(forward, -joystickVector.y);
          movement.addScaledVector(right, joystickVector.x);
          if (movement.lengthSq() > 1) movement.normalize();

          rigPos.x += movement.x * SPEED * delta;
          rigPos.z += movement.z * SPEED * delta;
        }
      }

      // 2. Consolidar desplazamiento WASD local de la cámara sobre el rig
      if (camPos.x !== 0 || camPos.z !== 0) {
        rigPos.x += camPos.x;
        rigPos.z += camPos.z;
        camPos.x = 0;
        camPos.z = 0;
      }

      // 3. Límites de sala y colisiones con estaciones y plinto central
      rigPos.x = clamp(rigPos.x, -ROOM_LIMIT, ROOM_LIMIT);
      rigPos.z = clamp(rigPos.z, -ROOM_LIMIT, ROOM_LIMIT);

      // Estación Porra (z = 6.5, ancho = 3.4)
      if (rigPos.z > 6.15 && Math.abs(rigPos.x) < 1.9) {
        rigPos.z = 6.15;
      }

      // Estación Himno (x = -4.2, z = -2.6)
      const distHimno = Math.hypot(rigPos.x - (-4.2), rigPos.z - (-2.6));
      if (distHimno < 1.5) {
        const angle = Math.atan2(rigPos.z - (-2.6), rigPos.x - (-4.2));
        rigPos.x = -4.2 + Math.cos(angle) * 1.5;
        rigPos.z = -2.6 + Math.sin(angle) * 1.5;
      }

      // Plinto central del escudo IPN
      const distCenter = Math.hypot(rigPos.x, rigPos.z);
      if (distCenter < PLINTH_RADIUS) {
        if (distCenter > 0.001) {
          rigPos.x = (rigPos.x / distCenter) * PLINTH_RADIUS;
          rigPos.z = (rigPos.z / distCenter) * PLINTH_RADIUS;
        } else {
          rigPos.z = PLINTH_RADIUS;
        }
      }

      // 4. Lectura por proximidad de los 10 paneles 3D del Decálogo
      decalogueGallery?.updateProximity(rigPos, camera);
    }

    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);
}

function showLoadFailure(message) {
  const loadingText = document.getElementById('loading-text');
  const retryBtn = document.getElementById('loading-retry');
  if (loadingText) loadingText.textContent = message;
  if (retryBtn) {
    retryBtn.textContent = t(identidadUI.retry);
    retryBtn.classList.add('visible');
    retryBtn.onclick = () => window.location.reload();
  }
}

async function init() {
  document.documentElement.lang = lang;
  document.title = t(identidadUI.pageTitle);

  if (!checkWebGL()) return;

  const loadingText = document.getElementById('loading-text');
  if (loadingText) loadingText.textContent = t(identidadUI.loading);

  try {
    const [content] = await Promise.all([loadContent(), sceneReady()]);

    applyContent(content);
    setupHimno(content);
    const decalogueGallery = setupDecalogoGallery(content);
    setupPorra(content);
    setupQuiz(content.quiz);
    setupUI();
    setupResponsiveCamera();
    setupRendererPerf();
    const joystickVector = setupJoystick();
    setupDesktopMouseLook();
    startSceneLoop(joystickVector, decalogueGallery);
    pausePageAudio();

    const hud = document.getElementById('hud');
    if (hud) hud.classList.remove('hidden');

    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('hidden');
      window.setTimeout(() => loading.remove(), 400);
    }

    // Aviso breve de orientación para descubrir la galería lateral, lema y porra
    showStationInfo(t(identidadUI.lookAroundBadge), t(identidadUI.lookAround), {
      source: 'tour',
      autoHideMs: 6000
    });
  } catch (error) {
    console.error('[Sala Identidad]', error);
    const isCdn = error?.message === 'AFRAME_CDN_ERROR' || error?.message === 'AFRAME_NO_SCENE';
    showLoadFailure(t(isCdn ? identidadUI.cdnError : identidadUI.loadError));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
