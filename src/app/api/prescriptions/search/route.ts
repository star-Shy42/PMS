import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { pipeline } from "@huggingface/transformers";

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

async function generateVector(text: string) {
  const ext = await getExtractor();
  const output = await ext(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter q is required" },
        { status: 400 }
      );
    }

    const queryVector = await generateVector(query);

    const prescriptions = await prisma.prescription.findMany();

    const results = prescriptions
      .filter((p) => p.vector)
      .map((p) => {
        const sim = cosineSimilarity(
          queryVector as number[],
          p.vector as unknown as number[]
        );
        return { ...p, similarity: sim };
      })
      .filter((p) => p.similarity > 0.1) // threshold
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // top 10

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to search prescriptions" },
      { status: 500 }
    );
  }
}
