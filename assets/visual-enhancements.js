// Visual Enhancements - 3D Effects, Parallax, Animations
class VisualEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.addParallaxScrolling();
    this.add3DEffects();
    this.addGradientAnimations();
    this.addMorphingShapes();
    this.addGlowingEffects();
    this.addTextEffects();
  }

  addParallaxScrolling() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  add3DEffects() {
    const cards3D = document.querySelectorAll('.card-3d');
    
    cards3D.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  addGradientAnimations() {
    const gradientElements = document.querySelectorAll('.text-gradient');
    
    gradientElements.forEach(element => {
      element.style.background = 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)';
      element.style.backgroundSize = '300% 300%';
      element.style.webkitBackgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.animation = 'gradientShift 3s ease infinite';
    });
  }

  addMorphingShapes() {
    const shapes = document.querySelectorAll('[data-morph]');
    
    shapes.forEach(shape => {
      setInterval(() => {
        const randomShape = Math.random() > 0.5 ? 'circle' : 'square';
        shape.style.borderRadius = randomShape === 'circle' ? '50%' : '20%';
        shape.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.4})`;
      }, 3000);
    });
  }

  addGlowingEffects() {
    const glowElements = document.querySelectorAll('.glow');
    
    glowElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.boxShadow = '0 0 30px rgba(0, 74, 173, 0.6), 0 0 60px rgba(0, 74, 173, 0.4)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.boxShadow = '';
      });
    });
  }

  addTextEffects() {
    const textElements = document.querySelectorAll('h1, h2, h3');
    
    textElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.textShadow = '0 0 20px rgba(0, 74, 173, 0.8)';
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'all 0.3s ease';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.textShadow = '';
        element.style.transform = 'scale(1)';
      });
    });
  }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .floating {
    animation: float 3s ease-in-out infinite;
  }
  
  .pulsing {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .rotating {
    animation: rotate 10s linear infinite;
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VisualEnhancements();
});
