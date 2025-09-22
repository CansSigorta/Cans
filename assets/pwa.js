// CANS Sigorta PWA (Progressive Web App) Manager
class CANS_PWA {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOfflineHandling();
    this.setupPushNotifications();
    this.checkInstallStatus();
  }

  // Service Worker Registration
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('PWA: Service Worker registered successfully', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
        
      } catch (error) {
        console.error('PWA: Service Worker registration failed', error);
      }
    }
  }

  // Install Prompt Setup
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt triggered');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed successfully');
      this.isInstalled = true;
      this.hideInstallButton();
      this.trackEvent('pwa_installed');
    });
  }

  // Show Install Button
  showInstallButton() {
    if (this.isInstalled) return;

    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-btn';
    installButton.className = 'pwa-install-btn';
    installButton.innerHTML = `
      <span class="pwa-install-icon">📱</span>
      <span class="pwa-install-text">Uygulamayı Yükle</span>
    `;
    
    installButton.addEventListener('click', () => {
      this.installApp();
    });

    // Add to page
    document.body.appendChild(installButton);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideInstallButton();
    }, 10000);
  }

  // Hide Install Button
  hideInstallButton() {
    const installButton = document.getElementById('pwa-install-btn');
    if (installButton) {
      installButton.remove();
    }
  }

  // Install App
  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    console.log('PWA: Install prompt outcome', outcome);
    this.trackEvent('pwa_install_prompt', { outcome });
    
    this.deferredPrompt = null;
    this.hideInstallButton();
  }

  // Check Install Status
  checkInstallStatus() {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('PWA: Running as installed app');
    }
  }

  // Offline Handling
  setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineBanner();
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineBanner();
    });

    // Initial check
    if (!this.isOnline) {
      this.showOfflineBanner();
    }
  }

  // Show Offline Banner
  showOfflineBanner() {
    const existingBanner = document.getElementById('offline-banner');
    if (existingBanner) return;

    const banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.className = 'offline-banner';
    banner.innerHTML = `
      <div class="offline-content">
        <span class="offline-icon">📡</span>
        <span class="offline-text">İnternet bağlantısı yok. Offline modda çalışıyorsunuz.</span>
        <button class="offline-retry" onclick="cansPWA.retryConnection()">Tekrar Dene</button>
      </div>
    `;

    document.body.appendChild(banner);
  }

  // Hide Offline Banner
  hideOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) {
      banner.remove();
    }
  }

  // Retry Connection
  retryConnection() {
    if (navigator.onLine) {
      this.hideOfflineBanner();
      window.location.reload();
    } else {
      // Show error message
      const retryBtn = document.querySelector('.offline-retry');
      if (retryBtn) {
        retryBtn.textContent = 'Bağlantı Yok';
        retryBtn.disabled = true;
        setTimeout(() => {
          retryBtn.textContent = 'Tekrar Dene';
          retryBtn.disabled = false;
        }, 2000);
      }
    }
  }

  // Sync Offline Data
  async syncOfflineData() {
    try {
      // Send any pending form submissions
      const pendingData = await this.getOfflineData();
      if (pendingData.length > 0) {
        console.log('PWA: Syncing offline data', pendingData.length, 'items');
        // Implementation would depend on your backend
      }
    } catch (error) {
      console.error('PWA: Failed to sync offline data', error);
    }
  }

  // Push Notifications
  async setupPushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('PWA: Push notifications enabled');
        this.trackEvent('push_notifications_enabled');
      }
    }
  }

  // Send Push Notification
  async sendNotification(title, body, icon = '/assets/icon-192x192.svg') {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon,
        badge: '/assets/icon-72x72.svg',
        tag: 'cans-sigorta',
        requireInteraction: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  }

  // Offline Data Storage
  async storeOfflineData(key, data) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      await store.put({ key, data, timestamp: Date.now() });
    } catch (error) {
      console.error('PWA: Failed to store offline data', error);
    }
  }

  async getOfflineData() {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      return await store.getAll();
    } catch (error) {
      console.error('PWA: Failed to get offline data', error);
      return [];
    }
  }

  // IndexedDB Helper
  openIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CANS_Sigorta_PWA', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'key' });
        }
      };
    });
  }

  // Update Notification
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <span class="update-icon">🔄</span>
        <span class="update-text">Yeni güncelleme mevcut!</span>
        <button class="update-btn" onclick="cansPWA.updateApp()">Güncelle</button>
        <button class="update-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    document.body.appendChild(notification);
  }

  // Update App
  async updateApp() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  // Analytics Tracking
  trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'PWA',
        ...parameters
      });
    }
  }

  // Share API
  async shareContent(title, text, url) {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        this.trackEvent('content_shared', { method: 'native' });
      } catch (error) {
        console.log('PWA: Share cancelled or failed', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        this.showToast('Link panoya kopyalandı!');
        this.trackEvent('content_shared', { method: 'clipboard' });
      } catch (error) {
        console.error('PWA: Failed to copy to clipboard', error);
      }
    }
  }

  // Toast Notification
  showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'pwa-toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

// Initialize PWA when DOM is loaded
let cansPWA;
document.addEventListener('DOMContentLoaded', () => {
  cansPWA = new CANS_PWA();
});

// Export for global access
window.cansPWA = cansPWA;
