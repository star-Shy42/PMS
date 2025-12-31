import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: any) => {
  try {
    const patients = await prisma.patient.findMany({
      include: { appointments: true, medicalRecords: true, invoices: true },
    });
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: any) => {
  try {
    const { name, age, gender, contact, medicalHistory } = await req.json();
    const patient = await prisma.patient.create({
      data: { name, age, gender, contact, medicalHistory },
    });
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
});