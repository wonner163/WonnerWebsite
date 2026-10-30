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

const slides = Array.from(document.querySelectorAll("#carouselTrack .slide"));
const dots = document.getElementById("carouselDots");
const carousel = document.getElementById("carousel");
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
  slides.forEach((s, n) => s.classList.toggle("is-active", n === current));
  Array.from(dots.children).forEach((d, n) => d.setAttribute("aria-selected", String(n === current)));
}

document.getElementById("carouselPrev").addEventListener("click", () => goTo(current - 1));
document.getElementById("carouselNext").addEventListener("click", () => goTo(current + 1));
carousel.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

carousel.addEventListener("mouseenter", () => (paused = true));
carousel.addEventListener("mouseleave", () => (paused = false));
carousel.addEventListener("touchstart", () => (paused = true), { passive: true });
carousel.addEventListener("touchend", () => setTimeout(() => (paused = false), 4000), { passive: true });

let swipeX = null;
carousel.addEventListener("touchstart", (e) => (swipeX = e.touches[0].clientX), { passive: true });
carousel.addEventListener("touchend", (e) => {
  if (swipeX === null) return;
  const dx = e.changedTouches[0].clientX - swipeX;
  if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  swipeX = null;
});

setInterval(() => {
  if (!paused) goTo(current + 1);
}, 4000);
goTo(0);

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
slides.forEach((slide) => {
  slide.querySelector(".slide-img").addEventListener("click", () => {
    const img = slide.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    paused = true;
    lightbox.showModal();
  });
});
lightbox.addEventListener("close", () => (paused = false));
lightbox.addEventListener("click", () => lightbox.close());
