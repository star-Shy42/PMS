import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: any) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { invoice: true },
    });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: any) => {
  try {
    const { invoiceId, amount } = await req.json();
    const payment = await prisma.payment.create({
      data: { invoiceId, amount },
    });
    // Update invoice status if fully paid
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });
    if (invoice) {
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + amount;
      const newStatus = totalPaid >= invoice.amount ? 'paid' : 'partial';
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus },
      });
    }
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
});