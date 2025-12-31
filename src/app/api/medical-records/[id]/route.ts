import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: any, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!record) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medical record' }, { status: 500 });
  }
});

export const PUT = withAuth(async (req: any, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const { type, description, fileUrl, aiSuggestions } = await req.json();
    const record = await prisma.medicalRecord.update({
      where: { id },
      data: { type, description, fileUrl, aiSuggestions },
    });
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update medical record' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req: any, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    await prisma.medicalRecord.delete({ where: { id } });
    return NextResponse.json({ message: 'Medical record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete medical record' }, { status: 500 });
  }
});