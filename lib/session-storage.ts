// Client-side session storage utility
// Only use this in useEffect or event handlers (browser context)

export const SESSION_KEY = 'supabase-auth-token'

export function saveSession(sessionData: any) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
  } catch (e) {
    console.error('Failed to save session:', e)
  }
}

export function getSessionFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    console.error('Failed to get session from storage:', e)
    return null
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch (e) {
    console.error('Failed to clear session:', e)
  }
}
