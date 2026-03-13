const CACHE_PREFIX = 'redflag-v1'
const STATIC_CACHE = `${CACHE_PREFIX}-static`
const DYNAMIC_CACHE = `${CACHE_PREFIX}-dynamic`
const API_CACHE = `${CACHE_PREFIX}-api`

const urlsToCache = [
  '/',
  '/offline.html',
  '/icon.svg',
  '/favicon.ico',
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.warn('Cache addAll failed:', error)
        return Promise.resolve()
      })
    }).catch((error) => {
      console.warn('Cache open failed:', error)
      return Promise.resolve()
    })
  )
  self.skipWaiting()
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome extensions and other non-http protocols
  if (!url.protocol.startsWith('http')) {
    return
  }

  // API requests - Network first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE))
    return
  }

  // HTML pages - Network first with offline page fallback
  if (request.destination === '' || request.destination === 'document') {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE, '/offline.html'))
    return
  }

  // Static assets - Cache first
  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE))
    return
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE))
})

// Network first strategy - try network, fall back to cache
async function networkFirstStrategy(request, cacheName, offlineFallback = null) {
  try {
    const response = await fetch(request)
    
    // Only cache successful responses
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.warn('Network request failed, trying cache:', error)
    
    // Try to get from cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline fallback if provided
    if (offlineFallback) {
      try {
        return await caches.match(offlineFallback)
      } catch (e) {
        console.warn('Offline fallback failed:', e)
      }
    }
    
    // Return a basic offline response
    return new Response(
      JSON.stringify({
        error: 'Offline - No cached response available',
        status: 'offline',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// Cache first strategy - use cache, fall back to network
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Update cache in background
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(cacheName)
            cache.then((c) => c.put(request, response))
          }
        })
        .catch(() => {})
      
      return cachedResponse
    }
    
    // Fall back to network
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.warn('Cache first strategy failed:', error)
    
    // Return placeholder for images if needed
    if (request.destination === 'image') {
      return new Response(
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect fill="#ddd" width="100" height="100"/></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    
    return new Response('Offline', { status: 503 })
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.keys().then((cacheNames) => {
      const status = {
        caches: cacheNames,
        timestamp: Date.now(),
      }
      event.ports[0].postMessage(status)
    })
  }
})

// Periodically check for updates when online
self.addEventListener('online', () => {
  console.log('Service Worker: Online detected')
  // Notify all clients that we're back online
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'ONLINE_STATUS_CHANGED',
        isOnline: true,
      })
    })
  })
})

self.addEventListener('offline', () => {
  console.log('Service Worker: Offline detected')
  // Notify all clients that we're offline
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'ONLINE_STATUS_CHANGED',
        isOnline: false,
      })
    })
  })
})
