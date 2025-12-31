import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { pipeline } from '@huggingface/transformers';

let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

async function generateVector(text: string) {
  const ext = await getExtractor();
  const output = await ext(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dateTime,
      organization,
      doctorName,
      qualification,
      bmdcNo,
      doctorAddress,
      doctorContact,
      patientName,
      age,
      weight,
      regNo,
      gender,
      patientContact,
      allergies,
      complaints,
      pastHistory,
      investigations,
      diagnosis,
      prescriptionText,
      reasonForReferral,
    } = body;

    // Concatenate all text for vector
    const text = [
      organization,
      doctorName,
      qualification,
      bmdcNo,
      doctorAddress,
      doctorContact,
      patientName,
      age,
      weight,
      regNo,
      gender,
      patientContact,
      allergies,
      complaints,
      pastHistory,
      investigations,
      diagnosis,
      prescriptionText,
      reasonForReferral,
    ].filter(Boolean).join(' ');

    const vector = await generateVector(text);

    const prescription = await prisma.prescription.create({
      data: {
        dateTime: dateTime ? new Date(dateTime) : null,
        organization,
        doctorName,
        qualification,
        bmdcNo,
        doctorAddress,
        doctorContact,
        patientName,
        age,
        weight,
        regNo,
        gender,
        patientContact,
        allergies,
        complaints,
        pastHistory,
        investigations,
        diagnosis,
        prescriptionText,
        reasonForReferral,
        vector: vector as any,
      },
    });

    return NextResponse.json(prescription);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}