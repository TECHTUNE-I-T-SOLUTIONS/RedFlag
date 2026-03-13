import { NextRequest, NextResponse } from 'next/server'

// In-memory store for rate limiting (use Redis in production)
const downloadAttempts = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_PER_DAY = 2
const RATE_LIMIT_RESET_HOURS = 24

function isRateLimited(userId: string): boolean {
  const now = Date.now()
  const userLimit = downloadAttempts.get(userId)

  if (!userLimit) {
    downloadAttempts.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000,
    })
    return false
  }

  // Reset if time has passed
  if (now > userLimit.resetTime) {
    downloadAttempts.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000,
    })
    return false
  }

  // Check if limit exceeded
  if (userLimit.count >= RATE_LIMIT_PER_DAY) {
    return true
  }

  // Increment counter
  userLimit.count++
  return false
}

function getRemainingDownloads(userId: string): number {
  const now = Date.now()
  const userLimit = downloadAttempts.get(userId)

  if (!userLimit || now > userLimit.resetTime) {
    return RATE_LIMIT_PER_DAY
  }

  return Math.max(0, RATE_LIMIT_PER_DAY - userLimit.count)
}

function getResetTime(userId: string): number | null {
  const userLimit = downloadAttempts.get(userId)
  if (!userLimit) return null
  return userLimit.resetTime
}

export function checkDownloadLimit(userId: string): {
  allowed: boolean
  remaining: number
  resetTime: number | null
} {
  return {
    allowed: !isRateLimited(userId),
    remaining: getRemainingDownloads(userId),
    resetTime: getResetTime(userId),
  }
}
