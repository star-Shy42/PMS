import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: any) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { patient: true, payments: true },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: any) => {
  try {
    const { patientId, amount, items } = await req.json();
    const invoice = await prisma.invoice.create({
      data: { patientId, amount, items: JSON.stringify(items) },
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
});