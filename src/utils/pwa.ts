/**
 * Progressive Web App (PWA) utilities and service worker management
 * Provides enhanced offline capabilities and installation prompts
 */

import { errorTracker } from './errorTracking';

export interface PWAInstallEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

/**
 * PWA Service Worker Manager
 */
export class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isOnline = navigator.onLine;
  private updateAvailable = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initializePWA();
    this.setupEventListeners();
  }

  /**
   * Initialize PWA features
   */
  private async initializePWA(): Promise<void> {
    try {
      // Register service worker
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        this.registration.addEventListener('updatefound', () => {
          this.handleServiceWorkerUpdate();
        });

        // Check for existing service worker
        if (navigator.serviceWorker.controller) {
          console.log('✅ Service Worker is controlling the page');
        }
      }

      // Check if app is already installed
      this.checkInstallationStatus();

      // Setup update checking
      this.setupUpdateChecking();

    } catch (error) {
      errorTracker.logError(error as Error, {
        context: 'PWA initialization',
        category: 'PWA'
      });
    }
  }

  /**
   * Setup event listeners for PWA events
   */
  private setupEventListeners(): void {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    // Listen for app install
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallBanner();
      this.trackEvent('app_installed');
    });

    // Listen for online/offline changes
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showConnectionStatus('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showConnectionStatus('offline');
    });

    // Listen for visibility changes to check for updates
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.registration) {
        this.checkForUpdates();
      }
    });
  }

  /**
   * Handle service worker updates
   */
  private handleServiceWorkerUpdate(): void {
    const newWorker = this.registration?.installing;
    
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.updateAvailable = true;
          this.showUpdateBanner();
        }
      });
    }
  }

  /**
   * Check if app is installed
   */
  private checkInstallationStatus(): void {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // Check if installed via navigator
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((apps: any[]) => {
        this.isInstalled = apps.length > 0;
      });
    }
  }

  /**
   * Setup periodic update checking
   */
  private setupUpdateChecking(): void {
    // Check for updates every 30 minutes
    setInterval(() => {
      if (this.isOnline && this.registration) {
        this.checkForUpdates();
      }
    }, 30 * 60 * 1000);
  }

  /**
   * Check for service worker updates
   */
  private async checkForUpdates(): Promise<void> {
    try {
      if (this.registration) {
        await this.registration.update();
      }
    } catch (error) {
      errorTracker.logError(error as Error, {
        context: 'Update check',
        category: 'PWA'
      });
    }
  }

  /**
   * Show install banner
   */
  private showInstallBanner(): void {
    if (this.isInstalled) return;

    const banner = this.createInstallBanner();
    document.body.appendChild(banner);
    
    // Animate in
    requestAnimationFrame(() => {
      banner.classList.add('show');
    });

    this.trackEvent('install_prompt_shown');
  }

  /**
   * Create install banner element
   */
  private createInstallBanner(): HTMLElement {
    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">📱</div>
        <div class="banner-text">
          <h3>Install Digital Workbench</h3>
          <p>Get the full experience with offline access and faster loading</p>
        </div>
        <div class="banner-actions">
          <button class="install-btn" data-action="install">Install</button>
          <button class="dismiss-btn" data-action="dismiss">Later</button>
        </div>
      </div>
    `;

    // Add event listeners
    banner.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const action = target.dataset['action'];

      if (action === 'install') {
        this.promptInstall();
      } else if (action === 'dismiss') {
        this.hideInstallBanner();
      }
    });

    return banner;
  }

  /**
   * Hide install banner
   */
  private hideInstallBanner(): void {
    const banner = document.querySelector('.pwa-install-banner');
    if (banner) {
      banner.classList.add('hide');
      setTimeout(() => banner.remove(), 300);
    }
  }

  /**
   * Show update banner
   */
  private showUpdateBanner(): void {
    const banner = this.createUpdateBanner();
    document.body.appendChild(banner);
    
    requestAnimationFrame(() => {
      banner.classList.add('show');
    });

    this.trackEvent('update_available_shown');
  }

  /**
   * Create update banner element
   */
  private createUpdateBanner(): HTMLElement {
    const banner = document.createElement('div');
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">🔄</div>
        <div class="banner-text">
          <h3>Update Available</h3>
          <p>A new version is ready. Refresh to get the latest features.</p>
        </div>
        <div class="banner-actions">
          <button class="update-btn" data-action="update">Update</button>
          <button class="dismiss-btn" data-action="dismiss">Later</button>
        </div>
      </div>
    `;

    banner.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const action = target.dataset['action'];

      if (action === 'update') {
        this.applyUpdate();
      } else if (action === 'dismiss') {
        banner.remove();
      }
    });

    return banner;
  }

  /**
   * Show connection status
   */
  private showConnectionStatus(status: 'online' | 'offline'): void {
    const existingToast = document.querySelector('.connection-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `connection-toast ${status}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${status === 'online' ? '🟢' : '🔴'}</span>
        <span class="toast-text">
          ${status === 'online' ? 'Back online' : 'You\'re offline'}
        </span>
      </div>
    `;

    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Prompt user to install the app
   */
  public async promptInstall(): Promise<void> {
    if (!this.deferredPrompt) return;

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      this.trackEvent('install_prompt_result', {
        outcome: choiceResult.outcome
      });

      if (choiceResult.outcome === 'accepted') {
        this.hideInstallBanner();
      }

      this.deferredPrompt = null;
    } catch (error) {
      errorTracker.logError(error as Error, {
        context: 'Install prompt',
        category: 'PWA'
      });
    }
  }

  /**
   * Apply service worker update
   */
  public async applyUpdate(): Promise<void> {
    try {
      if (this.registration?.waiting) {
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    } catch (error) {
      errorTracker.logError(error as Error, {
        context: 'Apply update',
        category: 'PWA'
      });
    }
  }

  /**
   * Get installation status
   */
  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Get online status
   */
  public isAppOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Get update status
   */
  public isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  /**
   * Track PWA events
   */
  private trackEvent(event: string, data?: Record<string, any>): void {
    try {
      // Integration with analytics would go here
      console.log(`PWA Event: ${event}`, data);
      
      // Store in localStorage for analytics
      const events = JSON.parse(localStorage.getItem('pwa_events') || '[]');
      events.push({
        event,
        data,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('pwa_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to track PWA event:', error);
    }
  }

  /**
   * Get cached resources info
   */
  public async getCacheInfo(): Promise<{
    caches: string[];
    totalSize: number;
  }> {
    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const clone = response.clone();
            const buffer = await clone.arrayBuffer();
            totalSize += buffer.byteLength;
          }
        }
      }

      return {
        caches: cacheNames,
        totalSize
      };
    } catch (error) {
      errorTracker.logError(error as Error, {
        context: 'Cache info',
        category: 'PWA'
      });
      return { caches: [], totalSize: 0 };
    }
  }

  /**
   * Clear app cache
   */
  public async clearCache(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      this.trackEvent('cache_cleared');
    } catch (error) {
      errorTracker.logError(error as Error, {
        context: 'Clear cache',
        category: 'PWA'
      });
    }
  }
}

// Create global PWA manager instance
export const pwaManager = new PWAManager();

// Export utilities for React hooks
export const usePWA = () => {
  return {
    isInstalled: pwaManager.isAppInstalled(),
    isOnline: pwaManager.isAppOnline(),
    updateAvailable: pwaManager.isUpdateAvailable(),
    promptInstall: () => pwaManager.promptInstall(),
    applyUpdate: () => pwaManager.applyUpdate(),
    getCacheInfo: () => pwaManager.getCacheInfo(),
    clearCache: () => pwaManager.clearCache()
  };
};
