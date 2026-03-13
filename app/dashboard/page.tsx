'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, BarChart3, AlertTriangle, TrendingUp, Loader2, Zap, Clock, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Analysis {
  id: string
  content_type: string
  content_preview: string
  risk_score: number
  risk_level: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    highRiskCount: 0,
    avgConfidence: 0,
  })
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Get the authenticated session (AuthGuard ensures we have one)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.access_token) {
          console.error('No valid session found')
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
        console.log('Dashboard authenticated')

        // Fetch stats
        const statsResponse = await fetch('/api/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch recent analyses
        const analysesResponse = await fetch('/api/analyses?limit=5', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (analysesResponse.ok) {
          const analysesData = await analysesResponse.json()
          setRecentAnalyses(analysesData.analyses || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Manage your scam detection dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Total Analyses</p>
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <p className="text-3xl font-bold">{stats.totalAnalyses}</p>
              )}
            </div>
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
        </Card>

        <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">High Risk Found</p>
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <p className="text-3xl font-bold">{stats.highRiskCount}</p>
              )}
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Avg Confidence</p>
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <p className="text-3xl font-bold">{stats.avgConfidence}%</p>
              )}
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/analyze">
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg cursor-pointer hover:bg-white/20 dark:hover:bg-gray-900/40 transition-colors">
            <Zap className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-2">Analyze Content</h3>
            <p className="text-sm text-muted-foreground">Check text, URLs, or images</p>
          </Card>
        </Link>

        <Link href="/dashboard/history">
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg cursor-pointer hover:bg-white/20 dark:hover:bg-gray-900/40 transition-colors">
            <Clock className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-2">View History</h3>
            <p className="text-sm text-muted-foreground">See past analyses</p>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg cursor-pointer hover:bg-white/20 dark:hover:bg-gray-900/40 transition-colors">
            <Settings className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-2">Settings</h3>
            <p className="text-sm text-muted-foreground">Manage preferences</p>
          </Card>
        </Link>
      </div>

      {/* Recent Analyses */}
      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Analyses</h2>
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentAnalyses.length > 0 ? (
          <div className="space-y-3">
            {recentAnalyses.map((analysis) => (
              <Link key={analysis.id} href={`/dashboard/history/${analysis.id}`}>
                <div className="p-4 rounded-lg hover:bg-white/10 dark:hover:bg-gray-900/50 transition-colors cursor-pointer border border-transparent hover:border-white/20 dark:hover:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="font-medium text-sm truncate">{analysis.content_preview}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          analysis.risk_level === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : analysis.risk_level === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {analysis.risk_score}/100
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">No analyses yet</p>
            <Link href="/dashboard/analyze">
              <Button>
                Start Analyzing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
