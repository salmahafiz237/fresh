import { announce, on, prefersReducedMotion, qs, qsa } from "./utilities.js";

export function initHero(root = qs("[data-hero]")) {
  if (!root) return;

  const track = qs("[data-hero-track]", root);
  const slides = qsa("[data-hero-slide]", root);
  const dots = qsa("[data-hero-dot]", root);
  const prev = qs("[data-hero-prev]", root);
  const next = qs("[data-hero-next]", root);
  let index = 0;
  let timer;

  function go(nextIndex, announceChange = true) {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", String(i !== index));
    });
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (announceChange) {
      const title = slides[index].querySelector("h2, h1")?.textContent?.trim();
      if (title) announce(`Slide ${index + 1} of ${slides.length}: ${title}`);
    }
  }

  function play() {
    stop();
    if (prefersReducedMotion() || slides.length < 2) return;
    timer = window.setInterval(() => go(index + 1, false), 6000);
  }

  function stop() {
    window.clearInterval(timer);
  }

  on(prev, "click", () => go(index - 1));
  on(next, "click", () => go(index + 1));
  dots.forEach((dot, i) => on(dot, "click", () => go(i)));
  on(root, "mouseenter", stop);
  on(root, "mouseleave", play);
  on(root, "focusin", stop);
  on(root, "focusout", play);
  on(root, "keydown", (event) => {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  });

  go(0, false);
  play();
}
