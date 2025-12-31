import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: any) => {
  try {
    const patientCount = await prisma.patient.count();
    const appointmentCount = await prisma.appointment.count();
    const invoiceTotal = await prisma.invoice.aggregate({
      _sum: { amount: true },
    });
    const paymentTotal = await prisma.payment.aggregate({
      _sum: { amount: true },
    });
    // Common ailments from medical records
    const records = await prisma.medicalRecord.findMany();
    const ailments = records.reduce((acc: Record<string, number>, r) => {
      const desc = r.description || '';
      acc[desc] = (acc[desc] || 0) + 1;
      return acc;
    }, {});
    const commonAilments = Object.entries(ailments).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return NextResponse.json({
      patientCount,
      appointmentCount,
      totalRevenue: paymentTotal._sum.amount || 0,
      outstanding: (invoiceTotal._sum.amount || 0) - (paymentTotal._sum.amount || 0),
      commonAilments,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
});