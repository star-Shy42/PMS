import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: any) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: any) => {
  try {
    const { patientId, date, notes } = await req.json();
    const appointment = await prisma.appointment.create({
      data: { patientId, date: new Date(date), notes },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
});