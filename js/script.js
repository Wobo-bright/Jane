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

// Music state management
let isMusicPlaying = false;
let musicInitialized = false;
let autoplayAttempted = false;
let visibilityListenerAdded = false;
let interactionListenersAdded = false;

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

// Music control functions
function playMusic() {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused && !backgroundMusic.ended) {
    backgroundMusic.play().catch(() => {
      // Handle autoplay restriction gracefully
      musicToggle.textContent = 'Play Music';
      isMusicPlaying = false;
    });
    musicToggle.textContent = 'Pause Music';
    isMusicPlaying = true;
  }
}

function pauseMusic() {
  if (!backgroundMusic) return;
  if (!backgroundMusic.paused) {
    backgroundMusic.pause();
    musicToggle.textContent = 'Play Music';
    isMusicPlaying = false;
  }
}

function toggleMusic() {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function attemptAutoplay() {
  if (autoplayAttempted || !backgroundMusic) return;
  autoplayAttempted = true;
  
  backgroundMusic.volume = 0.5; // Set a reasonable volume
  
  // Try to play immediately
  backgroundMusic.play().then(() => {
    musicToggle.textContent = 'Pause Music';
    isMusicPlaying = true;
    musicInitialized = true;
    // If autoplay succeeds, we don't need interaction listeners
    removeInteractionListeners();
  }).catch(() => {
    // Autoplay blocked, set up interaction listeners
    musicToggle.textContent = 'Play Music';
    isMusicPlaying = false;
    addInteractionListeners();
  });
}

function addInteractionListeners() {
  if (interactionListenersAdded) return;
  interactionListenersAdded = true;
  
  const interactionEvents = ['click', 'touchstart', 'keydown', 'pointerdown', 'scroll'];
  const handleInteraction = () => {
    if (!backgroundMusic.paused) return; // Already playing
    if (musicInitialized) return; // Already initialized
    
    backgroundMusic.play().then(() => {
      musicToggle.textContent = 'Pause Music';
      isMusicPlaying = true;
      musicInitialized = true;
      removeInteractionListeners();
    }).catch(() => {
      // Still can't play, keep listeners
    });
  };
  
  interactionEvents.forEach(event => {
    document.addEventListener(event, handleInteraction, { once: true });
  });
  
  // Store for cleanup
  window._interactionHandlers = handleInteraction;
  window._interactionEvents = interactionEvents;
}

function removeInteractionListeners() {
  if (!interactionListenersAdded) return;
  interactionListenersAdded = false;
  
  if (window._interactionHandlers && window._interactionEvents) {
    window._interactionEvents.forEach(event => {
      document.removeEventListener(event, window._interactionHandlers);
    });
  }
}

function setupVisibilityHandling() {
  if (visibilityListenerAdded) return;
  visibilityListenerAdded = true;
  
  const handleVisibilityChange = () => {
    if (!backgroundMusic) return;
    
    if (document.hidden) {
      // Page is hidden, pause if playing
      if (!backgroundMusic.paused) {
        pauseMusic();
        // Store that we paused due to visibility
        backgroundMusic._pausedByVisibility = true;
      }
    } else {
      // Page is visible again
      if (backgroundMusic.paused && backgroundMusic._pausedByVisibility) {
        // Only resume if we paused it ourselves
        playMusic();
        backgroundMusic._pausedByVisibility = false;
      }
    }
  };
  
  const handlePageHide = () => {
    if (!backgroundMusic) return;
    if (!backgroundMusic.paused) {
      pauseMusic();
      backgroundMusic._pausedByPageHide = true;
    }
  };
  
  const handlePageShow = () => {
    if (!backgroundMusic) return;
    if (backgroundMusic.paused && backgroundMusic._pausedByPageHide) {
      playMusic();
      backgroundMusic._pausedByPageHide = false;
    }
  };
  
  const handleBlur = () => {
    if (!backgroundMusic) return;
    // Don't pause on blur for better user experience
    // Just update state if needed
  };
  
  const handleFocus = () => {
    if (!backgroundMusic) return;
    // Check if we should resume playing
    if (backgroundMusic.paused && backgroundMusic._pausedByVisibility) {
      // Resume if we were playing before visibility change
      playMusic();
      backgroundMusic._pausedByVisibility = false;
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('pageshow', handlePageShow);
  window.addEventListener('blur', handleBlur);
  window.addEventListener('focus', handleFocus);
  
  // Store for cleanup
  window._visibilityHandlers = {
    handleVisibilityChange,
    handlePageHide,
    handlePageShow,
    handleBlur,
    handleFocus
  };
}

// Enhanced toggle music to work with our new system
function enhancedToggleMusic() {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused) {
    playMusic();
    musicInitialized = true;
  } else {
    pauseMusic();
  }
}

// Music initialization
function initMusic() {
  if (!backgroundMusic) return;
  
  // Set up visibility handling
  setupVisibilityHandling();
  
  // Attempt autoplay
  attemptAutoplay();
  
  // Override toggle music with enhanced version
  const originalToggle = musicToggle._listeners;
  musicToggle.removeEventListener('click', toggleMusic);
  musicToggle.addEventListener('click', enhancedToggleMusic);
}

// Call original functions
prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
continueBtn.addEventListener('click', () => goToSlide(1));

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

// Initialize music system
initMusic();