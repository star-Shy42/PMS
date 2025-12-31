"use client";
import { useState } from "react";
import MedicalPrescriptionForm from "../../components/MedicalPrescriptionForm";
import { getPrescription, searchPrescriptions } from "../../services/api";
import Sidebar from "../../components/Sidebar";

type Prescription = {
  id: string;
  dateTime: string | null;
  organization: string | null;
  doctorName: string | null;
  qualification: string | null;
  bmdcNo: string | null;
  doctorAddress: string | null;
  doctorContact: string | null;
  patientName: string | null;
  age: string | null;
  weight: string | null;
  regNo: string | null;
  gender: string | null;
  patientContact: string | null;
  allergies: string | null;
  complaints: string | null;
  pastHistory: string | null;
  investigations: string | null;
  diagnosis: string | null;
  prescriptionText: string | null;
  reasonForReferral: string | null;
  vector: any;
  createdAt: string;
  updatedAt: string;
};

export default function PrescriptionsPage() {
  const [view, setView] = useState<"list" | "form" | "details">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchResults, setSearchResults] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const data = await searchPrescriptions(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const data = await getPrescription(id);
      setSelectedPrescription(data);
      setView("details");
    } catch (error) {
      console.error("Failed to fetch prescription", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold">Prescriptions</h1>
          <button
            onClick={() => {
              if (view === "list") {
                setView("form");
              } else {
                setView("list");
                setSelectedPrescription(null);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {view === "list" ? "New Prescription" : "Back to List"}
          </button>
        </div>

        {view === "form" ? (
          <MedicalPrescriptionForm />
        ) : view === "details" && selectedPrescription ? (
          <MedicalPrescriptionForm
            initialData={{
              dateTime: selectedPrescription.dateTime || "",
              organization: selectedPrescription.organization || "",
              doctorName: selectedPrescription.doctorName || "",
              qualification: selectedPrescription.qualification || "",
              bmdcNo: selectedPrescription.bmdcNo || "",
              doctorAddress: selectedPrescription.doctorAddress || "",
              doctorContact: selectedPrescription.doctorContact || "",
              patientName: selectedPrescription.patientName || "",
              age: selectedPrescription.age || "",
              weight: selectedPrescription.weight || "",
              regNo: selectedPrescription.regNo || "",
              gender: selectedPrescription.gender || "",
              patientContact: selectedPrescription.patientContact || "",
              allergies: selectedPrescription.allergies || "",
              complaints: selectedPrescription.complaints || "",
              pastHistory: selectedPrescription.pastHistory || "",
              investigations: selectedPrescription.investigations || "",
              diagnosis: selectedPrescription.diagnosis || "",
              prescriptionText: selectedPrescription.prescriptionText || "",
              reasonForReferral: selectedPrescription.reasonForReferral || "",
            }}
            readOnly={true}
          />
        ) : (
          <div className="print:hidden">
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prescriptions..."
                className="flex-1 border px-3 py-2 rounded"
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Search
              </button>
            </div>

            <div className="space-y-4">
              {(searchResults.length > 0 ? searchResults : prescriptions).map(
                (p) => (
                  <div key={p.id} className="border p-4 rounded shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{p.patientName}</h3>
                        <p className="text-sm text-gray-600">
                          Doctor: {p.doctorName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date:{" "}
                          {p.dateTime
                            ? new Date(p.dateTime).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewDetails(p.id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print CSS */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
