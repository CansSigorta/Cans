// CANS Sigorta Visual Effects - 3D, Parallax, Dark Mode
class CANSVisualEffects {
  constructor() {
    this.isDarkMode = false;
    this.parallaxElements = [];
    this.init();
  }

  init() {
    this.setupDarkMode();
    this.setupParallax();
    this.setup3DEffects();
    this.setupVideoBackgrounds();
    this.setupParticleSystem();
  }

  // Dark Mode Toggle
  setupDarkMode() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('cans-theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }

    // Create dark mode toggle
    this.createDarkModeToggle();
  }

  createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'dark-mode-toggle';
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = `
      <span class="dark-mode-icon">🌙</span>
      <span class="dark-mode-text">Karanlık Mod</span>
    `;
    
    toggle.addEventListener('click', () => {
      this.toggleDarkMode();
    });

    // Add to header
    const header = document.querySelector('header .nav');
    if (header) {
      header.appendChild(toggle);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
    
    // Save preference
    localStorage.setItem('cans-theme', this.isDarkMode ? 'dark' : 'light');
    
    // Track event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'dark_mode_toggle', {
        event_category: 'UI',
        value: this.isDarkMode
      });
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-mode');
    this.isDarkMode = true;
    
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) {
      toggle.innerHTML = `
        <span class="dark-mode-icon">☀️</span>
        <span class="dark-mode-text">Aydınlık Mod</span>
      `;
    }
  }

  disableDarkMode() {
    document.body.classList.remove('dark-mode');
    this.isDarkMode = false;
    
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) {
      toggle.innerHTML = `
        <span class="dark-mode-icon">🌙</span>
        <span class="dark-mode-text">Karanlık Mod</span>
      `;
    }
  }

  // Parallax Effects
  setupParallax() {
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (this.parallaxElements.length > 0) {
      window.addEventListener('scroll', this.handleParallax.bind(this));
    }
  }

  handleParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    this.parallaxElements.forEach(element => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  // 3D Effects
  setup3DEffects() {
    this.setup3DCards();
    this.setup3DButtons();
    this.setup3DImages();
  }

  setup3DCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.add3DEffect(card, e);
      });
      
      card.addEventListener('mousemove', (e) => {
        this.update3DEffect(card, e);
      });
      
      card.addEventListener('mouseleave', () => {
        this.remove3DEffect(card);
      });
    });
  }

  add3DEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * 20;
    const rotateY = (mouseX / rect.width) * 20;
    
    element.style.transform = `
      perspective(1000px) 
      rotateX(${-rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(20px)
      scale(1.05)
    `;
    element.style.transition = 'none';
  }

  update3DEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * 20;
    const rotateY = (mouseX / rect.width) * 20;
    
    element.style.transform = `
      perspective(1000px) 
      rotateX(${-rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(20px)
      scale(1.05)
    `;
  }

  remove3DEffect(element) {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
    element.style.transition = 'transform 0.3s ease';
  }

  setup3DButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'perspective(1000px) rotateX(-5deg) translateZ(10px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'perspective(1000px) rotateX(0deg) translateZ(0px)';
      });
    });
  }

  setup3DImages() {
    const images = document.querySelectorAll('img[data-3d]');
    
    images.forEach(img => {
      img.addEventListener('mouseenter', (e) => {
        this.add3DEffect(img, e);
      });
      
      img.addEventListener('mousemove', (e) => {
        this.update3DEffect(img, e);
      });
      
      img.addEventListener('mouseleave', () => {
        this.remove3DEffect(img);
      });
    });
  }

  // Video Backgrounds
  setupVideoBackgrounds() {
    const videoElements = document.querySelectorAll('[data-video-bg]');
    
    videoElements.forEach(element => {
      const videoSrc = element.dataset.videoBg;
      if (videoSrc) {
        this.createVideoBackground(element, videoSrc);
      }
    });
  }

  createVideoBackground(element, videoSrc) {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
      opacity: 0.3;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(video);
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 0;
    `;
    element.appendChild(overlay);
    
    // Ensure content is above video
    const content = element.querySelector('.container');
    if (content) {
      content.style.position = 'relative';
      content.style.zIndex = '1';
    }
  }

  // Particle System
  setupParticleSystem() {
    const particleContainers = document.querySelectorAll('[data-particles]');
    
    particleContainers.forEach(container => {
      this.createParticleSystem(container);
    });
  }

  createParticleSystem(container) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    
    container.style.position = 'relative';
    container.appendChild(canvas);
    
    let particles = [];
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      };
    };
    
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    };
    
    const updateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });
      
      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
    };
    
    const animate = () => {
      updateParticles();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  }

  // Advanced Animations
  setupAdvancedAnimations() {
    this.setupMorphingShapes();
    this.setupFloatingElements();
    this.setupGradientAnimations();
  }

  setupMorphingShapes() {
    const shapes = document.querySelectorAll('[data-morph]');
    
    shapes.forEach(shape => {
      const svg = shape.querySelector('svg');
      if (svg) {
        const path = svg.querySelector('path');
        if (path) {
          this.animateMorphingPath(path);
        }
      }
    });
  }

  animateMorphingPath(path) {
    const originalPath = path.getAttribute('d');
    const morphPaths = [
      originalPath,
      'M50,50 Q100,0 150,50 Q200,100 150,150 Q100,200 50,150 Q0,100 50,50 Z',
      'M50,50 L150,50 L150,150 L50,150 Z'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
      currentIndex = (currentIndex + 1) % morphPaths.length;
      path.style.transition = 'd 2s ease-in-out';
      path.setAttribute('d', morphPaths[currentIndex]);
    }, 3000);
  }

  setupFloatingElements() {
    const floatingElements = document.querySelectorAll('[data-float]');
    
    floatingElements.forEach(element => {
      const speed = parseFloat(element.dataset.float) || 1;
      const amplitude = 20;
      
      let time = 0;
      
      const animate = () => {
        time += 0.01 * speed;
        const y = Math.sin(time) * amplitude;
        element.style.transform = `translateY(${y}px)`;
        requestAnimationFrame(animate);
      };
      
      animate();
    });
  }

  setupGradientAnimations() {
    const gradientElements = document.querySelectorAll('[data-gradient-animate]');
    
    gradientElements.forEach(element => {
      let hue = 0;
      
      const animate = () => {
        hue = (hue + 1) % 360;
        element.style.background = `linear-gradient(45deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 50%))`;
        requestAnimationFrame(animate);
      };
      
      animate();
    });
  }
}

// Initialize visual effects when DOM is loaded
let cansVisualEffects;
document.addEventListener('DOMContentLoaded', () => {
  cansVisualEffects = new CANSVisualEffects();
});

// Export for global access
window.cansVisualEffects = cansVisualEffects;
