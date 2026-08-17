# Wedding in Paris — Agence Chance

A digital luxury-magazine site for destination weddings in Paris, designed with an editorial, Louis Vuitton–inspired visual language: full-bleed photography, generous white space, a black / white / ivory / champagne palette, and minimal copy.

Static site, no build step required — plain HTML/CSS/JS.

## Structure

```
index.html          all sections (Hero, Why Paris, The Experience, Meet Your Planner,
                     Testimonials, Start Planning CTA, FAQ, Footer) + SEO meta tags,
                     Open Graph/Twitter cards, LocalBusiness + FAQPage JSON-LD
css/style.css        design system (tokens, layout, motion)
js/main.js           nav, scroll-reveal, FAQ accordion, carousel drag, lightbox
assets/img/          processed photography (rotated/resized/compressed from source)
assets/video/        Experience section film (H.264 mp4, muted/looping)
robots.txt           allows all crawlers, points to sitemap.xml
sitemap.xml          single-page sitemap
```

## Running locally

Any static file server works, e.g.:

```
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Notes / placeholders to revisit

- **Testimonials** — the "Kind Words" section pulls live reviews from Agence Chance's real Google Business Profile via the Places API (New), same widget/placeId as the wedding-in-normandy site (`js/main.js`, `GOOGLE_REVIEWS_CONFIG`). If the widget ever stops showing reviews, add this site's domain to the API key's allowed referrers in Google Cloud Console — until then it falls back to the static "Read Our Reviews on Google" link, nothing breaks.
- **Contact links** — "Start Planning" (hero + CTA) points to WhatsApp (`wa.me/33757532491`), built from the phone number in the brief. "Discover Agence Chance" and the footer's "Weddings in France" tagline link to the main site, https://agencechance.com/en/.
- **Instagram** footer link assumes `instagram.com/agence.chance` from the handle given in the brief.
- Source photography and video lived in `~/Downloads` (brief docx, photos zip, video file) and were processed (rotated, resized, compressed) into `assets/`.
- **SEO** — canonical URL, Open Graph/Twitter image and JSON-LD `url`/`sameAs` fields are hardcoded to `https://wedding-in-paris.com/`. If the domain ever changes, update those in `index.html`'s `<head>`, plus `robots.txt` and `sitemap.xml`.
