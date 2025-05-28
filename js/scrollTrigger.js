// videoScrollOptimized.js
// GSAP ScrollTrigger otimizado para iOS/Android mobile

console.clear();
gsap.registerPlugin(ScrollTrigger);

// Refresh apenas no load e orientationchange
ScrollTrigger.config({ autoRefreshEvents: "load" });

const videos = document.querySelectorAll('.video-background');
const isMobile = window.innerWidth < 768;
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Helper: play/pause para decodificar o primeiro frame
function primeDecode(video) {
  video.play().then(() => video.pause()).catch(() => {});
}

// Helper: aguarda readyState >= 3 antes de criar trigger
function waitForReady(video, cb) {
  function check() {
    if (video.readyState >= 3) cb();
    else requestAnimationFrame(check);
  }
  check();
}

// Helper once
function once(el, event, fn, opts) {
  const listener = (e) => {
    el.removeEventListener(event, listener, opts);
    fn(e);
  };
  el.addEventListener(event, listener, opts);
}

videos.forEach(video => {
  // Carregamento de fonte baseado em data-attributes
  const mobileSrc  = video.getAttribute('data-video-mobile');
  const desktopSrc = video.getAttribute('data-video-desktop');
  const srcToUse   = isMobile && mobileSrc ? mobileSrc : (desktopSrc || video.currentSrc);

  // Substitui fontes existentes
  while (video.firstChild) video.removeChild(video.firstChild);
  if (srcToUse) {
    const srcEl = document.createElement('source');
    srcEl.src = srcToUse;
    srcEl.type = srcToUse.endsWith('.mp4') ? 'video/mp4' : 'video/webm';
    video.appendChild(srcEl);
    video.load();
  }

  video.setAttribute('preload','auto');
  video.muted = true;
  video.playsInline = true;

  if (isMobile) {
    video.autoplay = true;
    video.loop = true;
    video.removeAttribute('controls');
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0;
      video.pause();
      setTimeout(() => {
        video.play().catch(() => {});
      }, 2000);
    });
  } else {
    video.autoplay = false;
    video.loop = false;
    // Desbloqueio de play no iOS
    once(document.documentElement, 'touchstart', () => primeDecode(video));
    video.addEventListener('loadedmetadata', () => {
      // No desktop, nunca dar play/pause, apenas inicializar o ScrollTrigger
      waitForReady(video, () => initTrigger(video));
    });
  }
});

function initTrigger(video) {
  const section = video.closest('.video-section');
  const scrollArea = section.querySelector('.video-scroll-area');
  if (!scrollArea) return;

  // Altura de scroll = viewport * duração
  scrollArea.style.height = `${window.innerHeight * video.duration}px`;

  // Aplicar CSS full-screen inline (pode migrar para CSS externo)
  Object.assign(video.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    objectFit: 'cover', willChange: 'transform',
    opacity: '1', transform: 'none'
  });

  // --- FLUIDEZ MOBILE ---
  if (isMobile) {
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let rafId = null;
    
    const st = ScrollTrigger.create({
      trigger: scrollArea,
      start: 'top top',
      end: () => `${scrollArea.offsetHeight - window.innerHeight} bottom`,
      scrub: 0.1,
      pin: section,
      invalidateOnRefresh: true,
      onUpdate: self => {
        scrollTarget = self.progress * video.duration;
      }
    });

    function animate() {
      // Interpola suavemente
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.25;
      // Corrige aproximação
      if (Math.abs(scrollCurrent - scrollTarget) < 0.01) scrollCurrent = scrollTarget;
      if (video.fastSeek) video.fastSeek(scrollCurrent);
      else video.currentTime = scrollCurrent;
      rafId = requestAnimationFrame(animate);
    }
    animate();
    // Limpeza se necessário (ex: SPA)
    // return () => rafId && cancelAnimationFrame(rafId);
  } else {
    // Desktop: update instantâneo
    ScrollTrigger.create({
      trigger: scrollArea,
      start: 'top top',
      end: () => `${scrollArea.offsetHeight - window.innerHeight} bottom`,
      scrub: 0,
      pin: section,
      invalidateOnRefresh: true,
      onUpdate: self => {
        const t = self.progress * video.duration;
        if (video.fastSeek) video.fastSeek(t);
        else video.currentTime = t;
      }
    });
  }
}

// Refresh final\window.addEventListener('load', () => ScrollTrigger.refresh());
window.addEventListener('orientationchange', () => setTimeout(() => ScrollTrigger.refresh(), 300));
