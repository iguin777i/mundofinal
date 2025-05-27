console.clear();

gsap.registerPlugin(ScrollTrigger);

const videos = document.querySelectorAll(".video-background");
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Ativa o vídeo em iOS
function once(el, event, fn, opts) {
    const onceFn = function (e) {
        el.removeEventListener(event, onceFn);
        fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
}

// Initialize each video
videos.forEach((video, idx) => {
    
    let scroll = 0;
    let scrollTarget = 0;

    const videoSection = video.closest('.video-section');
    const scrollArea = videoSection.querySelector('.video-scroll-area');

    once(document.documentElement, "touchstart", () => {
        video.play();
        video.pause();
    });

    function initScrollVideo() {
        if (video.dataset.scrollInit) return;
        video.dataset.scrollInit = "true";
        

        // Reduz a área de rolagem para menos rolagem
        if (video.duration && scrollArea) {
            scrollArea.style.height = (window.innerHeight * video.duration * 0.5) + 'px'; // Reduzido de 1 para 0.5
            
        }

        // Estiliza o vídeo
        video.style.position = "fixed";
        video.style.top = "50%";
        video.style.left = "50%";
        video.style.transform = "translate(-50%, -50%)";
        video.style.width = "100%";
        video.style.height = "100vh";
        video.style.objectFit = "cover";
        video.style.opacity = "1";

        // ScrollTrigger com invalidateOnRefresh e end dinâmico
        ScrollTrigger.create({
            trigger: scrollArea,
            start: "top top",
            end: () => "bottom bottom", // Dinâmico para garantir pin correto
            scrub: 0.05, // Reduzido para maior responsividade
            pin: videoSection,
            pinSpacing: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true, // ESSENCIAL para scroll de baixo para cima
            onUpdate: (self) => {
                scrollTarget = self.progress;
                // Evita ultrapassar a duração do vídeo
                if (video.currentTime >= video.duration - 0.05) {
                    video.currentTime = video.duration - 0.05;
                }
            }
        });

        // --- FADE IN DO GRADIENTE E FADE OUT DO VÍDEO ---
        const gradient = videoSection.nextElementSibling;
        if (gradient && gradient.classList.contains('gradient-transition')) {
          // Aguarda o layout ser atualizado
          requestAnimationFrame(() => {
            ScrollTrigger.getAll().forEach(st => {
              if (st.vars && st.vars.trigger === scrollArea && st.vars.id && st.vars.id.startsWith('fade-')) {
                st.kill();
              }
            });
            let pinScroll = scrollArea.offsetHeight - window.innerHeight;
            // fallback mínimo para evitar fade instantâneo
            if (pinScroll < 100) pinScroll = window.innerHeight * 0.8;
            const fadeStart = pinScroll * 0.8;
            const fadeEnd = pinScroll;
            
            gsap.fromTo(
              gradient,
              { opacity: 0 },
              {
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  id: `fade-gradient-${Math.random()}`,
                  trigger: scrollArea,
                  start: () => `top+=${fadeStart} top`,
                  end: () => `top+=${fadeEnd} top`,
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            );
            gsap.fromTo(
              video,
              { opacity: 1 },
              {
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                  id: `fade-video-${Math.random()}`,
                  trigger: scrollArea,
                  start: () => `top+=${fadeStart} top`,
                  end: () => `top+=${fadeEnd} top`,
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            );
            ScrollTrigger.refresh();
          });
        }

        function update() {
            // Aumentado para 0.3 para máxima fluidez
            scroll += (scrollTarget - scroll) * 0.3;
            if (Math.abs(scrollTarget - scroll) < 0.0005) { // Maior precisão
                scroll = scrollTarget;
            }
            if (video.duration) {
                video.currentTime = Math.max(0, Math.min(scroll * video.duration, video.duration - 0.01));
            }
            requestAnimationFrame(update);
        }
        update();
    }

    function waitForVideoReady(maxAttempts = 10) {
        let attempts = 0;
        const interval = setInterval(() => {
            if (video.readyState >= 2 && video.duration > 0) {
                clearInterval(interval);
                initScrollVideo();
            } else if (++attempts >= maxAttempts) {
                clearInterval(interval);
                initScrollVideo();
            }
        }, 100); // Reduzido para 100ms para inicialização mais rápida
    }

    waitForVideoReady();
});

// Atualiza ScrollTriggers
function refreshAllScrollTriggers() {
    ScrollTrigger.getAll().forEach(st => st.refresh());
}

window.addEventListener("resize", refreshAllScrollTriggers);
window.addEventListener("orientationchange", () => {
    setTimeout(refreshAllScrollTriggers, 500);
});
setTimeout(refreshAllScrollTriggers, 2000); // Reduzido para 2000ms
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(refreshAllScrollTriggers, 100);
});

// Após carregar tudo, força refresh para garantir pin/unpin correto
window.addEventListener('load', () => {
  setTimeout(() => {
    ScrollTrigger.refresh(true);
  }, 500);
});

// --- SCROLL INDICATOR HIDE/SHOW ---
const scrollIndicator = document.getElementById('scroll-indicator');
const textSection = document.getElementById('text-section');
const loader = document.getElementById('loader');

function updateScrollIndicatorVisibility() {
    // Esconde se loader está visível
    if (loader && !loader.classList.contains('loaded')) {
        scrollIndicator.style.display = 'none';
        return;
    }
    // Esconde se passou da text-section
    if (textSection) {
        const rect = textSection.getBoundingClientRect();
        if (rect.bottom < 0) {
            scrollIndicator.style.display = 'none';
        } else {
            scrollIndicator.style.display = '';
        }
    }
}

window.addEventListener('scroll', updateScrollIndicatorVisibility);
window.addEventListener('resize', updateScrollIndicatorVisibility);

// Também garantir ao esconder o loader
if (loader) {
    const observer = new MutationObserver(() => {
        updateScrollIndicatorVisibility();
    });
    observer.observe(loader, { attributes: true, attributeFilter: ['class'] });
}

// Inicializa estado correto ao carregar
window.addEventListener('DOMContentLoaded', updateScrollIndicatorVisibility);