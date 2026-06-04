import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// 1x1 transparent GIF pixel
const PIXEL_GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export async function GET(request: NextRequest) {
  const trackingId = request.nextUrl.searchParams.get('id');
  
  if (trackingId) {
    try {
      // Mark the outreach_log entry as opened
      await turso.execute({
        sql: `UPDATE outreach_log SET opened = 1, opened_at = datetime('now') WHERE tracking_id = ? AND opened = 0`,
        args: [trackingId]
      });
    } catch (error) {
      // Silently fail — tracking is best-effort
      console.error('Track pixel error:', error);
    }
  }

  // Return 1x1 transparent GIF
  return new NextResponse(PIXEL_GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}