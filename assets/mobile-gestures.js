// Mobile Gestures and Touch Interactions
class MobileGestures {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.isMobile = window.innerWidth <= 768;
    
    this.init();
  }

  init() {
    if (this.isMobile) {
      this.addSwipeNavigation();
      this.addTouchGestures();
      this.addMobileOptimizations();
    }
  }

  addSwipeNavigation() {
    // Swipe between sections
    document.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
      if (deltaX > 0) {
        this.swipeRight();
      } else {
        this.swipeLeft();
      }
    }
    
    // Vertical swipe
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > this.minSwipeDistance) {
      if (deltaY > 0) {
        this.swipeDown();
      } else {
        this.swipeUp();
      }
    }
  }

  swipeLeft() {
    // Navigate to next section
    const currentSection = this.getCurrentSection();
    const nextSection = currentSection.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  swipeRight() {
    // Navigate to previous section
    const currentSection = this.getCurrentSection();
    const prevSection = currentSection.previousElementSibling;
    if (prevSection) {
      prevSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  swipeUp() {
    // Scroll up
    window.scrollBy(0, -window.innerHeight);
  }

  swipeDown() {
    // Scroll down
    window.scrollBy(0, window.innerHeight);
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('section');
    let currentSection = sections[0];
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        currentSection = section;
      }
    });
    
    return currentSection;
  }

  addTouchGestures() {
    // Double tap to zoom
    let lastTap = 0;
    document.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
        this.handleDoubleTap(e);
      }
      lastTap = currentTime;
    });

    // Long press for context menu
    let pressTimer;
    document.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        this.handleLongPress(e);
      }, 500);
    });

    document.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    });

    document.addEventListener('touchmove', () => {
      clearTimeout(pressTimer);
    });
  }

  handleDoubleTap(e) {
    // Toggle mobile menu or zoom
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('open');
    }
  }

  handleLongPress(e) {
    // Show context menu or haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  addMobileOptimizations() {
    // Add mobile-specific classes
    document.body.classList.add('mobile-optimized');
    
    // Optimize touch targets
    this.optimizeTouchTargets();
    
    // Add pull-to-refresh
    this.addPullToRefresh();
    
    // Optimize scrolling
    this.optimizeScrolling();
  }

  optimizeTouchTargets() {
    const buttons = document.querySelectorAll('button, .btn, a');
    buttons.forEach(button => {
      if (button.offsetHeight < 44) {
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
      }
    });
  }

  addPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isRefreshing = false;
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (window.scrollY === 0 && !isRefreshing) {
        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
          e.preventDefault();
          this.showPullToRefresh(pullDistance);
        }
      }
    });

    document.addEventListener('touchend', () => {
      if (currentY - startY > 100 && !isRefreshing) {
        this.refreshPage();
      } else {
        this.hidePullToRefresh();
      }
    });
  }

  showPullToRefresh(distance) {
    const refreshIndicator = document.getElementById('pull-to-refresh') || this.createRefreshIndicator();
    const progress = Math.min(distance / 100, 1);
    refreshIndicator.style.transform = `translateY(${distance}px)`;
    refreshIndicator.style.opacity = progress;
  }

  hidePullToRefresh() {
    const refreshIndicator = document.getElementById('pull-to-refresh');
    if (refreshIndicator) {
      refreshIndicator.style.transform = 'translateY(-100px)';
      refreshIndicator.style.opacity = '0';
    }
  }

  createRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'pull-to-refresh';
    indicator.innerHTML = '🔄 Yenilemek için çekin';
    indicator.style.cssText = `
      position: fixed;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary);
      color: white;
      padding: 1rem 2rem;
      border-radius: 0 0 1rem 1rem;
      font-weight: 600;
      z-index: 1000;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(indicator);
    return indicator;
  }

  refreshPage() {
    const refreshIndicator = document.getElementById('pull-to-refresh');
    if (refreshIndicator) {
      refreshIndicator.innerHTML = '🔄 Yenileniyor...';
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  optimizeScrolling() {
    // Smooth scrolling for mobile
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (input.style.fontSize !== '16px') {
          input.style.fontSize = '16px';
        }
      });
    });
  }
}

// Initialize mobile gestures when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileGestures();
});

// Re-initialize on resize
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    new MobileGestures();
  }
});
