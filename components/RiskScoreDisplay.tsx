'use client'

import { useEffect, useState } from 'react'
import { getRiskLevel, getRiskColor } from '@/lib/utils'
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

interface RiskScoreDisplayProps {
  score: number
  confidence?: number
  className?: string
}

export function RiskScoreDisplay({
  score,
  confidence = 85,
  className = '',
}: RiskScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const riskLevel = getRiskLevel(score)

  useEffect(() => {
    let currentScore = 0
    const interval = setInterval(() => {
      if (currentScore < score) {
        currentScore += Math.ceil((score - currentScore) / 10)
        if (currentScore > score) currentScore = score
        setDisplayScore(currentScore)
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [score])

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (displayScore / 100) * circumference

  const iconColor = {
    low: 'text-green-500 dark:text-green-400',
    medium: 'text-yellow-500 dark:text-yellow-400',
    high: 'text-red-500 dark:text-red-400',
  }

  const iconBg = {
    low: 'bg-green-500/20',
    medium: 'bg-yellow-500/20',
    high: 'bg-red-500/20',
  }

  const icon = {
    low: <CheckCircle className="w-8 h-8" />,
    medium: <AlertCircle className="w-8 h-8" />,
    high: <AlertTriangle className="w-8 h-8" />,
  }

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${getRiskColor(riskLevel)} transition-all duration-500`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className={`${iconBg[riskLevel]} rounded-full p-3`}>
            <span className={`${iconColor[riskLevel]}`}>{icon[riskLevel]}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{displayScore}</div>
            <div className="text-xs text-muted-foreground">Risk Score</div>
          </div>
        </div>
      </div>

      {/* Risk badge */}
      <div className="flex flex-col items-center gap-2">
        <span
          className={`px-4 py-2 rounded-full font-semibold text-sm ${
            riskLevel === 'low'
              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
              : riskLevel === 'medium'
              ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
              : 'bg-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
        </span>
        <span className="text-xs text-muted-foreground">
          {confidence}% Confidence
        </span>
      </div>
    </div>
  )
}
