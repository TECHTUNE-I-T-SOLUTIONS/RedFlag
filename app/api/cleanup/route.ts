import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Cleanup API Route
 * Deletes analyses marked as deleted older than 24 hours
 * 
 * Security: This route should be called by an authorized cron job or service
 * Uses the cleanup secret key from environment for authentication
 * 
 * Usage:
 * - Can be called manually: curl https://redflagesecurity.app/api/cleanup -H "x-cleanup-secret: YOUR_SECRET"
 * - Should be set up as a cron job to run every hour or daily
 */

export async function GET(request: NextRequest) {
  try {
    // Get the secret key header (case-insensitive, trimmed)
    const authHeader = request.headers.get('x-cleanup-secret')?.trim()
    const expectedSecret = process.env.CLEANUP_SECRET_KEY?.trim()

    // If secret is configured, validate it
    if (expectedSecret) {
      if (!authHeader) {
        console.warn('Cleanup request rejected: Missing x-cleanup-secret header')
        return NextResponse.json(
          { error: 'Unauthorized: Missing authentication header' },
          { status: 401 }
        )
      }

      if (authHeader !== expectedSecret) {
        console.warn('Cleanup request rejected: Invalid x-cleanup-secret header')
        return NextResponse.json(
          { error: 'Unauthorized: Invalid authentication header' },
          { status: 401 }
        )
      }

      console.log('Cleanup request authenticated with secret key')
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    const cutoffTime = twentyFourHoursAgo.toISOString()

    console.log(`Cleanup started: Looking for old analyses created before ${cutoffTime}`)

    // Query for analyses marked as deleted older than 24 hours
    const { data: oldAnalyses, error: selectError } = await supabase
      .from('analyses')
      .select('id')
      .eq('is_deleted', true)
      .lt('created_at', cutoffTime)

    if (selectError) {
      console.error('Query error:', selectError)
      return NextResponse.json(
        { error: 'Failed to query analyses', details: selectError.message },
        { status: 500 }
      )
    }

    const oldAnalysisIds = oldAnalyses?.map((row: any) => row.id) || []

    if (oldAnalysisIds.length === 0) {
      console.log('No old deleted analyses found')
      return NextResponse.json({
        success: true,
        message: 'No analyses older than 24 hours found',
        deletedCount: 0,
      })
    }

    console.log(`Found ${oldAnalysisIds.length} analyses to permanently delete`)

    // Delete notifications associated with these analyses
    const { error: notifError } = await supabase
      .from('notifications')
      .delete()
      .in('analysis_id', oldAnalysisIds)

    if (notifError) {
      console.warn('Error deleting notifications:', notifError)
    } else {
      console.log(`Deleted notifications for analyses`)
    }

    // Permanently delete the analyses
    const { error: deleteError } = await supabase
      .from('analyses')
      .delete()
      .eq('is_deleted', true)
      .lt('created_at', cutoffTime)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete analyses', details: deleteError.message },
        { status: 500 }
      )
    }

    const deletedCount = oldAnalysisIds.length
    console.log(`✅ Cleanup successful: Deleted ${deletedCount} analyses`)

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      deletedCount: deletedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Cleanup error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST handler for manual cleanup triggers
 * Same functionality as GET
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
