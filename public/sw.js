/**
 * Service Worker for Digital Workbench PWA
 * Provides offline capabilities, caching strategies, and background sync
 */

const CACHE_NAME = 'digital-workbench-v5';
const RUNTIME_CACHE = 'runtime-cache-v4';
const IMAGE_CACHE = 'image-cache-v4';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Image patterns that should be cached
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\/images\//,
  /\/photos\//
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

/**
 * Activate event - cleanup old caches
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Cleanup old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE &&
              cacheName !== IMAGE_CACHE
            )
            .map((cacheName) => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Claim clients
      self.clients.claim()
    ])
    .then(() => {
      console.log('✅ Service Worker activated');
    })
    .catch((error) => {
      console.error('❌ Service Worker activation failed:', error);
    })
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other special URLs
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Route different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleStaticAssetRequest(request));
  }
});

/**
 * Message event - handle commands from the main thread
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 Skipping waiting...');
    self.skipWaiting();
  }
});

/**
 * Check if request is for an image
 */
function isImageRequest(request) {
  return IMAGE_PATTERNS.some((pattern) => pattern.test(request.url));
}

/**
 * Check if request is a navigation request
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

/**
 * Handle image requests with cache-first strategy
 */
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🖼️ Serving image from cache:', request.url);
      return cachedResponse;
    }

    console.log('🌐 Fetching image from network:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone response before caching
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Image request failed:', error);
    
    // Return a fallback image or empty response
    return new Response('', {
      status: 200,
      statusText: 'OK'
    });
  }
}

/**
 * Handle navigation requests with cache-first strategy
 */
async function handleNavigationRequest(request) {
  try {
    console.log('🧭 Handling navigation request:', request.url);
    
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
      return networkResponse;
    }
  } catch (error) {
    console.log('📱 Network failed for navigation, trying cache');
  }
  
  // Fallback to cache
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('📦 Serving navigation from cache');
    return cachedResponse;
  }
  
  // Fallback to index.html for SPA routing
  const indexResponse = await cache.match('/index.html');
  if (indexResponse) {
    console.log('📦 Serving index.html for SPA route');
    return indexResponse;
  }
  
  // Final fallback - offline page
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Digital Workbench - Offline</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0; 
          padding: 40px 20px; 
          background: #0D0D0D; 
          color: #EAEAEA;
          text-align: center;
        }
        .container { max-width: 500px; margin: 0 auto; }
        .icon { font-size: 4rem; margin-bottom: 20px; }
        h1 { color: #007CF0; margin-bottom: 10px; }
        p { color: #A0A0A0; line-height: 1.6; }
        .retry-btn {
          background: #007CF0;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 20px;
        }
        .retry-btn:hover { background: #0066cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📱</div>
        <h1>You're Offline</h1>
        <p>The page you're looking for isn't available offline. Please check your connection and try again.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    statusText: 'OK',
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}

/**
 * Handle static asset requests
 */
async function handleStaticAssetRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 Serving static asset from cache:', request.url);
      return cachedResponse;
    }

    console.log('🌐 Fetching static asset from network:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Static asset request failed:', error);
    
    // Try to serve from runtime cache as fallback
    const runtimeCache = await caches.open(RUNTIME_CACHE);
    const fallbackResponse = await runtimeCache.match(request);
    
    if (fallbackResponse) {
      return fallbackResponse;
    }
    
    // Return empty response for failed assets
    return new Response('', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

console.log('🚀 Service Worker loaded successfully');
