(() => {
  'use strict';

  /* ---------- Nav: solid background on scroll ---------- */
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Nav: mobile burger ---------- */
  const burger = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion__item').forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.accordion__item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.accordion__panel').style.height = '0px';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.height = '0px';
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.height = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Carousel: drag to scroll ---------- */
  const track = document.querySelector('[data-carousel-track]');
  if (track) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const start = (x) => {
      isDown = true;
      startX = x;
      scrollLeft = track.scrollLeft;
      track.style.scrollSnapType = 'none';
    };
    const move = (x) => {
      if (!isDown) return;
      track.scrollLeft = scrollLeft - (x - startX);
    };
    const end = () => {
      isDown = false;
      track.style.scrollSnapType = 'x proximity';
    };

    track.addEventListener('mousedown', (e) => start(e.pageX));
    window.addEventListener('mousemove', (e) => move(e.pageX));
    window.addEventListener('mouseup', end);

    track.addEventListener('touchstart', (e) => start(e.touches[0].pageX), { passive: true });
    track.addEventListener('touchmove', (e) => move(e.touches[0].pageX), { passive: true });
    track.addEventListener('touchend', end);

    track.addEventListener('dragstart', (e) => e.preventDefault());
  }

  /* ---------- Hero video-like image fallback: ensure autoplay on mobile ---------- */
  const video = document.querySelector('.experience__video video');
  if (video) {
    video.addEventListener('loadedmetadata', () => {
      video.play().catch(() => {});
    });
  }
})();
