"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  checkSymptoms,
  getPredictiveAlerts,
  getPrescriptionAssistance,
} from "@/services/api";
import Sidebar from "@/components/Sidebar";

export default function AIToolsPage() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState("");
  const [history, setHistory] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleSymptomCheck = async () => {
    setLoading({ ...loading, symptoms: true });
    try {
      const response = await checkSymptoms(symptoms);
      setResults({ ...results, symptoms: response.suggestions });
    } catch (error) {
      setResults({ ...results, symptoms: "Error checking symptoms" });
    }
    setLoading({ ...loading, symptoms: false });
  };

  const handlePredictiveAlerts = async () => {
    setLoading({ ...loading, alerts: true });
    try {
      const response = await getPredictiveAlerts(history);
      setResults({ ...results, alerts: response.alerts });
    } catch (error) {
      setResults({ ...results, alerts: "Error generating alerts" });
    }
    setLoading({ ...loading, alerts: false });
  };

  const handlePrescriptionAssistance = async () => {
    setLoading({ ...loading, prescription: true });
    try {
      const response = await getPrescriptionAssistance(diagnosis);
      setResults({ ...results, prescription: response.suggestions });
    } catch (error) {
      setResults({
        ...results,
        prescription: "Error getting prescription assistance",
      });
    }
    setLoading({ ...loading, prescription: false });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">AI-Powered Tools</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Checker */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Symptom Checker</h3>
            <textarea
              placeholder="Describe symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={4}
            />
            <button
              onClick={handleSymptomCheck}
              disabled={loading.symptoms}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading.symptoms ? "Checking..." : "Check Symptoms"}
            </button>
            {results.symptoms && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold">AI Checker:</h4>
                <p className="text-sm">{results.symptoms}</p>
              </div>
            )}
          </div>

          {/* Predictive Alerts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Predictive Alerts</h3>
            <textarea
              placeholder="Patient medical history..."
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={4}
            />
            <button
              onClick={handlePredictiveAlerts}
              disabled={loading.alerts}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading.alerts ? "Generating..." : "Generate Alerts"}
            </button>
            {results.alerts && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold">AI Alerts:</h4>
                <p className="text-sm">{results.alerts}</p>
              </div>
            )}
          </div>

          {/* Prescription Assistance */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">
              Prescription Assistance
            </h3>
            <textarea
              placeholder="Diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={4}
            />
            <button
              onClick={handlePrescriptionAssistance}
              disabled={loading.prescription}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading.prescription ? "Generating..." : "Get Assistance"}
            </button>
            {results.prescription && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold">AI Suggestions:</h4>
                <p className="text-sm">{results.prescription}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> AI suggestions are for informational
            purposes only and should not replace professional medical advice.
            Always consult with qualified healthcare providers for medical
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
