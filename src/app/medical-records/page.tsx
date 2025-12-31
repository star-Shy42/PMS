'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMedicalRecords, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord, getPatients } from '@/services/api';
import Sidebar from '@/components/Sidebar';

interface MedicalRecord {
  id: string;
  patientId: string;
  patient: { name: string };
  date: string;
  type: string;
  description?: string;
  fileUrl?: string;
  aiSuggestions?: string;
}

interface Patient {
  id: string;
  name: string;
}

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState({ patientId: '', type: '', description: '', fileUrl: '', aiSuggestions: '' });

  useEffect(() => {
    if (user) {
      loadRecords();
      loadPatients();
    }
  }, [user]);

  const loadRecords = async () => {
    try {
      const data = await getMedicalRecords();
      setRecords(data);
    } catch (error) {
      console.error('Failed to load medical records', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await updateMedicalRecord(editingRecord.id, {
          type: formData.type,
          description: formData.description,
          fileUrl: formData.fileUrl,
          aiSuggestions: formData.aiSuggestions,
        });
      } else {
        await createMedicalRecord({
          patientId: formData.patientId,
          type: formData.type,
          description: formData.description,
          fileUrl: formData.fileUrl,
          aiSuggestions: formData.aiSuggestions,
        });
      }
      loadRecords();
      setShowForm(false);
      setEditingRecord(null);
      setFormData({ patientId: '', type: '', description: '', fileUrl: '', aiSuggestions: '' });
    } catch (error) {
      console.error('Failed to save medical record', error);
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setFormData({
      patientId: record.patientId,
      type: record.type,
      description: record.description || '',
      fileUrl: record.fileUrl || '',
      aiSuggestions: record.aiSuggestions || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteMedicalRecord(id);
        loadRecords();
      } catch (error) {
        console.error('Failed to delete medical record', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Medical Records</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Record
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">{editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingRecord && (
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              )}
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Type</option>
                <option value="visit">Visit</option>
                <option value="lab">Lab</option>
                <option value="imaging">Imaging</option>
              </select>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <input
                type="text"
                placeholder="File URL"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="AI Suggestions"
                value={formData.aiSuggestions}
                onChange={(e) => setFormData({ ...formData, aiSuggestions: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  {editingRecord ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRecord(null);
                    setFormData({ patientId: '', type: '', description: '', fileUrl: '', aiSuggestions: '' });
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{record.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}