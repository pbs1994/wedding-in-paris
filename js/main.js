/* ─── Google Reviews config ───────────────────────────────────────────────
   Same business/placeId as wedding-in-normandy — one Google Business Profile
   for Agence Chance. The API key is restricted (Application restrictions →
   Websites) to the domain(s) wedding-in-normandy is served from; add this
   site's domain to the key's allowed referrers in Google Cloud Console, or
   the widget stays hidden and only the static "Read Our Reviews on Google"
   fallback link shows — nothing breaks, nothing is faked. ──────────────── */
const GOOGLE_REVIEWS_CONFIG = {
  apiKey: 'AIzaSyA8qrjUojff8hMvLGGg-uiilIGBw7DEtwA',
  placeId: 'ChIJX7Pb0rIt4UcRkFeFsFUSkKY',
};

(() => {
  'use strict';

  /* ---------- Nav: burger toggle ---------- */
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

  initGoogleReviews();
})();

/* ─── Google Reviews: live via the Places API (New) ──────────────────────
   Reads Agence Chance's real rating and up to 5 real reviews at page load
   and renders them into #google-reviews. Config is declared at the top of
   this file (referenced from inside the IIFE above). ────────────────────── */
function initGoogleReviews() {
  const { apiKey, placeId } = GOOGLE_REVIEWS_CONFIG;
  const container = document.getElementById('google-reviews');
  if (!container) return;
  if (!apiKey || apiKey.startsWith('YOUR_') || !placeId || placeId.startsWith('YOUR_')) return;

  bootstrapGoogleMaps(apiKey);
  google.maps.importLibrary('places')
    .then(({ Place }) => {
      const place = new Place({ id: placeId });
      return place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews'] });
    })
    .then(({ place }) => renderGoogleReviews(place, container))
    .catch((err) => {
      console.warn('Google reviews unavailable:', err);
    });
}

/* Google's official dynamic-library bootstrap loader (verbatim from their
   docs, key substituted in). Registers importLibrary() immediately, and
   only injects the real script the first time something calls it. */
function bootstrapGoogleMaps(apiKey) {
  if (window.google && window.google.maps && window.google.maps.importLibrary) return;
  ((g) => {
    let h, a, k, b;
    const p = 'The Google Maps JavaScript API', c = 'google', l = 'importLibrary', q = '__ib__', m = document;
    b = window;
    b = b[c] || (b[c] = {});
    const d = b.maps || (b.maps = {}), r = new Set(), e = new URLSearchParams();
    const u = () => h || (h = new Promise(async (f, n) => {
      await (a = m.createElement('script'));
      e.set('libraries', [...r] + '');
      for (k in g) e.set(k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()), g[k]);
      e.set('callback', c + '.maps.' + q);
      a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
      d[q] = f;
      a.onerror = () => { h = n(new Error(p + ' could not load.')); };
      a.nonce = m.querySelector('script[nonce]')?.nonce || '';
      m.head.append(a);
    }));
    d[l] ? console.warn(p + ' only loads once. Ignoring:', g) : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
  })({ key: apiKey, v: 'weekly', language: 'en' });
}

function renderGoogleReviews(place, container) {
  if (!place || !place.reviews || !place.reviews.length) return;

  const badgeEl = container.querySelector('.google-reviews__badge');
  const starsEl = container.querySelector('.google-reviews__stars');
  const countEl = container.querySelector('.google-reviews__count');
  const track = container.querySelector('.google-reviews__track');
  const prevBtn = container.querySelector('.google-reviews__prev');
  const nextBtn = container.querySelector('.google-reviews__next');

  if (typeof place.rating === 'number') {
    badgeEl.textContent = ratingBadge(place.rating);
    starsEl.innerHTML = starMarkup(place.rating);
  }

  if (typeof place.userRatingCount === 'number') {
    countEl.innerHTML = `Based on <strong>${place.userRatingCount}</strong> review${place.userRatingCount === 1 ? '' : 's'}`;
  }

  track.innerHTML = place.reviews.slice(0, 5).map(reviewCardMarkup).join('');

  track.querySelectorAll('.review-card__more').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.review-card');
      const expanded = card.classList.toggle('is-expanded');
      btn.textContent = expanded ? 'Show less' : 'Read more';
    });
  });

  function step(direction) {
    const card = track.querySelector('.review-card');
    const distance = card ? card.getBoundingClientRect().width + 12 : 300;
    track.scrollBy({ left: distance * direction, behavior: 'smooth' });
  }
  if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => step(1));

  container.hidden = false;
}

function ratingBadge(rating) {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Great';
  if (rating >= 3) return 'Good';
  return 'Reviews';
}

/* A handful of the site's palette tones, cycled by a simple hash of the
   reviewer's name — gives every initial avatar a stable, distinct color
   across reloads without needing the photo Google doesn't always provide. */
const AVATAR_PALETTE = ['#C9A876', '#8B8781', '#14120F', '#A9895E', '#6B655F'];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function reviewCardMarkup(review) {
  const name = (review.authorAttribution && review.authorAttribution.displayName) || 'Google user';
  const photo = (review.authorAttribution && review.authorAttribution.photoURI) || '';
  const time = escapeHtml(review.relativePublishTimeDescription || '');
  const text = escapeHtml((review.text || '').trim());
  const initial = escapeHtml(name.trim().charAt(0).toUpperCase() || 'G');
  const avatar = photo
    ? `<img class="review-card__avatar" src="${escapeHtml(photo)}" alt="" loading="lazy" />`
    : `<span class="review-card__avatar" style="background:${avatarColor(name)}" aria-hidden="true">${initial}</span>`;

  return `
    <article class="review-card">
      <svg class="review-card__google-icon" aria-hidden="true"><use href="#icon-google-g"></use></svg>
      <div class="review-card__head">
        ${avatar}
        <div>
          <p class="review-card__name">${escapeHtml(name)}</p>
          <p class="review-card__time">${time}</p>
        </div>
      </div>
      <div class="review-card__stars">
        <span class="review-card__stars-row">${starMarkup(review.rating || 0)}</span>
        <span class="review-card__verified" title="Verified Google review">
          <svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg>
        </span>
      </div>
      <p class="review-card__text">${text}</p>
      <button type="button" class="review-card__more">Read more</button>
    </article>
  `;
}

function starMarkup(rating) {
  const rounded = Math.round(rating);
  let out = '';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rounded;
    out += `<svg class="icon" aria-hidden="true" style="opacity:${filled ? 1 : 0.3}"><use href="#icon-star"></use></svg>`;
  }
  return out;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
