import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import { analyzeText, analyzeURL, analyzeImage } from '@/lib/analysis-service'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
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

    // Save to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analyses')
      .insert([
        {
          user_id: userId,
          content_type: type,
          content_preview: content?.substring(0, 200) || 'Image analysis',
          risk_score: analysisResult.riskScore,
          risk_level: analysisResult.riskLevel,
          red_flags: analysisResult.redFlags,
          explanation: analysisResult.explanation,
          recommendation: analysisResult.recommendation,
          confidence: analysisResult.confidence,
        }
      ])
      .select('id, content_type, content_preview, risk_score, risk_level, created_at')

    if (saveError || !savedAnalysis?.length) {
      console.error('Save error:', saveError)
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      )
    }

    // Notification is created automatically via database trigger on INSERT
    return NextResponse.json(analysisResult, { status: 200 })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
