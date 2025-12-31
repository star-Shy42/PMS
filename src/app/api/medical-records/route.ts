import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: any) => {
  try {
    const records = await prisma.medicalRecord.findMany({
      include: { patient: true },
    });
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medical records' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: any) => {
  try {
    const { patientId, type, description, fileUrl, aiSuggestions } = await req.json();
    const record = await prisma.medicalRecord.create({
      data: { patientId, type, description, fileUrl, aiSuggestions },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create medical record' }, { status: 500 });
  }
});