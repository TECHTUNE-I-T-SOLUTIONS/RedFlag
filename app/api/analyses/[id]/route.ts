import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params
    const analysisId = id

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      )
    }

    // Get analysis by ID (ensure user owns it)
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('id, user_id, content_type, content_preview, risk_score, risk_level, confidence, red_flags, explanation, recommendation, created_at')
      .eq('id', analysisId)
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .single()

    if (error || !analyses) {
      console.error('Query error:', error)
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const analysis = {
      ...analyses,
      red_flags: typeof analyses.red_flags === 'string' 
        ? JSON.parse(analyses.red_flags) 
        : (analyses.red_flags || [])
    }

    return NextResponse.json(
      { analysis },
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
