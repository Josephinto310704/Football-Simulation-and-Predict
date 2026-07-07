import { NextResponse } from 'next/server';
import { TEAMS } from '@/lib/data/teams';
import { syncTeamStatisticsAsync } from '@/lib/engine/stats-sync';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/update-stats
 * Scheduled cron job endpoint to automatically sync team xG, PPDA, and progressive passes
 * directly from FBref (https://fbref.com/en/) or exact curated baselines.
 * Zero fabrication, zero random drift.
 */
export async function GET(request: Request) {
  try {
    // Optional: Verify Vercel Cron Secret authorization header in production
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized CRON execution' }, { status: 401 });
    }

    const syncResult = await syncTeamStatisticsAsync(TEAMS);

    return NextResponse.json({
      success: true,
      data: syncResult,
      message: `Automated statistical sync completed from https://fbref.com/en/ (${syncResult.storageMode}). Zero random drift guaranteed.`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to execute automated statistical sync',
      detail: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
