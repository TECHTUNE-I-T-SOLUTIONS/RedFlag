'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function ServiceWorkerRegister() {
  const [isOnline, setIsOnline] = useState(true)
  const [hasUpdate, setHasUpdate] = useState(false)

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported in this browser')
      return
    }

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        console.log('Service Worker registered successfully:', registration)

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                setHasUpdate(true)
                toast('New version available', {
                  description: 'Click to update',
                  action: {
                    label: 'Update',
                    onClick: () => {
                      newWorker.postMessage({ type: 'SKIP_WAITING' })
                      window.location.reload()
                    },
                  },
                  duration: Infinity,
                })
              }
            })
          }
        })

        // Handle controller change (SW update)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (hasUpdate) {
            window.location.reload()
          }
        })
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }

    registerServiceWorker()

    // Track online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('You are back online!', {
        description: 'Syncing data...',
        duration: 3000,
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('You are offline', {
        description: 'Some features may be limited',
        duration: 3000,
      })
    }

    // Listen to service worker messages
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data.type === 'ONLINE_STATUS_CHANGED') {
        if (event.data.isOnline) {
          handleOnline()
        } else {
          handleOffline()
        }
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    navigator.serviceWorker.addEventListener('message', handleSWMessage)

    // Initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      navigator.serviceWorker.removeEventListener('message', handleSWMessage)
    }
  }, [hasUpdate])

  return null
}
