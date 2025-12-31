'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getPayments, createPayment, getPatients } from '@/services/api';
import Sidebar from '@/components/Sidebar';

interface Invoice {
  id: string;
  patientId: string;
  patient: { name: string };
  amount: number;
  status: string;
  items?: string;
  payments: Payment[];
}

interface Payment {
  id: string;
  amount: number;
  date: string;
}

interface Patient {
  id: string;
  name: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [invoiceFormData, setInvoiceFormData] = useState({ patientId: '', amount: '', items: '' });
  const [paymentFormData, setPaymentFormData] = useState({ amount: '' });

  useEffect(() => {
    if (user) {
      loadInvoices();
      loadPayments();
      loadPatients();
    }
  }, [user]);

  const loadInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices', error);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to load payments', error);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients', error);
    }
  };

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvoice({
        patientId: invoiceFormData.patientId,
        amount: parseFloat(invoiceFormData.amount),
        items: invoiceFormData.items,
      });
      loadInvoices();
      setShowInvoiceForm(false);
      setInvoiceFormData({ patientId: '', amount: '', items: '' });
    } catch (error) {
      console.error('Failed to create invoice', error);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPayment({
        invoiceId: selectedInvoice,
        amount: parseFloat(paymentFormData.amount),
      });
      loadPayments();
      loadInvoices(); // Refresh to update status
      setShowPaymentForm(false);
      setSelectedInvoice('');
      setPaymentFormData({ amount: '' });
    } catch (error) {
      console.error('Failed to create payment', error);
    }
  };

  const updateInvoiceStatus = async (id: string, status: string) => {
    try {
      await updateInvoice(id, { status });
      loadInvoices();
    } catch (error) {
      console.error('Failed to update invoice status', error);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteInvoice(id);
        loadInvoices();
      } catch (error) {
        console.error('Failed to delete invoice', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Billing & Invoicing</h2>
          <div className="space-x-2">
            <button
              onClick={() => setShowInvoiceForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Invoice
            </button>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Record Payment
            </button>
          </div>
        </div>

        {showInvoiceForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Create Invoice</h3>
            <form onSubmit={handleInvoiceSubmit} className="space-y-4">
              <select
                value={invoiceFormData.patientId}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, patientId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>{patient.name}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={invoiceFormData.amount}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, amount: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Items (JSON)"
                value={invoiceFormData.items}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, items: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInvoiceForm(false);
                    setInvoiceFormData({ patientId: '', amount: '', items: '' });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showPaymentForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Record Payment</h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <select
                value={selectedInvoice}
                onChange={(e) => setSelectedInvoice(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Invoice</option>
                {invoices.filter(inv => inv.status !== 'paid').map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.patient.name} - ${invoice.amount} ({invoice.status})
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={paymentFormData.amount}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Record
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedInvoice('');
                    setPaymentFormData({ amount: '' });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => {
                const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
                return (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${invoice.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={invoice.status}
                        onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                        className="p-1 border rounded"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${totalPaid}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}