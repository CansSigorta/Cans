// CANS Sigorta Advanced Analytics - Heatmap, A/B Testing, Conversion Tracking
class CANSAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.events = [];
    this.heatmapData = [];
    this.abTests = {};
    this.conversionGoals = {};
    this.init();
  }

  init() {
    this.setupHeatmapTracking();
    this.setupABTesting();
    this.setupConversionTracking();
    this.setupUserBehaviorTracking();
    this.setupPerformanceMonitoring();
    this.startSession();
  }

  // Session Management
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserId() {
    let userId = localStorage.getItem('cans-user-id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cans-user-id', userId);
    }
    return userId;
  }

  startSession() {
    this.trackEvent('session_start', {
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      page: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  }

  // Heatmap Tracking
  setupHeatmapTracking() {
    this.trackMouseMovements();
    this.trackClicks();
    this.trackScrollDepth();
    this.trackElementVisibility();
  }

  trackMouseMovements() {
    let mousePositions = [];
    let lastSendTime = Date.now();

    document.addEventListener('mousemove', (e) => {
      mousePositions.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      // Send data every 5 seconds
      if (Date.now() - lastSendTime > 5000) {
        this.sendHeatmapData('mouse_movement', mousePositions);
        mousePositions = [];
        lastSendTime = Date.now();
      }
    });
  }

  trackClicks() {
    document.addEventListener('click', (e) => {
      const element = e.target;
      const rect = element.getBoundingClientRect();
      
      this.trackEvent('click', {
        element: this.getElementSelector(element),
        x: e.clientX,
        y: e.clientY,
        element_x: rect.left,
        element_y: rect.top,
        element_width: rect.width,
        element_height: rect.height,
        page: window.location.pathname,
        timestamp: Date.now()
      });

      // Add visual feedback
      this.showClickFeedback(e.clientX, e.clientY);
    });
  }

  trackScrollDepth() {
    let maxScrollDepth = 0;
    let scrollMilestones = [25, 50, 75, 90, 100];
    let reachedMilestones = new Set();

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
      }

      // Track milestone achievements
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
          reachedMilestones.add(milestone);
          this.trackEvent('scroll_milestone', {
            milestone: milestone,
            page: window.location.pathname,
            timestamp: Date.now()
          });
        }
      });
    });

    // Track final scroll depth on page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('scroll_depth_final', {
        max_depth: maxScrollDepth,
        page: window.location.pathname,
        timestamp: Date.now()
      });
    });
  }

  trackElementVisibility() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.trackEvent('element_view', {
            element: this.getElementSelector(entry.target),
            visibility_ratio: entry.intersectionRatio,
            page: window.location.pathname,
            timestamp: Date.now()
          });
        }
      });
    }, { threshold: [0.1, 0.5, 1.0] });

    // Observe important elements
    const importantElements = document.querySelectorAll('h1, h2, .card, .btn, .hero-banner');
    importantElements.forEach(el => observer.observe(el));
  }

  // A/B Testing
  setupABTesting() {
    this.initializeABTests();
    this.applyABTestVariants();
    this.trackABTestInteractions();
  }

  initializeABTests() {
    this.abTests = {
      'hero_cta_button': {
        variants: ['primary', 'secondary', 'gradient'],
        currentVariant: this.getABTestVariant('hero_cta_button'),
        goal: 'cta_click'
      },
      'pricing_display': {
        variants: ['cards', 'table', 'comparison'],
        currentVariant: this.getABTestVariant('pricing_display'),
        goal: 'quote_request'
      },
      'testimonial_placement': {
        variants: ['top', 'middle', 'bottom'],
        currentVariant: this.getABTestVariant('testimonial_placement'),
        goal: 'contact_form_submit'
      }
    };
  }

  getABTestVariant(testName) {
    const savedVariant = localStorage.getItem(`ab_test_${testName}`);
    if (savedVariant) {
      return savedVariant;
    }

    const test = this.abTests[testName];
    if (!test) return null;

    const randomIndex = Math.floor(Math.random() * test.variants.length);
    const variant = test.variants[randomIndex];
    
    localStorage.setItem(`ab_test_${testName}`, variant);
    return variant;
  }

  applyABTestVariants() {
    Object.keys(this.abTests).forEach(testName => {
      const test = this.abTests[testName];
      const variant = test.currentVariant;
      
      if (variant) {
        this.applyVariant(testName, variant);
        this.trackEvent('ab_test_view', {
          test_name: testName,
          variant: variant,
          page: window.location.pathname,
          timestamp: Date.now()
        });
      }
    });
  }

  applyVariant(testName, variant) {
    switch(testName) {
      case 'hero_cta_button':
        this.applyHeroCTAButtonVariant(variant);
        break;
      case 'pricing_display':
        this.applyPricingDisplayVariant(variant);
        break;
      case 'testimonial_placement':
        this.applyTestimonialPlacementVariant(variant);
        break;
    }
  }

  applyHeroCTAButtonVariant(variant) {
    const ctaButtons = document.querySelectorAll('.hero-banner .btn');
    ctaButtons.forEach(btn => {
      btn.classList.remove('btn-primary', 'btn-secondary', 'btn-gradient');
      
      switch(variant) {
        case 'primary':
          btn.classList.add('btn-primary');
          break;
        case 'secondary':
          btn.classList.add('btn-secondary');
          break;
        case 'gradient':
          btn.classList.add('btn-gradient');
          break;
      }
    });
  }

  applyPricingDisplayVariant(variant) {
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
      pricingSection.className = `pricing-section variant-${variant}`;
    }
  }

  applyTestimonialPlacementVariant(variant) {
    const testimonials = document.querySelector('.testimonials');
    if (testimonials) {
      testimonials.className = `testimonials variant-${variant}`;
    }
  }

  trackABTestInteractions() {
    document.addEventListener('click', (e) => {
      const element = e.target;
      const testName = this.getABTestFromElement(element);
      
      if (testName) {
        const test = this.abTests[testName];
        this.trackEvent('ab_test_interaction', {
          test_name: testName,
          variant: test.currentVariant,
          element: this.getElementSelector(element),
          page: window.location.pathname,
          timestamp: Date.now()
        });
      }
    });
  }

  getABTestFromElement(element) {
    // Check if element is part of an A/B test
    if (element.closest('.hero-banner .btn')) return 'hero_cta_button';
    if (element.closest('.pricing-section')) return 'pricing_display';
    if (element.closest('.testimonials')) return 'testimonial_placement';
    return null;
  }

  // Conversion Tracking
  setupConversionTracking() {
    this.defineConversionGoals();
    this.trackConversionEvents();
    this.setupFunnelTracking();
  }

  defineConversionGoals() {
    this.conversionGoals = {
      'page_view': { value: 1, type: 'page_view' },
      'cta_click': { value: 5, type: 'engagement' },
      'form_start': { value: 10, type: 'lead' },
      'form_submit': { value: 25, type: 'lead' },
      'quote_request': { value: 50, type: 'conversion' },
      'contact_form_submit': { value: 75, type: 'conversion' },
      'whatsapp_click': { value: 100, type: 'conversion' },
      'phone_click': { value: 100, type: 'conversion' }
    };
  }

  trackConversionEvents() {
    // Track CTA clicks
    document.addEventListener('click', (e) => {
      const element = e.target;
      
      if (element.classList.contains('btn-primary') || element.classList.contains('btn-secondary')) {
        this.trackConversion('cta_click', {
          button_text: element.textContent.trim(),
          button_class: element.className,
          page: window.location.pathname
        });
      }
    });

    // Track form interactions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      this.trackConversion('form_submit', {
        form_id: form.id || 'unknown',
        form_action: form.action,
        page: window.location.pathname
      });
    });

    // Track WhatsApp clicks
    document.addEventListener('click', (e) => {
      const element = e.target;
      if (element.href && element.href.includes('wa.me')) {
        this.trackConversion('whatsapp_click', {
          page: window.location.pathname,
          link_text: element.textContent.trim()
        });
      }
    });

    // Track phone clicks
    document.addEventListener('click', (e) => {
      const element = e.target;
      if (element.href && element.href.startsWith('tel:')) {
        this.trackConversion('phone_click', {
          page: window.location.pathname,
          phone_number: element.href.replace('tel:', '')
        });
      }
    });
  }

  setupFunnelTracking() {
    this.funnelSteps = [
      { name: 'landing', page: '/', goal: 'page_view' },
      { name: 'interest', page: '/bes.html', goal: 'cta_click' },
      { name: 'consideration', page: '/trafik.html', goal: 'form_start' },
      { name: 'conversion', page: '/iletisim.html', goal: 'form_submit' }
    ];

    this.trackFunnelProgress();
  }

  trackFunnelProgress() {
    const currentPage = window.location.pathname;
    const currentStep = this.funnelSteps.find(step => step.page === currentPage);
    
    if (currentStep) {
      this.trackEvent('funnel_step', {
        step_name: currentStep.name,
        step_goal: currentStep.goal,
        page: currentPage,
        timestamp: Date.now()
      });
    }
  }

  // User Behavior Tracking
  setupUserBehaviorTracking() {
    this.trackTimeOnPage();
    this.trackPageNavigation();
    this.trackUserEngagement();
    this.trackDeviceInfo();
  }

  trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackEvent('time_on_page', {
        duration: timeOnPage,
        page: window.location.pathname,
        timestamp: Date.now()
      });
    });
  }

  trackPageNavigation() {
    let navigationHistory = JSON.parse(localStorage.getItem('cans-navigation-history') || '[]');
    
    navigationHistory.push({
      page: window.location.pathname,
      timestamp: Date.now(),
      referrer: document.referrer
    });

    // Keep only last 10 pages
    if (navigationHistory.length > 10) {
      navigationHistory = navigationHistory.slice(-10);
    }

    localStorage.setItem('cans-navigation-history', JSON.stringify(navigationHistory));
  }

  trackUserEngagement() {
    let engagementScore = 0;
    let lastActivity = Date.now();

    // Track various engagement activities
    const activities = ['click', 'scroll', 'keypress', 'mousemove'];
    
    activities.forEach(activity => {
      document.addEventListener(activity, () => {
        engagementScore += 1;
        lastActivity = Date.now();
      });
    });

    // Send engagement data every 30 seconds
    setInterval(() => {
      if (Date.now() - lastActivity < 30000) { // Active in last 30 seconds
        this.trackEvent('user_engagement', {
          engagement_score: engagementScore,
          page: window.location.pathname,
          timestamp: Date.now()
        });
      }
    }, 30000);
  }

  trackDeviceInfo() {
    const deviceInfo = {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookie_enabled: navigator.cookieEnabled,
      online_status: navigator.onLine
    };

    this.trackEvent('device_info', deviceInfo);
  }

  // Performance Monitoring
  setupPerformanceMonitoring() {
    this.trackPageLoadTime();
    this.trackResourceTiming();
    this.trackCoreWebVitals();
  }

  trackPageLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      this.trackEvent('page_load_time', {
        load_time: loadTime,
        page: window.location.pathname,
        timestamp: Date.now()
      });
    });
  }

  trackResourceTiming() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      
      resources.forEach(resource => {
        this.trackEvent('resource_timing', {
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize,
          type: resource.initiatorType,
          page: window.location.pathname,
          timestamp: Date.now()
        });
      });
    });
  }

  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.trackEvent('core_web_vital', {
        metric: 'LCP',
        value: lastEntry.startTime,
        page: window.location.pathname,
        timestamp: Date.now()
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.trackEvent('core_web_vital', {
          metric: 'FID',
          value: entry.processingStart - entry.startTime,
          page: window.location.pathname,
          timestamp: Date.now()
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.trackEvent('core_web_vital', {
        metric: 'CLS',
        value: clsValue,
        page: window.location.pathname,
        timestamp: Date.now()
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Utility Functions
  trackEvent(eventName, data) {
    const event = {
      event_name: eventName,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      page: window.location.pathname,
      ...data
    };

    this.events.push(event);
    
    // Send to analytics service
    this.sendAnalyticsData(event);
    
    // Also send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CANS_Analytics',
        event_label: data.element || data.page,
        value: data.value || 1,
        custom_parameters: data
      });
    }
  }

  trackConversion(goalName, data) {
    const goal = this.conversionGoals[goalName];
    if (!goal) return;

    this.trackEvent('conversion', {
      goal_name: goalName,
      goal_value: goal.value,
      goal_type: goal.type,
      ...data
    });
  }

  sendAnalyticsData(data) {
    // In a real implementation, this would send to your analytics backend
    console.log('Analytics Event:', data);
    
    // Store locally for debugging
    const storedEvents = JSON.parse(localStorage.getItem('cans-analytics-events') || '[]');
    storedEvents.push(data);
    
    // Keep only last 100 events
    if (storedEvents.length > 100) {
      storedEvents.splice(0, storedEvents.length - 100);
    }
    
    localStorage.setItem('cans-analytics-events', JSON.stringify(storedEvents));
  }

  sendHeatmapData(type, data) {
    this.heatmapData.push({
      type: type,
      data: data,
      page: window.location.pathname,
      timestamp: Date.now()
    });
  }

  getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  showClickFeedback(x, y) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      background: rgba(0, 74, 173, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      animation: clickFeedback 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 600);
  }

  // Analytics Dashboard (for debugging)
  getAnalyticsSummary() {
    const events = JSON.parse(localStorage.getItem('cans-analytics-events') || '[]');
    
    return {
      total_events: events.length,
      unique_pages: [...new Set(events.map(e => e.page))].length,
      conversion_events: events.filter(e => e.event_name === 'conversion').length,
      ab_test_events: events.filter(e => e.event_name === 'ab_test_view').length,
      session_duration: this.calculateSessionDuration(events)
    };
  }

  calculateSessionDuration(events) {
    if (events.length < 2) return 0;
    
    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    
    return lastEvent.timestamp - firstEvent.timestamp;
  }
}

// Initialize analytics when DOM is loaded
let cansAnalytics;
document.addEventListener('DOMContentLoaded', () => {
  cansAnalytics = new CANSAnalytics();
});

// Export for global access
window.cansAnalytics = cansAnalytics;

// Add click feedback animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes clickFeedback {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
