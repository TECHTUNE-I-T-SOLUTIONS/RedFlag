'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Archive, AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { getRiskColor } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Analysis {
  id: string
  content_type: string
  content_preview: string
  risk_level: 'low' | 'medium' | 'high'
  risk_score: number
  created_at: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchAnalyses()
  }, [riskFilter])

  const fetchAnalyses = async () => {
    try {
      setIsLoading(true)
      
      // Get the session to get auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No auth token available')
      }

      const params = new URLSearchParams()
      if (riskFilter !== 'all') {
        params.append('riskLevel', riskFilter)
      }
      params.append('limit', '50')

      const response = await fetch(`/api/analyses?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch analyses')
      }

      const data = await response.json()
      setAnalyses(data.analyses || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching analyses:', error)
      toast.error('Failed to load analyses')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredAnalyses = analyses.filter((analysis) =>
    analysis.content_preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
        <p className="text-muted-foreground">View and manage your past analyses</p>
        <p className="text-sm text-muted-foreground mt-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
          ℹ️ Analyses are available for 24 hours. After this period, they will be automatically deleted from our servers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search analyses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:flex-1"
        />
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile/Tablet View - Cards */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-12 shadow-lg text-center">
            <Loader2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading analyses...</p>
          </Card>
        ) : filteredAnalyses.length === 0 ? (
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-12 shadow-lg text-center">
            <Archive className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No analyses found</p>
            <Button asChild variant="outline">
              <a href="/dashboard/analyze">Start Your First Analysis</a>
            </Button>
          </Card>
        ) : (
          filteredAnalyses.map((analysis) => (
            <Card
              key={analysis.id}
              className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-4 shadow-lg cursor-pointer hover:bg-white/15 dark:hover:bg-gray-900/40 transition-colors"
              onClick={() => router.push(`/dashboard/history/${analysis.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(analysis.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm font-medium truncate">{analysis.content_preview}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                        analysis.risk_level
                      )}`}
                    >
                      {analysis.risk_level.charAt(0).toUpperCase() + analysis.risk_level.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/20">
                  <div className="flex gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{analysis.content_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Score</p>
                      <p className="font-medium">{analysis.risk_score}/100</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/dashboard/history/${analysis.id}`)
                    }}
                  >
                    View Details →
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <Card className="hidden lg:block backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading analyses...</p>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="p-12 text-center">
            <Archive className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No analyses found</p>
            <Button asChild variant="outline">
              <a href="/dashboard/analyze">Start Your First Analysis</a>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Content</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Risk Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((analysis) => (
                  <tr 
                    key={analysis.id} 
                    className="border-b border-border/40 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/history/${analysis.id}`)}
                  >
                    <td className="px-6 py-4 text-sm">{formatDate(analysis.created_at)}</td>
                    <td className="px-6 py-4 text-sm capitalize">{analysis.content_type}</td>
                    <td className="px-6 py-4 text-sm truncate max-w-xs">{analysis.content_preview}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
                          analysis.risk_level
                        )}`}
                      >
                        {analysis.risk_level.charAt(0).toUpperCase() + analysis.risk_level.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{analysis.risk_score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
