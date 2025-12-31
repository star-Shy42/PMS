import { GoogleGenerativeAI } from "@google/generative-ai";
import { pipeline } from "@huggingface/transformers";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
}); // Note: using 1.5-flash as 2.5-flash-lite may not be available

let classifier: any = null;

async function getClassifier() {
  if (!classifier) {
    classifier = await pipeline(
      "zero-shot-classification",
      "Xenova/distilbert-base-uncased-mnli"
    );
  }
  return classifier;
}

async function zeroShotClassification(
  text: string,
  candidateLabels: string[]
): Promise<string> {
  const pipe = await getClassifier();
  const result = await pipe(text, candidateLabels);
  return result.labels[0]; // Highest score
}

export const checkSymptoms = async (symptoms: string): Promise<string> => {
  const prompt = `Based on the following symptoms: ${symptoms}, suggest possible conditions. Provide a brief response in one word such as emergency or urgent or moderate or mild.`;
  const result = await model.generateContent(prompt);
  const geminiResponse = result.response.text();
  const severity = await zeroShotClassification(geminiResponse, [
    "Emergency",
    "Urgent",
    "Moderate",
    "Mild",
  ]);
  return `Severity: ${severity}`;
};

export const predictAlerts = async (history: string): Promise<string> => {
  const prompt = `Based on the patient's medical history: ${history}, suggest if follow-ups are needed and any alerts in two word such as high risk or medium risk or low risk or no risk.`;
  const result = await model.generateContent(prompt);
  const geminiResponse = result.response.text();
  const risk = await zeroShotClassification(geminiResponse, [
    "High risk",
    "Medium risk",
    "Low risk",
    "No risk",
  ]);
  return `Risk Level: ${risk}`;
};

export const suggestPrescription = async (
  diagnosis: string
): Promise<string> => {
  const prompt = `For the diagnosis: ${diagnosis}, suggest possible medicines and dosages. Note: This is not medical advice.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
