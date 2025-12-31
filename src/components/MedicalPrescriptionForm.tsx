"use client";
import React, { useState, useRef } from "react";
import { createPrescription } from "../services/api";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const useSpeechToText = (lang: "en-US" | "bn-BD") => {
  const recognitionRef = React.useRef<any>(null);

  const startListening = (onResult: (text: string) => void) => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return { startListening };
};

/* =======================
   Voice Input Component
======================= */
interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  as?: string;
  className?: string;
  speechLang: "en-US" | "bn-BD";
  [key: string]: any;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  as = "input",
  className = "",
  speechLang,
  ...props
}) => {
  const { startListening } = useSpeechToText(speechLang);

  const handleVoice = () => {
    startListening((text) => {
      const newValue = (value ? value + " " : "") + text;
      onChange(newValue);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center gap-1">
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={handleChange}
          className={className}
          {...props}
        />
      ) : (
        <input
          value={value}
          onChange={handleChange}
          className={className}
          {...props}
        />
      )}
      <button
        type="button"
        onClick={handleVoice}
        className="px-2 text-xs border rounded hover:bg-gray-200 print-hidden"
      >
        🎤
      </button>
    </div>
  );
};

/* =======================
   Main Component
======================= */
type FormData = {
  dateTime: string;
  organization: string;
  doctorName: string;
  qualification: string;
  bmdcNo: string;
  doctorAddress: string;
  doctorContact: string;
  patientName: string;
  age: string;
  weight: string;
  regNo: string;
  gender: string;
  patientContact: string;
  allergies: string;
  complaints: string;
  pastHistory: string;
  investigations: string;
  diagnosis: string;
  prescriptionText: string;
  reasonForReferral: string;
};

interface MedicalPrescriptionFormProps {
  initialData?: Partial<FormData>;
  readOnly?: boolean;
}

export default function MedicalPrescriptionForm({
  initialData,
  readOnly = false,
}: MedicalPrescriptionFormProps) {
  const [speechLang, setSpeechLang] = useState<"en-US" | "bn-BD">("en-US");
  const [formData, setFormData] = useState<FormData>({
    dateTime: initialData?.dateTime || "",
    organization: initialData?.organization || "",
    doctorName: initialData?.doctorName || "",
    qualification: initialData?.qualification || "",
    bmdcNo: initialData?.bmdcNo || "",
    doctorAddress: initialData?.doctorAddress || "",
    doctorContact: initialData?.doctorContact || "",
    patientName: initialData?.patientName || "",
    age: initialData?.age || "",
    weight: initialData?.weight || "",
    regNo: initialData?.regNo || "",
    gender: initialData?.gender || "",
    patientContact: initialData?.patientContact || "",
    allergies: initialData?.allergies || "",
    complaints: initialData?.complaints || "",
    pastHistory: initialData?.pastHistory || "",
    investigations: initialData?.investigations || "",
    diagnosis: initialData?.diagnosis || "",
    prescriptionText: initialData?.prescriptionText || "",
    reasonForReferral: initialData?.reasonForReferral || "",
  });

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createPrescription(formData);
      alert("Prescription saved successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("Save failed", error);
      alert("Error saving prescription");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-serif">
      {/* Print Button */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center print-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Speech Language:</span>
          <button
            onClick={() =>
              setSpeechLang(speechLang === "en-US" ? "bn-BD" : "en-US")
            }
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
          >
            {speechLang === "en-US" ? "English" : "বাংলা"}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          >
            Print Prescription
          </button>
          {!readOnly && (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
            >
              Save Prescription
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl bg-white p-6 sm:p-10 shadow-lg border print-page">
        {/* Header */}
        <p className="text-xs font-bold">
          DATE & TIME:
          <input
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => handleChange("dateTime")(e.target.value)}
            className="ml-2 outline-none"
          />
        </p>

        <header className="text-center my-6">
          <VoiceInput
            value={formData.organization}
            onChange={handleChange("organization")}
            placeholder="Name of Organization / Clinic"
            className="text-xl font-bold border-b-2 border-black pb-2 w-full text-center outline-none"
            speechLang={speechLang}
          />

          <div className="text-left border-black py-12 grid grid-cols-2 gap-8 text-md font-bold">
            <div className="col-span-2">
              Doctor:
              <VoiceInput
                value={formData.doctorName}
                onChange={handleChange("doctorName")}
                className="border-b w-[40vw] outline-none"
                speechLang={speechLang}
              />
            </div>
            <div>
              Qualification:
              <VoiceInput
                value={formData.qualification}
                onChange={handleChange("qualification")}
                className="border-b w-full outline-none"
                speechLang={speechLang}
              />
            </div>
            <div>
              BMDC No:
              <VoiceInput
                value={formData.bmdcNo}
                onChange={handleChange("bmdcNo")}
                className="border-b w-full outline-none"
                speechLang={speechLang}
              />
            </div>
            <div>
              Address:
              <VoiceInput
                value={formData.doctorAddress}
                onChange={handleChange("doctorAddress")}
                className="border-b w-full outline-none"
                speechLang={speechLang}
              />
            </div>
            <div>
              Contact:
              <VoiceInput
                value={formData.doctorContact}
                onChange={handleChange("doctorContact")}
                className="border-b w-full outline-none"
                speechLang={speechLang}
              />
            </div>
          </div>
        </header>

        {/* Patient Info */}
        <div className="border-y-2 border-black pt-12 pb-20 grid grid-cols-2 gap-8 text-md font-bold">
          <div className="col-span-2">
            Patient:
            <VoiceInput
              value={formData.patientName}
              onChange={handleChange("patientName")}
              className="border-b w-[40vw] font-normal outline-none"
              speechLang={speechLang}
            />
          </div>
          <div>
            Age:
            <VoiceInput
              value={formData.age}
              onChange={handleChange("age")}
              className="border-b w-full font-normal outline-none"
              speechLang={speechLang}
            />
          </div>
          <div>
            Weight:
            <VoiceInput
              value={formData.weight}
              onChange={handleChange("weight")}
              className="border-b w-full font-normal outline-none"
              speechLang={speechLang}
            />
          </div>
          <div>
            Reg No:
            <VoiceInput
              value={formData.regNo}
              onChange={handleChange("regNo")}
              className="border-b w-full font-normal outline-none"
              speechLang={speechLang}
            />
          </div>
          <div>
            Gender:
            <VoiceInput
              value={formData.gender}
              onChange={handleChange("gender")}
              className="border-b w-full font-normal outline-none"
              speechLang={speechLang}
            />
          </div>
          <div>
            Contact / Address:
            <VoiceInput
              value={formData.patientContact}
              onChange={handleChange("patientContact")}
              className="border-b w-full font-normal outline-none"
              speechLang={speechLang}
            />
          </div>
          <div className="col-span-2">
            Allergies:
            <VoiceInput
              value={formData.allergies}
              onChange={handleChange("allergies")}
              className="border-b w-full font-normal outline-none"
              speechLang={speechLang}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex border-b-2 border-black print-prescription">
          {/* Sidebar */}
          <aside className="w-1/3 border-r-2 border-black p-4 space-y-6 text-sm font-semibold">
            <div>
              <p className="uppercase text-[10px] mb-1">Complaints</p>
              <VoiceInput
                as="textarea"
                value={formData.complaints}
                onChange={handleChange("complaints")}
                className="w-full min-h-[80px] resize-none outline-none text-xs"
                speechLang={speechLang}
              />
            </div>
            <div>
              <p className="uppercase text-[10px] mb-1">Past History</p>
              <VoiceInput
                as="textarea"
                value={formData.pastHistory}
                onChange={handleChange("pastHistory")}
                className="w-full min-h-[80px] resize-none outline-none text-xs"
                speechLang={speechLang}
              />
            </div>
            <div>
              <p className="uppercase text-[10px] mb-1">Investigations</p>
              <VoiceInput
                as="textarea"
                value={formData.investigations}
                onChange={handleChange("investigations")}
                className="w-full min-h-[80px] resize-none outline-none text-xs"
                speechLang={speechLang}
              />
            </div>
            <div>
              <p className="uppercase text-[10px] mb-1">Diagnosis</p>
              <VoiceInput
                as="textarea"
                value={formData.diagnosis}
                onChange={handleChange("diagnosis")}
                className="w-full min-h-[80px] resize-none outline-none text-xs"
                speechLang={speechLang}
              />
            </div>
          </aside>

          {/* Prescription */}
          <main className="w-2/3 p-4">
            <div className="text-4xl font-serif italic">℞</div>
            <VoiceInput
              as="textarea"
              value={formData.prescriptionText}
              onChange={handleChange("prescriptionText")}
              placeholder={`Paracetamol 500mg — 1+1+1 — 5 days`}
              className="w-full min-h-[70vh] outline-none text-sm leading-6"
              speechLang={speechLang}
            />

            <div className="mt-6">
              <p className="text-xs font-bold uppercase">
                Reason for Referral:
              </p>
              <VoiceInput
                as="textarea"
                value={formData.reasonForReferral}
                onChange={handleChange("reasonForReferral")}
                className="w-full min-h-[5vh] resize-none outline-none text-sm"
                speechLang={speechLang}
              />

              <div className="flex justify-end mt-6">
                <p className="text-xs font-bold">Stamp & Signature</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
