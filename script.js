// =======================
// Config
// =======================
const config = {
  delays: {
    stagger: 0.2,
    divider: 0.2,
    projectCard: 0.2
  },
  thresholds: {
    fadeSlide: 0.2,
    featured: 0.3,
    divider: 0.1,
    hero: 0.3,
    contact: 0.3,
    footer: 0.3
  }
};

// =======================
// DOM Ready Container
// =======================
document.addEventListener("DOMContentLoaded", () => {
  // === Setup Functions ===
  setupMobileMenu();
  setupAnimatedElements();
  observeFeaturedSection();
  observeSectionDividers();
  setupHeroMouseParallax();
  setupContactObserver();
  setupFooterObserver();
  setupModalViewer();
  setupBackToTop();
  preloadHeroBackground();

  // === Scroll Effects ===
  window.addEventListener("scroll", () => {
    handleHeaderScroll();
    applyHeroParallax();
    updateScrollProgress();
    updateHeroBackground();
    toggleBackToTop();
  });
});

// =======================
// Utility Functions
// =======================
function createObserver(callback, threshold = 0.3) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });
}

// =======================
// Setup Functions
// =======================
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav ul');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
}

function setupAnimatedElements() {
  const elements = document.querySelectorAll(".fade-in, .slide-up");
  elements.forEach((el, i) => {
    el.style.transitionDelay = `${i * config.delays.stagger}s`;
  });

  const observer = createObserver(el => el.classList.add("active"), config.thresholds.fadeSlide);
  elements.forEach(el => observer.observe(el));
}

function observeFeaturedSection() {
  const section = document.getElementById("featured");
  if (!section) return;

  const observer = createObserver(() => {
    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * config.delays.projectCard}s`;
      card.classList.add("visible");
    });
  }, config.thresholds.featured);

  observer.observe(section);
}

function observeSectionDividers() {
  const dividers = document.querySelectorAll(".section-divider");
  dividers.forEach((divider, i) => {
    divider.style.transitionDelay = `${i * config.delays.divider}s`;
  });

  const observer = createObserver(el => el.classList.add("active"), config.thresholds.divider);
  dividers.forEach(divider => observer.observe(divider));
}

function setupContactObserver() {
  const contact = document.querySelector(".contact-animate");
  if (!contact) return;

  const observer = createObserver(el => el.classList.add("active"), config.thresholds.contact);
  observer.observe(contact);
}

function setupFooterObserver() {
  const footer = document.querySelector("footer");
  if (!footer) return;

  const observer = createObserver(el => el.classList.add("visible"), config.thresholds.footer);
  observer.observe(footer);
}

function setupModalViewer() {
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const closeButton = document.querySelector(".close-button");

  document.querySelectorAll(".project-card, .view-project").forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img")?.src || card.closest('.project-card').querySelector("img").src;
      const title = card.querySelector("h3")?.textContent || card.closest('.project-card').querySelector("h3").textContent;
      const desc = card.querySelector(".modal-details p[data-modal]")?.textContent || 
                  card.closest('.project-card').querySelector(".modal-details p[data-modal]")?.textContent || "";

      modalImage.src = img;
      modalTitle.textContent = title;
      modalDescription.textContent = desc;

      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });

  closeButton.addEventListener("click", closeModal);
  window.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
}

function setupBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;
  
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

function toggleBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;
  
  if (window.scrollY > 500) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
}

function setupHeroMouseParallax() {
  const hero = document.querySelector("#hero");
  if (!hero) return;

  hero.addEventListener("mousemove", e => {
    if (window.innerWidth > 900) {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      const heroText = document.querySelector(".hero-text");
      if (heroText) {
        heroText.style.transform = `translate(${x}px, ${y}px)`;
      }
    }
  });
  
  // Reset position when mouse leaves
  hero.addEventListener("mouseleave", () => {
    const heroText = document.querySelector(".hero-text");
    if (heroText) {
      heroText.style.transform = 'translate(0, 0)';
    }
  });
}

function preloadHeroBackground() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const img = new Image();
  img.src = 'hero.jpg';
  img.onload = () => {
    hero.style.backgroundImage = "url('hero.jpg')";
  };
  img.onerror = () => {
    // Fallback if image fails to load
    hero.style.background = 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)';
  };
}


// =======================
// Scroll Handlers
// =======================
function handleHeaderScroll() {
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
}

function applyHeroParallax() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const scrollOffset = window.scrollY * 0.5;
  hero.style.backgroundPosition = `center ${scrollOffset}px`;
}

function updateScrollProgress() {
  const scrollBar = document.getElementById("scroll-bar");
  if (!scrollBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollBar.style.width = `${scrollPercent}%`;
}

function updateHeroBackground() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const opacity = 1 - Math.min(scrollPercent * 3, 1);
  const overlay = document.querySelector('.hero-overlay');
  
  if (overlay) {
    overlay.style.opacity = opacity;
  }
}