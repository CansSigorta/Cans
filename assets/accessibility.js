// CANS Sigorta Accessibility & Technical Improvements
class CANSAccessibility {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
    this.setupLoadingStates();
    this.setupMicroInteractions();
    this.setupErrorHandling();
    this.setupPerformanceOptimizations();
  }

  // Keyboard Navigation
  setupKeyboardNavigation() {
    this.setupTabNavigation();
    this.setupKeyboardShortcuts();
    this.setupEscapeKeyHandling();
  }

  setupTabNavigation() {
    // Ensure all interactive elements are focusable
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });

    // Handle focus styling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + M: Open main menu
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        this.openMainMenu();
      }

      // Alt + C: Open chatbot
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        if (window.cansBot) {
          window.cansBot.toggle();
        }
      }

      // Alt + H: Go to home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = '/';
      }

      // Alt + S: Open search
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        this.openSearch();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  setupEscapeKeyHandling() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal:not([style*="display: none"])');
        if (openModals.length > 0) {
          openModals[openModals.length - 1].remove();
        }
      }
    });
  }

  // Screen Reader Support
  setupScreenReaderSupport() {
    this.addAriaLabels();
    this.setupLiveRegions();
    this.setupDescriptiveText();
  }

  addAriaLabels() {
    // Add aria-labels to buttons without text
    const iconButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    iconButtons.forEach(button => {
      const icon = button.querySelector('i, svg, img');
      if (icon) {
        const label = this.generateAriaLabel(button);
        button.setAttribute('aria-label', label);
      }
    });

    // Add aria-labels to form inputs
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', label.id || input.id + '-label');
      } else if (input.placeholder) {
        input.setAttribute('aria-label', input.placeholder);
      }
    });
  }

  generateAriaLabel(button) {
    const text = button.textContent.trim();
    if (text) return text;

    const icon = button.querySelector('i, svg, img');
    if (icon) {
      const iconClass = icon.className;
      if (iconClass.includes('menu')) return 'Menüyü aç';
      if (iconClass.includes('close')) return 'Kapat';
      if (iconClass.includes('search')) return 'Ara';
      if (iconClass.includes('phone')) return 'Telefon';
      if (iconClass.includes('whatsapp')) return 'WhatsApp';
    }

    return 'Buton';
  }

  setupLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  setupDescriptiveText() {
    // Add descriptive text for complex interactions
    const complexElements = document.querySelectorAll('[data-complex]');
    complexElements.forEach(element => {
      const description = element.getAttribute('data-description');
      if (description) {
        element.setAttribute('aria-describedby', element.id + '-description');
        
        const descElement = document.createElement('div');
        descElement.id = element.id + '-description';
        descElement.className = 'sr-only';
        descElement.textContent = description;
        element.parentNode.insertBefore(descElement, element.nextSibling);
      }
    });
  }

  // Focus Management
  setupFocusManagement() {
    this.setupFocusTrapping();
    this.setupFocusIndicators();
    this.setupSkipLinks();
  }

  setupFocusTrapping() {
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal:not([style*="display: none"])');
        if (modal) {
          this.trapFocusInModal(modal, e);
        }
      }
    });
  }

  trapFocusInModal(modal, event) {
    const focusableElements = modal.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  }

  setupFocusIndicators() {
    // Enhanced focus indicators
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 3px solid #004AAD !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 3px rgba(0, 74, 173, 0.3) !important;
      }
      
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Ana içeriğe geç';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #004AAD;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Loading States
  setupLoadingStates() {
    this.setupPageLoading();
    this.setupFormLoading();
    this.setupImageLoading();
  }

  setupPageLoading() {
    // Show loading state while page loads
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'page-loading';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Sayfa yükleniyor...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);

    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
          loadingOverlay.remove();
        }, 300);
      }, 500);
    });
  }

  setupFormLoading() {
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="loading-spinner-small"></span> Gönderiliyor...';
        }
      });
    });
  }

  setupImageLoading() {
    // Add loading states to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.style.opacity = '0';
        img.addEventListener('load', () => {
          img.style.transition = 'opacity 0.3s ease';
          img.style.opacity = '1';
        });
      }
    });
  }

  // Micro-interactions
  setupMicroInteractions() {
    this.setupButtonInteractions();
    this.setupHoverEffects();
    this.setupClickFeedback();
    this.setupScrollEffects();
  }

  setupButtonInteractions() {
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
      });
      
      button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
      });
    });
  }

  setupHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      });
    });
  }

  setupClickFeedback() {
    document.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        left: ${e.clientX - 10}px;
        top: ${e.clientY - 10}px;
        width: 20px;
        height: 20px;
        z-index: 1000;
      `;
      
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  setupScrollEffects() {
    let ticking = false;
    
    const updateScrollEffects = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    });
  }

  // Error Handling
  setupErrorHandling() {
    this.setupGlobalErrorHandler();
    this.setupNetworkErrorHandling();
    this.setupFormErrorHandling();
  }

  setupGlobalErrorHandler() {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      this.showErrorNotification('Bir hata oluştu. Lütfen sayfayı yenileyin.');
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.showErrorNotification('Bir hata oluştu. Lütfen tekrar deneyin.');
    });
  }

  setupNetworkErrorHandling() {
    window.addEventListener('online', () => {
      this.showNotification('İnternet bağlantısı geri geldi.', 'success');
    });

    window.addEventListener('offline', () => {
      this.showNotification('İnternet bağlantısı kesildi. Offline modda çalışıyorsunuz.', 'warning');
    });
  }

  setupFormErrorHandling() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        try {
          // Simulate form submission
          await this.submitForm(form);
        } catch (error) {
          e.preventDefault();
          this.showFormError(form, error.message);
        }
      });
    });
  }

  async submitForm(form) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Form gönderilirken bir hata oluştu.'));
        }
      }, 2000);
    });
  }

  // Performance Optimizations
  setupPerformanceOptimizations() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupResourcePreloading();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  setupImageOptimization() {
    // Add WebP support detection
    const supportsWebP = this.checkWebPSupport();
    
    if (supportsWebP) {
      const images = document.querySelectorAll('img[data-webp]');
      images.forEach(img => {
        img.src = img.dataset.webp;
      });
    }
  }

  checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  setupResourcePreloading() {
    // Preload critical resources
    const criticalResources = [
      '/assets/style.css',
      '/assets/animations.js',
      '/assets/chatbot.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  // Utility Functions
  openMainMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.click();
    }
  }

  openSearch() {
    // Create search modal
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Arama</h3>
          <button class="modal-close" onclick="this.closest('.search-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <input type="text" placeholder="Aramak istediğiniz kelimeyi yazın..." class="search-input" autofocus>
          <div class="search-results"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(searchModal);
    
    const searchInput = searchModal.querySelector('.search-input');
    searchInput.focus();
  }

  closeAllModals() {
    const modals = document.querySelectorAll('.modal, .search-modal');
    modals.forEach(modal => modal.remove());
  }

  showErrorNotification(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `accessibility-notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Announce to screen readers
    this.announceToScreenReader(message);
  }

  showFormError(form, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

// Initialize accessibility when DOM is loaded
let cansAccessibility;
document.addEventListener('DOMContentLoaded', () => {
  cansAccessibility = new CANSAccessibility();
});

// Export for global access
window.cansAccessibility = cansAccessibility;

// Add CSS for accessibility features
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    transition: opacity 0.3s ease;
  }
  
  .loading-spinner {
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #004AAD;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  .loading-spinner-small {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #004AAD;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .accessibility-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 1rem 1.5rem;
    box-shadow: var(--shadow-xl);
    z-index: 1011;
    max-width: 400px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  }
  
  .accessibility-notification.show {
    opacity: 1;
    transform: translateX(0);
  }
  
  .accessibility-notification.error {
    border-left: 4px solid #ef4444;
    background: #fef2f2;
  }
  
  .accessibility-notification.success {
    border-left: 4px solid #10b981;
    background: #f0fdf4;
  }
  
  .accessibility-notification.warning {
    border-left: 4px solid #f59e0b;
    background: #fffbeb;
  }
  
  .form-error {
    background: #fef2f2;
    color: #dc2626;
    padding: 1rem;
    border-radius: var(--radius);
    margin-bottom: 1rem;
    border: 1px solid #fecaca;
  }
  
  .search-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1009;
    padding: 1rem;
  }
  
  .search-input {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius);
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 74, 173, 0.1);
  }
`;
document.head.appendChild(accessibilityStyles);
