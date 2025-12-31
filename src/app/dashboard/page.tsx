'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getReports } from '@/services/api';
import Sidebar from '@/components/Sidebar';

interface Report {
  patientCount: number;
  appointmentCount: number;
  totalRevenue: number;
  outstanding: number;
  commonAilments: [string, number][];
}

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      getReports().then(setReport).catch(console.error);
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Overview</h2>
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Patients</h3>
              <p className="text-2xl font-bold text-blue-600">{report.patientCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Appointments</h3>
              <p className="text-2xl font-bold text-green-600">{report.appointmentCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">${report.totalRevenue}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Outstanding</h3>
              <p className="text-2xl font-bold text-red-600">${report.outstanding}</p>
            </div>
          </div>
        )}
        {report && report.commonAilments.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Common Ailments</h3>
            <ul>
              {report.commonAilments.map(([ailment, count]) => (
                <li key={ailment} className="flex justify-between">
                  <span>{ailment}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}