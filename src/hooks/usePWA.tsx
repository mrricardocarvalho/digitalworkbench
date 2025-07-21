import { useEffect } from 'react';

const isDevelopment = import.meta.env.DEV;

const PWAInstallPrompt = () => {
  useEffect(() => {
    let deferredPrompt: any = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show your custom install button/banner
      showInstallPromotion();
    };

    const showInstallPromotion = () => {
      // You can customize this to show a subtle banner or button
      if (isDevelopment) {
        console.log('PWA install available');
      }
      
      // Example: Create and show install button
      if (deferredPrompt) {
        // Use the stored event
        if (isDevelopment) {
          console.log('Install prompt ready');
        }
      }
      
      // Create a simple notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Install Digital Workbench', {
          body: 'Add this app to your home screen for a better experience',
          icon: '/favicon.png',
          badge: '/favicon.png'
        });
      }
    };

    const handleAppInstalled = () => {
      if (isDevelopment) {
        console.log('PWA was installed');
      }
      deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            if (isDevelopment) {
              console.log('SW registered: ', registration);
            }
          })
          .catch((registrationError) => {
            if (isDevelopment) {
              console.log('SW registration failed: ', registrationError);
            }
          });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null; // This hook doesn't render anything
};

export default PWAInstallPrompt;
