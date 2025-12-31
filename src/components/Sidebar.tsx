"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">PMS</h1>
      </div>
      <nav className="mt-4">
        <a
          href="/dashboard"
          className={`block px-4 py-2 ${
            isActive("/dashboard")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Dashboard
        </a>
        <a
          href="/patients"
          className={`block px-4 py-2 ${
            isActive("/patients")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Patients
        </a>
        <a
          href="/appointments"
          className={`block px-4 py-2 ${
            isActive("/appointments")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Appointments
        </a>
        <a
          href="/medical-records"
          className={`block px-4 py-2 ${
            isActive("/medical-records")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Medical Records
        </a>
        <a
          href="/prescriptions"
          className={`block px-4 py-2 ${
            isActive("/prescriptions")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Prescriptions
        </a>
        <a
          href="/billing"
          className={`block px-4 py-2 ${
            isActive("/billing")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Billing
        </a>
        <a
          href="/reports"
          className={`block px-4 py-2 ${
            isActive("/reports")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Reports
        </a>
        <a
          href="/ai-tools"
          className={`block px-4 py-2 ${
            isActive("/ai-tools")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          AI Tools
        </a>
        <button
          onClick={logout}
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
