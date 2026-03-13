import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type RiskLevel = 'low' | 'medium' | 'high'

export function getRiskLevel(score: number): RiskLevel {
  if (score < 33) return 'low'
  if (score < 67) return 'medium'
  return 'high'
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return 'text-green-500 dark:text-green-400'
    case 'medium':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'high':
      return 'text-red-500 dark:text-red-400'
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return 'bg-green-500/20 dark:bg-green-500/20'
    case 'medium':
      return 'bg-yellow-500/20 dark:bg-yellow-500/20'
    case 'high':
      return 'bg-red-500/20 dark:bg-red-500/20'
  }
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Tailwind style constants
export const glassCardStyles = 'backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg'
export const glassStyles = 'backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50'
export const gradientTextStyles = 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
