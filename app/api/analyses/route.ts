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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const riskLevel = searchParams.get('riskLevel')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build Supabase query
    let query = supabase
      .from('analyses')
      .select('id, content_type, content_preview, risk_score, risk_level, created_at', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    // Apply risk level filter if provided
    if (riskLevel && ['low', 'medium', 'high'].includes(riskLevel)) {
      query = query.eq('risk_level', riskLevel)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Get analyses with count
    const { data: analyses, count, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analyses' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        analyses: analyses || [],
        total: count ?? 0,
        limit,
        offset,
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
