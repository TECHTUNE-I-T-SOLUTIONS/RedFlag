import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { analyzeText, analyzeURL, analyzeImage } from '@/lib/analysis-service'

export async function POST(request: NextRequest) {
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
    
    // Create Supabase client with anon key to verify token
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

    const body = await request.json()
    const { type, content, imageBase64 } = body

    // Validate input
    if (!type || !['text', 'url', 'image'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid analysis type' },
        { status: 400 }
      )
    }

    if (!content && type !== 'image') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!imageBase64 && type === 'image') {
      return NextResponse.json(
        { error: 'Image is required for image analysis' },
        { status: 400 }
      )
    }

    // Perform AI-powered analysis
    let analysisResult
    try {
      if (type === 'text') {
        analysisResult = await analyzeText(content)
      } else if (type === 'url') {
        analysisResult = await analyzeURL(content)
      } else if (type === 'image') {
        analysisResult = await analyzeImage(imageBase64)
      } else {
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        )
      }
    } catch (aiError) {
      console.error('AI analysis error:', aiError)
      return NextResponse.json(
        { error: 'Analysis service error' },
        { status: 500 }
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

    // Save to database
    const { error: saveError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        content_type: type,
        content_preview: content?.substring(0, 200) || 'Image analysis',
        risk_score: analysisResult.riskScore,
        risk_level: analysisResult.riskLevel,
        red_flags: analysisResult.redFlags,
        explanation: analysisResult.explanation,
        recommendation: analysisResult.recommendation,
        confidence: analysisResult.confidence,
      })

    if (saveError) {
      console.error('Database error:', saveError)
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      )
    }

    return NextResponse.json(analysisResult, { status: 200 })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

