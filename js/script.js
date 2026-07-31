const carousel = document.getElementById('carousel');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const musicToggle = document.getElementById('musicToggle');
const continueBtn = document.getElementById('continueBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const letterBody = document.getElementById('letterBody');

const relationshipStart = new Date('2026-04-13T00:00:00');
const letterText =
  "Hey baby,\n\nThis is literary my first time doing this and a couple other things I happened to do them first with you and I keep thinking about how beautiful it is that I get to love you in this life. \n\nI'm obsessed with you at this point, I can't spend a day without you in the nuclei of my mind. Every day with you feels like a quiet miracle made of small moments, warm care, deep raw conversations without fear and the kind of comfort that makes a home out of ordinary time.\n\nI hope you know how deeply adored you are, and how much I look forward to every day still waiting to be with you.\n\nI love you so much baby, to the moon and back.";

let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let scrollFrame = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function goToSlide(index) {
  const safeIndex = Math.max(0, Math.min(slides.length - 1, index));
  currentIndex = safeIndex;
  const targetSlide = slides[currentIndex];
  carousel.scrollTo({
    left: targetSlide.offsetLeft,
    behavior: reducedMotion ? 'auto' : 'smooth',
  });
}

function syncCurrentSlide() {
  const scrollLeft = carousel.scrollLeft;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const distance = Math.abs(slide.offsetLeft - scrollLeft);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  currentIndex = closestIndex;
}

function updateCounter() {
  const now = new Date();
  const diffInMs = now - relationshipStart;
  const totalMinutes = Math.floor(diffInMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  document.getElementById('daysCounter').textContent = days;
  document.getElementById('hoursCounter').textContent = hours;
  document.getElementById('minutesCounter').textContent = minutes;
}

function animateLetter() {
  if (!letterBody) return;
  letterBody.innerHTML = '';
  let index = 0;

  const typeInterval = window.setInterval(() => {
    letterBody.textContent += letterText[index];
    index += 1;

    if (index >= letterText.length) {
      window.clearInterval(typeInterval);
    }
  }, 32);
}

function toggleMusic() {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {
      musicToggle.textContent = 'Play Music';
    });
    musicToggle.textContent = 'Pause Music';
  } else {
    backgroundMusic.pause();
    musicToggle.textContent = 'Play Music';
  }
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
continueBtn.addEventListener('click', () => goToSlide(1));
musicToggle.addEventListener('click', toggleMusic);

carousel.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) > 20) {
    event.preventDefault();
    if (event.deltaY > 0) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }
}, { passive: false });

carousel.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    goToSlide(currentIndex + 1);
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    goToSlide(currentIndex - 1);
  }
});

carousel.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
}, { passive: true });

carousel.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].clientX;
  const delta = touchEndX - touchStartX;

  if (delta > 50) {
    goToSlide(currentIndex - 1);
  } else if (delta < -50) {
    goToSlide(currentIndex + 1);
  }
}, { passive: true });

carousel.addEventListener('scroll', () => {
  if (scrollFrame) {
    cancelAnimationFrame(scrollFrame);
  }

  scrollFrame = requestAnimationFrame(syncCurrentSlide);
}, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.dataset.title === 'Letter') {
        animateLetter();
        observer.disconnect();
      }
    });
  },
  { threshold: 0.6 }
);

slides.forEach((slide) => observer.observe(slide));

updateCounter();
setInterval(updateCounter, 1000);
goToSlide(0);
