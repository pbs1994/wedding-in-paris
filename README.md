# Wedding in Paris — Agence Chance

A digital luxury-magazine site for destination weddings in Paris, designed with an editorial, Louis Vuitton–inspired visual language: full-bleed photography, generous white space, a black / white / ivory / champagne palette, and minimal copy.

Static site, no build step required — plain HTML/CSS/JS.

## Structure

```
index.html          all sections (Hero, Why Paris, The Experience, Meet Your Planner,
                     Testimonials, Start Planning CTA, FAQ, Footer)
css/style.css        design system (tokens, layout, motion)
js/main.js           nav, scroll-reveal, FAQ accordion, carousel drag
assets/img/          processed photography (rotated/resized/compressed from source)
assets/video/        Experience section film (H.264 mp4, muted/looping)
```

## Running locally

Any static file server works, e.g.:

```
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Notes / placeholders to revisit

- **Testimonials** — the "Kind Words" section ships with 3 sample quotes as placeholders and a link to Google Search reviews. Swap in a real Google Reviews / Places widget when API access is available.
- **Contact links** — "Start Planning" and "Discover Agence Chance" currently point to WhatsApp (`wa.me/33757532491`), built from the phone number in the brief. Point them to a booking form or main site once that URL exists.
- **Instagram** footer link assumes `instagram.com/agence.chance` from the handle given in the brief.
- Source photography and video lived in `~/Downloads` (brief docx, photos zip, video file) and were processed (rotated, resized, compressed) into `assets/`.
