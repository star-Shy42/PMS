import { NextRequest, NextResponse } from 'next/server';
import { suggestPrescription } from '@/lib/gemini';
import { withAuth } from '@/lib/withAuth';

export const POST = withAuth(async (req: any) => {
  try {
    const { diagnosis } = await req.json();
    const suggestions = await suggestPrescription(diagnosis);
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to suggest prescription' }, { status: 500 });
  }
});