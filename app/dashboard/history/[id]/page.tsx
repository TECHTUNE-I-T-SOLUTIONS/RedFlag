'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RiskScoreDisplay } from '@/components/RiskScoreDisplay'
import { supabase } from '@/lib/supabase'
import { downloadPDF } from '@/lib/pdf-generator'
import { toast } from 'sonner'
import { ArrowLeft, Download, Loader2, AlertTriangle, Clock } from 'lucide-react'

interface Analysis {
  id: string
  content_type: 'text' | 'url' | 'image'
  content_preview: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high'
  confidence: number
  red_flags: string[]
  explanation: string
  recommendation: string
  created_at: string
}

export default function HistoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const analysisId = params.id as string

  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [remainingHours, setRemainingHours] = useState<number | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true)
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.access_token) {
          toast.error('Authentication required')
          router.push('/dashboard/history')
          return
        }

        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('id', analysisId)
          .single()

        if (error) {
          toast.error('Failed to load analysis')
          router.push('/dashboard/history')
          return
        }

        setAnalysis(data)
      } catch (error) {
        console.error('Error fetching analysis:', error)
        toast.error('Error loading analysis')
        router.push('/dashboard/history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [analysisId, router])

  // Calculate remaining time until deletion (24 hours after creation)
  useEffect(() => {
    if (!analysis?.created_at) return

    const calculateRemaining = () => {
      const createdTime = new Date(analysis.created_at).getTime()
      const deletionTime = createdTime + 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const now = new Date().getTime()
      const remainingMs = deletionTime - now

      if (remainingMs <= 0) {
        setRemainingHours(0)
      } else {
        const hours = Math.ceil(remainingMs / (60 * 60 * 1000))
        setRemainingHours(hours)
      }
    }

    calculateRemaining()
    const interval = setInterval(calculateRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [analysis?.created_at])

  const handleDownloadPDF = async () => {
    if (!analysis) return

    try {
      setIsDownloading(true)
      const analysisData = {
        contentType: analysis.content_type,
        contentPreview: analysis.content_preview,
        riskScore: analysis.risk_score,
        riskLevel: analysis.risk_level,
        confidence: analysis.confidence,
        redFlags: analysis.red_flags,
        explanation: analysis.explanation,
        recommendation: analysis.recommendation,
        createdAt: analysis.created_at,
      }

      await downloadPDF(analysisData)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Analysis not found</p>
          <Button onClick={() => router.push('/dashboard/history')} variant="outline">
            Back to History
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push('/dashboard/history')}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to History
        </Button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Analysis Details</h1>
        <p className="text-muted-foreground">
          {analysis.content_type.toUpperCase()} • {new Date(analysis.created_at).toLocaleString()}
        </p>
      </div>

      {/* Time Remaining Countdown */}
      {remainingHours !== null && (
        <Card className={`backdrop-blur-sm border-2 rounded-2xl p-6 shadow-lg ${
          remainingHours <= 2
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-white/10 dark:bg-gray-900/30 border-white/20 dark:border-gray-700/50'
        }`}>
          <div className="flex items-center gap-4">
            <Clock className={`w-6 h-6 flex-shrink-0 ${
              remainingHours <= 2 ? 'text-red-500' : 'text-accent'
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Time Remaining</p>
              <p className={`text-2xl font-bold ${
                remainingHours <= 2 ? 'text-red-500' : ''
              }`}>
                {remainingHours === 0
                  ? 'Available < 1 hour'
                  : remainingHours === 1
                  ? 'Available for 1 hour'
                  : `Available for ${remainingHours} hours`}
              </p>
            </div>
            {remainingHours <= 2 && (
              <div className="text-xs text-red-500 text-right font-medium">
                Download your<br />report soon!
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            This analysis will be automatically deleted 24 hours after creation. Make sure to download your report before the time runs out!
          </p>
        </Card>
      )}

      {/* Risk Score Display */}
      <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg flex justify-center">
        <RiskScoreDisplay
          score={analysis.risk_score}
          confidence={analysis.confidence}
        />
      </div>

      {/* Content Preview */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Content Analyzed</h2>
        <div className="bg-background/50 rounded-lg p-4 border border-border/40">
          <p className="text-muted-foreground text-sm break-all">{analysis.content_preview}</p>
        </div>
      </Card>

      {/* Red Flags */}
      {analysis.red_flags.length > 0 && (
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Red Flags Identified</h2>
          <div className="space-y-3">
            {analysis.red_flags.map((flag, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Explanation */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {analysis.explanation}
        </p>
      </Card>

      {/* Recommendation */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recommended Action</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {analysis.recommendation}
        </p>
      </Card>

      {/* Download Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex-1"
          size="lg"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Report (PDF)
            </>
          )}
        </Button>
        <Button
          onClick={() => router.push('/dashboard/history')}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          Back to History
        </Button>
      </div>
    </div>
  )
}
