import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Cleanup API Route
 * Deletes analyses older than 24 hours
 * 
 * Security: This route should be called by an authorized cron job or service
 * Uses the service role key to bypass RLS and perform deletions
 * 
 * Usage:
 * - Can be called manually: curl https://redflag.app/api/cleanup
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

    // Create Supabase client with service role key
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

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    const cutoffTime = twentyFourHoursAgo.toISOString()

    console.log(`Cleanup started: Looking for analyses created before ${cutoffTime}`)

    // Query for analyses older than 24 hours
    const { data: oldAnalyses, error: fetchError } = await supabase
      .from('analyses')
      .select('id')
      .lt('created_at', cutoffTime)

    if (fetchError) {
      console.error('Error fetching old analyses:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch old analyses', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!oldAnalyses || oldAnalyses.length === 0) {
      console.log('No analyses older than 24 hours found')
      return NextResponse.json({
        success: true,
        message: 'No analyses older than 24 hours found',
        deletedCount: 0,
      })
    }

    console.log(`Found ${oldAnalyses.length} analyses to delete`)

    // Extract IDs
    const analysisIds = oldAnalyses.map((analysis) => analysis.id)

    // Delete notifications associated with these analyses
    const { error: notifDeleteError, count: notifCount } = await supabase
      .from('notifications')
      .delete()
      .in('analysis_id', analysisIds)

    if (notifDeleteError) {
      console.error('Error deleting notifications:', notifDeleteError)
      // Continue anyway, as the main data is more important
    } else {
      console.log(`Deleted ${notifCount || 0} notifications`)
    }

    // Delete the analyses themselves (using service role key to bypass RLS)
    const { error: deleteError, count } = await supabase
      .from('analyses')
      .delete()
      .lt('created_at', cutoffTime)

    if (deleteError) {
      console.error('Error deleting analyses:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete old analyses', details: deleteError.message },
        { status: 500 }
      )
    }

    const deletedCount = count || 0
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
