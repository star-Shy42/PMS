"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getReports } from "@/services/api";
import Sidebar from "@/components/Sidebar";

interface Report {
  patientCount: number;
  appointmentCount: number;
  totalRevenue: number;
  outstanding: number;
  commonAilments: [string, number][];
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (user) {
      getReports().then(setReport).catch(console.error);
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Reports & Analytics</h2>
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Patients</h3>
              <p className="text-2xl font-bold text-blue-600">
                {report.patientCount}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Appointments</h3>
              <p className="text-2xl font-bold text-green-600">
                {report.appointmentCount}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">
                ${report.totalRevenue}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Outstanding Amount</h3>
              <p className="text-2xl font-bold text-red-600">
                ${report.outstanding}
              </p>
            </div>
          </div>
        )}
        {report && report.commonAilments.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Common Ailments</h3>
            <div className="space-y-2">
              {report.commonAilments.map(([ailment, count]) => (
                <div
                  key={ailment}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-700">{ailment}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{
                          width: `${
                            (count /
                              Math.max(
                                ...report.commonAilments.map(([, c]) => c)
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
