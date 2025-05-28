/*! ------------------------------------------------
 * ------------------------------------------------

 * ------------------------------------------------
 * Índice
 * ------------------------------------------------
 *
 *  01. Loader & Animação de Carregamento
 *  02. Configurações do Plugin Bootstrap Scroll Spy
 *  03. Botão Voltar ao Topo
 *  04. Cartões Empilhados
 *  05. Animações de Scroll
 *  06. Efeito Fade-in Type
 *  07. Marquee de Blocos
 *  08. Parallax
 *  09. Swiper Slider
 *  10. Plugin Typed.js
 *  11. Magnific Popup
 *  12. Layout Masonry
 *  13. Rolagem Suave
 *  14. Efeito Hover em Botões
 *  15. SVG Fallback
 *  16. Rolagem Suave no Chrome
 *  17. Banir Movimento de Imagens
 *  18. Detecção Mobile/Desktop
 *  19. Substituição de Imagens da Galeria PhotoSwipe
 *  20. Formulário de Contato
 *  21. Troca de Cor
 *
 * ------------------------------------------------
 * Fim do Índice
 * ------------------------------------------------ */

gsap.registerPlugin(ScrollTrigger);

// Limitar recálculos automáticos apenas ao evento load
ScrollTrigger.config({ autoRefreshEvents: "load" });

window.addEventListener('load', function() {
  // Adiciona classe loading ao body
  document.body.classList.add('loading');
  // Todas as animações e ScrollTriggers devem ser criadas aqui!

  // Exemplo de uso do matchMedia para separar triggers por device
  const mm = gsap.matchMedia();
  mm.add({
    isDesktop: "(min-width: 1200px)",
    isMobile:  "(max-width: 1199px)"
  }, (context) => {
    // Coloque aqui as animações/triggers específicas para cada device
    // Exemplo:
    // if (context.conditions.isDesktop) { ... } else { ... }

    // --------------------------------------------- //
    // Loader & Loading Animation Start
    // --------------------------------------------- //
    const content = document.querySelector('body');
    const imgLoad = imagesLoaded(content);
    const loadingWrap = document.querySelector('.loading-wrap');
    const loadingItems = loadingWrap.querySelectorAll('.loading__item');
    const fadeInItems = document.querySelectorAll('.loading__fade');

    function startLoader() {
      let counterElement = document.querySelector(".loader__count .count__text");
      let currentValue = 0;
      function updateCounter() {
        if (currentValue < 100) {
          let increment = Math.floor(Math.random() * 10) + 1;
          currentValue = Math.min(currentValue + increment, 100);
          counterElement.textContent = currentValue;
          let delay = Math.floor(Math.random() * 120) + 25;
          setTimeout(updateCounter, delay);
        }
      }
      updateCounter();
    }
    startLoader();

    imgLoad.on('done', instance => {
      hideLoader();
      pageAppearance();
    });

    function hideLoader() {
      gsap.to(".loader__count", { duration: 0.8, ease: 'power2.in', y: "100%", delay: 1.8 });
      gsap.to(".loader__wrapper", { duration: 0.8, ease: 'power4.in', y: "-100%", delay: 2.2 });
      setTimeout(() => {
        document.getElementById("loader").classList.add("loaded");
        // Remove a classe loading do body após o loader
        document.body.classList.remove('loading');
      }, 3200);
    }

    function pageAppearance() {
      gsap.set(loadingItems, { opacity: 0 })
      gsap.to(loadingItems, { 
        duration: 1.1,
        ease: 'power4',
        startAt: {y: 120},
        y: 0,
        opacity: 1,
        delay: 0.8,
        stagger: 0.05
      }, '>-=1.1');
      gsap.set(fadeInItems, { opacity: 0 });
      gsap.to(fadeInItems, { duration: 0.8, ease: 'none', opacity: 1, delay: 3.2 });
    }
    // --------------------------------------------- //
    // Loader & Loading Animation End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Bootstrap Scroll Spy Plugin Settings Start
    // --------------------------------------------- //
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
      target: '#menu',
      smoothScroll: true,
      rootMargin: '0px 0px -40%',
    });
    // --------------------------------------------- //
    // Bootstrap Scroll Spy Plugin Settings End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Scroll to Top Button Start
    // --------------------------------------------- //
    const toTop = document.querySelector("#to-top");

    toTop.addEventListener("click", function(event){
      event.preventDefault()
    });

    toTop.addEventListener("click", () => gsap.to(window, { 
      scrollTo: 0, 
      ease: 'power4.inOut',
      duration: 2,
    }));

    gsap.set(toTop, { opacity: 0 });

    gsap.to(toTop, {
      opacity: 1,
      autoAlpha: 1,
      scrollTrigger: {
        trigger: "body",
        start: "top -20%",
        end: "top -20%",
        toggleActions: "play none reverse none"
      }
    });
    // --------------------------------------------- //
    // Scroll to Top Button End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Stacking Cards Start
    // --------------------------------------------- //
    const cards = document.querySelectorAll('.stack-item');
    const stickySpace = document.querySelector('.stack-offset');
    const stackWrapper = document.querySelector('.stack-wrapper');
    let stackPinTrigger = null;
    let stackEnterTrigger = null;

    function isMobile() {
        return window.innerWidth < 768;
    }

    function resetCards() {
        if (isMobile()) {
            // Em mobile, mostra todos os cards em coluna
            cards.forEach((card, index) => {
                gsap.set(card, { 
                    opacity: 1, 
                    y: 0,
                    position: 'relative',
                    marginBottom: '2rem'
                });
            });
        } else {
            // Em desktop, mantém o comportamento original
            cards.forEach((card, index) => {
                if (index === 0) {
                    gsap.set(card, { opacity: 1, y: 0, position: 'absolute' });
                } else {
                    gsap.set(card, { opacity: 0, y: index * card.offsetHeight, position: 'absolute' });
                }
            });
        }
    }

    function killStackTriggers() {
        if (stackPinTrigger) {
            stackPinTrigger.kill();
            stackPinTrigger = null;
        }
        if (stackEnterTrigger) {
            stackEnterTrigger.kill();
            stackEnterTrigger = null;
        }
        ScrollTrigger.getAll().forEach(st => {
            if (st.vars && st.vars.id === 'stack-pin') st.kill();
        });
    }

    function initStackAnimation() {
        killStackTriggers();
        resetCards();

        // Se for mobile, não inicializa a animação
        if (isMobile()) {
            return;
        }

        let cardHeight = cards[0].offsetHeight;
        const animation = gsap.timeline({ paused: true });
        
        cards.forEach((card, index) => {
            if (index > 0) {
                gsap.set(card, { y: index * cardHeight, opacity: 1 });
                animation.to(card, { y: 0, opacity: 1, duration: 0.5, ease: "none" }, index * 0.2);
            }
        });

        stackPinTrigger = ScrollTrigger.create({
            id: 'stack-pin',
            trigger: stackWrapper,
            start: "top top",
            pin: true,
            end: () => `+=${(cards.length * cardHeight) + stickySpace.offsetHeight}`,
            scrub: true,
            animation: animation,
            invalidateOnRefresh: true,
            onLeave: () => {
                cards.forEach(card => gsap.set(card, { y: 0, opacity: 1 }));
            },
            onEnterBack: () => {
                resetCards();
            }
        });
    }

    if (stackWrapper && cards.length > 0) {
        // Inicializa o estado correto baseado no tamanho da tela
        resetCards();

        // Só cria o trigger de entrada se não for mobile
        if (!isMobile()) {
            stackEnterTrigger = ScrollTrigger.create({
                trigger: stackWrapper,
                start: "top 80%",
                onEnter: () => {
                    initStackAnimation();
                },
                onEnterBack: () => {
                    initStackAnimation();
                },
                once: false
            });
        }

        // Atualiza quando a tela é redimensionada
        window.addEventListener('resize', () => {
            resetCards();
            if (!isMobile()) {
                initStackAnimation();
            } else {
                killStackTriggers();
            }
        });

        ScrollTrigger.addEventListener("refreshInit", () => {
            resetCards();
            if (!isMobile() && stackPinTrigger) {
                let cardHeight = cards[0].offsetHeight;
                cards.forEach((card, index) => {
                    if (index > 0) {
                        gsap.set(card, { y: index * cardHeight, opacity: 1 });
                    }
                });
            }
        });
    }
    // --------------------------------------------- //
    // Stacking Cards End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Scroll Animations Start
    // --------------------------------------------- //
    // Animation In Up
    const animateInUp = document.querySelectorAll(".animate-in-up");
    animateInUp.forEach((element) => {
      gsap.fromTo(element, {
        opacity: 0,
        y: 50,
        ease: 'sine',
      }, {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: element,
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Animation Cards Stack
    // Grid 2x
    if(document.querySelector(".animate-card-2")) {
      gsap.set(".animate-card-2", {y: 100, opacity: 0});
      ScrollTrigger.batch(".animate-card-2", {
        interval: 0.1,
        batchMax: 2,
        duration: 6,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, 
          y: 0,
          ease: 'sine',
          stagger: {each: 0.15, grid: [1, 2]}, 
          overwrite: true
        }),
        onLeave: batch => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
        onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
        onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 100, overwrite: true})
      });
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-2", {y: 0, opacity: 1}));
    };

    // Grid 3x
    if(document.querySelector(".animate-card-3")) {
      gsap.set(".animate-card-3", {y: 50, opacity: 0});
      ScrollTrigger.batch(".animate-card-3", {
        interval: 0.1,
        batchMax: 3,
        duration: 3,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, 
          y: 0,
          ease: 'sine',
          stagger: {each: 0.15, grid: [1, 3]}, 
          overwrite: true
        }),
        onLeave: batch => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
        onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
        onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
      });
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-3", {y: 0, opacity: 1}));
    };

    // Grid 4x
    if(document.querySelector(".animate-card-4")) {
      gsap.set(".animate-card-4", {y: 50, opacity: 0});
      ScrollTrigger.batch(".animate-card-4", {
        interval: 0.1,
        batchMax: 4,
        delay: 1000,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, 
          y: 0,
          ease: 'sine',
          stagger: {each: 0.15, grid: [1, 4]}, 
          overwrite: true
        }),
        onLeave: batch => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
        onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
        onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
      });
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-4", {y: 0, opacity: 1}));
    };

    // Grid 5x
    if(document.querySelector(".animate-card-5")) {
      gsap.set(".animate-card-5", {y: 50, opacity: 0});
      ScrollTrigger.batch(".animate-card-5", {
        interval: 0.1,
        batchMax: 5,
        delay: 1000,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, 
          y: 0,
          ease: 'sine',
          stagger: {each: 0.15, grid: [1, 5]}, 
          overwrite: true
        }),
        onLeave: batch => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
        onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
        onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
      });
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-5", {y: 0, opacity: 1}));
    };
    // --------------------------------------------- //
    // Scroll Animations End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Fade-in Type Effect Start
    // --------------------------------------------- //
    const splitTypes = document.querySelectorAll(".reveal-type");
    splitTypes.forEach((char,i) => {
      const text = new SplitType(char, { types: 'words, chars' });
      gsap.from(text.chars, {
        scrollTrigger: {
          trigger: char,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
          markers: false
        },
        opacity: 0.2,
        stagger: 0.1
      });
    });
    // --------------------------------------------- //
    // Fade-in Type Effect End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Blocks Marquee Start
    // --------------------------------------------- //
    const initMarquee = () => {
      const items = [...document.querySelectorAll(".items--gsap")];
      if (items) {
        const marqueeObject = {
          el: null,
          width: 0
        };
        items.forEach((itemBlock) => {
          marqueeObject.el = itemBlock.querySelector(".items__container");
          marqueeObject.width = marqueeObject.el.offsetWidth;
          marqueeObject.el.innerHTML += marqueeObject.el.innerHTML;
          let dirFromRight = "+=50%";
          let master = gsap
            .timeline()
            .add(marquee(marqueeObject.el, 20, dirFromRight), 0);
          let tween = gsap.to(master, { 
            duration: 1.5, 
            timeScale: 1, 
            paused: true 
          });
          let timeScaleClamp = gsap.utils.clamp(1, 6);
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
              master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
              tween.invalidate().restart();
            }
          });
        });
      }
    };
    const marquee = (item, time, direction) => {
      let mod = gsap.utils.wrap(0, 50);
      return gsap.to(item, {
        duration: time,
        ease: "none",
        x: direction,
        modifiers: {
          x: (x) => (direction = mod(parseFloat(x)) + "%")
        },
        repeat: -1
      });
    };
    initMarquee();
    // --------------------------------------------- //
    // Blocks Marquee End
    // --------------------------------------------- //

    // ------------------------------------------------------------------------------ //
    // Parallax (apply parallax effect to any element with a data-speed attribute) Start
    // ------------------------------------------------------------------------------ //
    gsap.to("[data-speed]", {
      y: (i, el) => (1 - parseFloat(el.getAttribute("data-speed"))) * ScrollTrigger.maxScroll(window) ,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        invalidateOnRefresh: true,
        scrub: 0
      }
    });
    // --------------------------------------------- //
    // Parallax End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Swiper Slider Start
    // --------------------------------------------- //
    const testimonialsSlider = document.querySelector("testimonials-slider");

    if (!testimonialsSlider) {
      const swiper = new Swiper('.swiper-testimonials', {
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: true,
        speed: 1000,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    };
    // --------------------------------------------- //
    // Swiper Slider Start
    // --------------------------------------------- //

    $(window).on("load", function() {
      "use strict";
      
      // --------------------------------------------- //
      // Typed.js Plugin Settings Start
      // --------------------------------------------- //
      var animatedHeadline = $(".animated-type");
      if(animatedHeadline.length){
        var typed = new Typed('#typed', {
          stringsElement: '#typed-strings',
          loop: true,
          typeSpeed: 60,
          backSpeed: 30,
          backDelay: 2500
        });
      }
      // --------------------------------------------- //
      // Typed.js Plugin Settings End
      // --------------------------------------------- //

    });

    $(function() {
      "use strict";

      // --------------------------------------------- //
      // Magnific Popup Start
      // --------------------------------------------- //
      $(".popup-trigger").magnificPopup({
        type: "inline",
        fixedContentPos: true,
        fixedBgPos: true,
        overflowY: "scroll",
        preloader: false,
        midClick: true,
        removalDelay: 600,
        mainClass: "mfp-fade",
      });
      // --------------------------------------------- //
      // Magnific Popup End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // Layout Masonry After Each Image Loads Start
      // --------------------------------------------- //
      $('.my-gallery').imagesLoaded().progress( function() {
        $('.my-gallery').masonry('layout');
      });
      // --------------------------------------------- //
      // Layout Masonry After Each Image Loads End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // Smooth Scrolling Start
      // --------------------------------------------- //
      $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(event) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if (target.length) {
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function() {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr('tabindex','-1');
                $target.focus();
              };
            });
          }
        }
      });
      // --------------------------------------------- //
      // Smooth Scrolling End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // Buttons Hover Effect Start
      // --------------------------------------------- //
      $('.hover-default, .hover-circle, .circle, .inner-video-trigger, .socials-cards__link')
      .on('mouseenter', function(e) {
        var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
        $(this).find('em').css({top:relY, left:relX})
      })
      .on('mouseout', function(e) {
        var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
        $(this).find('em').css({top:relY, left:relX})
      });
      // --------------------------------------------- //
      // Buttons Hover Effect Start
      // --------------------------------------------- //

      // --------------------------------------------- //
      // SVG Fallback Start
      // --------------------------------------------- //
      if(!Modernizr.svg) {
        $("img[src*='svg']").attr("src", function() {
          return $(this).attr("src").replace(".svg", ".png");
        });
      };
      // --------------------------------------------- //
      // SVG Fallback End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // Chrome Smooth Scroll Start
      // --------------------------------------------- //
      try {
        $.browserSelector();
        if($("html").hasClass("chrome")) {
          $.smoothScroll();
        }
      } catch(err) {
      };
      // --------------------------------------------- //
      // Chrome Smooth Scroll End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // Images Moving Ban Start
      // --------------------------------------------- //
      $("img, a").on("dragstart", function(event) { event.preventDefault(); });
      // --------------------------------------------- //
      // Images Moving Ban End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // Detecting Mobile/Desktop Start
      // --------------------------------------------- //
      var isMobile = false;
      if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('html').addClass('touch');
        isMobile = true;
      }
      else {
        $('html').addClass('no-touch');
        isMobile = false;
      }
      //IE, Edge
      var isIE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d+/.test(navigator.userAgent);
      // --------------------------------------------- //
      // Detecting Mobile/Desktop End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // PhotoSwipe Gallery Images Replace Start
      // --------------------------------------------- //
      $('.gallery__link').each(function(){
        $(this)
        .append('<div class="picture"></div>')
        .children('.picture').css({'background-image': 'url('+ $(this).attr('data-image') +')'});
      });
      // --------------------------------------------- //
      // PhotoSwipe Gallery Images Replace End
      // --------------------------------------------- //

      // --------------------------------------------- //
      // Contact Form Start
      // --------------------------------------------- //
      $("#contact-form").submit(function() { //Change
        var th = $(this);
        $.ajax({
          type: "POST",
          url: "mail.php", //Change
          data: th.serialize()
        }).done(function() {
          $('.contact').find('.form').addClass('is-hidden');
          $('.contact').find('.form__reply').addClass('is-visible');
          setTimeout(function() {
            // Done Functions
            $('.contact').find('.form__reply').removeClass('is-visible');
            $('.contact').find('.form').delay(300).removeClass('is-hidden');
            th.trigger("reset");
          }, 5000);
        });
        return false;
      });
      // --------------------------------------------- //
      // Contact Form End
      // --------------------------------------------- //

    });

    // --------------------------------------------- //
    // Color Switch Start
    // --------------------------------------------- //
    const themeBtn = document.querySelector('.color-switcher');

    function getCurrentTheme(){
      let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.getItem('template.theme') ? theme = localStorage.getItem('template.theme') : null;
      return theme;
    }

    function loadTheme(theme){
      const root = document.querySelector(':root');
      root.setAttribute('color-scheme', `${theme}`);
    };

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        let theme = getCurrentTheme();
        if(theme === 'dark'){
          theme = 'light';
        } else {
          theme = 'dark';
        }
        localStorage.setItem('template.theme', `${theme}`);
        loadTheme(theme);
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      loadTheme(getCurrentTheme());
    });
    // --------------------------------------------- //
    // Color Switch End
    // --------------------------------------------- //

    // --------------------------------------------- //
    // Scroll Indicator Hide on Form Start
    // --------------------------------------------- //
    if (document.querySelector('#scroll-indicator') && document.querySelector('.form-container')) {
      const indicator = document.getElementById('scroll-indicator');
      ScrollTrigger.create({
        trigger: '.form-container',
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => indicator.classList.add('is-hidden'),
        onLeaveBack: () => indicator.classList.remove('is-hidden'),
        onLeave: () => indicator.classList.add('is-hidden'),
        onEnterBack: () => indicator.classList.remove('is-hidden'),
        toggleActions: 'play none none reverse'
      });
    }
    // --------------------------------------------- //
    // Scroll Indicator Hide on Form End
    // --------------------------------------------- //

    // Forçar refresh manual após assets dinâmicos
    ScrollTrigger.refresh();
  });
});