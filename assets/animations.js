// Modern Animations and Interactions for CANS Sigorta

// Intersection Observer for reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-on');
    }
  });
}, { 
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', () => {
  // Add reveal class to elements
  const revealElements = document.querySelectorAll('.card, .section h2, .hero-banner h1, .hero-banner p');
  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Stagger animation for cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-banner');
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Button hover effects
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px) scale(1.02)';
  });
  
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Card hover effects with tilt
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) rotateX(5deg)';
    this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) rotateX(0deg)';
    this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
  });
});

// Loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Animate hero content
  const heroContent = document.querySelector('.hero-banner .container');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'all 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  }
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    element.textContent = Math.floor(start);
    
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.textContent);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
  counterObserver.observe(counter);
});

// Form validation with smooth feedback
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('blur', function() {
    if (this.value.trim() === '') {
      this.style.borderColor = '#ef4444';
      this.style.transform = 'scale(0.98)';
    } else {
      this.style.borderColor = '#10b981';
      this.style.transform = 'scale(1)';
    }
  });
  
  input.addEventListener('focus', function() {
    this.style.borderColor = '#004AAD';
    this.style.transform = 'scale(1.02)';
  });
});

// WhatsApp FAB pulse animation
const whatsappFab = document.querySelector('.whatsapp-fab');
if (whatsappFab) {
  setInterval(() => {
    whatsappFab.style.animation = 'pulse 1s ease-in-out';
    setTimeout(() => {
      whatsappFab.style.animation = '';
    }, 1000);
  }, 5000);
}

// Sticky CTA bar slide up animation
const stickyCTA = document.querySelector('.sticky-cta');
if (stickyCTA) {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 500) {
      // Scrolling down
      stickyCTA.style.transform = 'translateY(100%)';
    } else {
      // Scrolling up
      stickyCTA.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });
}

// Typing animation for hero text
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing animation for hero title
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-banner h1');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 30);
    }, 1000);
  }
});

// Smooth reveal for sections
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(50px)';
  section.style.transition = 'all 0.8s ease';
  sectionObserver.observe(section);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
  // Scroll-based animations here
}, 10);

window.addEventListener('scroll', debouncedScroll);
