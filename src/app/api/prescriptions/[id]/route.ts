import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescription = await prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch prescription' }, { status: 500 });
  }
}