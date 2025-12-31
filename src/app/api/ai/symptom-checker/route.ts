import { NextRequest, NextResponse } from 'next/server';
import { checkSymptoms } from '@/lib/gemini';
import { withAuth } from '@/lib/withAuth';

export const POST = withAuth(async (req: any) => {
  try {
    const { symptoms } = await req.json();
    const suggestions = await checkSymptoms(symptoms);
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check symptoms' }, { status: 500 });
  }
});