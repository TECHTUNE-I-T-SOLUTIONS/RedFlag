import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Verify NextAuth session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    console.log('Fetching stats for user:', userId)

    // Get total analyses count
    const { count: totalCount, error: totalError } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_deleted', false)

    // Get high risk count
    const { count: highRiskCount, error: highRiskError } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('risk_level', 'high')
      .eq('is_deleted', false)

    // Get average risk score
    const { data: confidenceData, error: confidenceError } = await supabase
      .from('analyses')
      .select('risk_score')
      .eq('user_id', userId)
      .eq('is_deleted', false)

    const avgScores = confidenceData?.map(d => d.risk_score) || []
    const avgConfidence = avgScores.length > 0
      ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length)
      : 0

    return NextResponse.json(
      {
        totalAnalyses: totalCount,
        highRiskCount: highRiskCount,
        avgConfidence,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
