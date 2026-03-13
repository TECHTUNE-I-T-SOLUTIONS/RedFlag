import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Create Supabase client to verify auth
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Get user from token
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get total analyses count
    const { count: totalCount, error: totalError } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get high risk count
    const { count: highRiskCount, error: highRiskError } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('risk_level', 'high')

    // Get average confidence
    const { data: confidenceData, error: confidenceError } = await supabase
      .from('analyses')
      .select('confidence')
      .eq('user_id', user.id)

    if (totalError || highRiskError || confidenceError) {
      console.error('Database error:', { totalError, highRiskError, confidenceError })
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      )
    }

    const avgConfidence = confidenceData && confidenceData.length > 0
      ? Math.round(
        confidenceData.reduce((sum, item) => sum + item.confidence, 0) /
        confidenceData.length
      )
      : 0

    return NextResponse.json(
      {
        totalAnalyses: totalCount || 0,
        highRiskCount: highRiskCount || 0,
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
