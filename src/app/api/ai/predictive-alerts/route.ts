import { NextRequest, NextResponse } from 'next/server';
import { predictAlerts } from '@/lib/gemini';
import { withAuth } from '@/lib/withAuth';

export const POST = withAuth(async (req: any) => {
  try {
    const { history } = await req.json();
    const alerts = await predictAlerts(history);
    return NextResponse.json({ alerts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate alerts' }, { status: 500 });
  }
});