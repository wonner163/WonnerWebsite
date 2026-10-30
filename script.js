document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const track = document.getElementById("carouselTrack");
const slides = Array.from(track.children);
const dots = document.getElementById("carouselDots");
let current = 0;
let paused = false;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("role", "tab");
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dots.appendChild(dot);
});

function goTo(i) {
  current = (i + slides.length) % slides.length;
  track.scrollTo({ left: slides[current].offsetLeft - slides[0].offsetLeft });
}

function syncDots() {
  const idx = Math.round(track.scrollLeft / (slides[0].offsetWidth + 16));
  current = Math.min(Math.max(idx, 0), slides.length - 1);
  Array.from(dots.children).forEach((d, i) => d.setAttribute("aria-selected", String(i === current)));
}

track.addEventListener("scroll", syncDots, { passive: true });
document.getElementById("carouselPrev").addEventListener("click", () => goTo(current - 1));
document.getElementById("carouselNext").addEventListener("click", () => goTo(current + 1));
track.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

const carousel = document.getElementById("carousel");
["mouseenter", "focusin", "touchstart"].forEach((ev) => carousel.addEventListener(ev, () => (paused = true), { passive: true }));
["mouseleave", "focusout"].forEach((ev) => carousel.addEventListener(ev, () => (paused = false)));

let visible = false;
new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(carousel);
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(() => {
    if (!paused && visible) goTo(current + 1);
  }, 5000);
}
syncDots();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
slides.forEach((slide) => {
  slide.querySelector(".slide-img").addEventListener("click", () => {
    const img = slide.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.showModal();
  });
});
lightbox.addEventListener("click", () => lightbox.close());
