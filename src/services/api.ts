const API_BASE = '/api';

const getToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

// Auth
export const login = (email: string, password: string) =>
  apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (email: string, password: string, role: string) =>
  apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, role }) });

// Patients
export const getPatients = () => apiRequest('/patients');
export const createPatient = (data: any) => apiRequest('/patients', { method: 'POST', body: JSON.stringify(data) });
export const getPatient = (id: string) => apiRequest(`/patients/${id}`);
export const updatePatient = (id: string, data: any) => apiRequest(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePatient = (id: string) => apiRequest(`/patients/${id}`, { method: 'DELETE' });

// Appointments
export const getAppointments = () => apiRequest('/appointments');
export const createAppointment = (data: any) => apiRequest('/appointments', { method: 'POST', body: JSON.stringify(data) });
export const getAppointment = (id: string) => apiRequest(`/appointments/${id}`);
export const updateAppointment = (id: string, data: any) => apiRequest(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAppointment = (id: string) => apiRequest(`/appointments/${id}`, { method: 'DELETE' });

// Medical Records
export const getMedicalRecords = () => apiRequest('/medical-records');
export const createMedicalRecord = (data: any) => apiRequest('/medical-records', { method: 'POST', body: JSON.stringify(data) });
export const getMedicalRecord = (id: string) => apiRequest(`/medical-records/${id}`);
export const updateMedicalRecord = (id: string, data: any) => apiRequest(`/medical-records/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMedicalRecord = (id: string) => apiRequest(`/medical-records/${id}`, { method: 'DELETE' });

// Invoices
export const getInvoices = () => apiRequest('/invoices');
export const createInvoice = (data: any) => apiRequest('/invoices', { method: 'POST', body: JSON.stringify(data) });
export const getInvoice = (id: string) => apiRequest(`/invoices/${id}`);
export const updateInvoice = (id: string, data: any) => apiRequest(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInvoice = (id: string) => apiRequest(`/invoices/${id}`, { method: 'DELETE' });

// Payments
export const getPayments = () => apiRequest('/payments');
export const createPayment = (data: any) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(data) });

// Reports
export const getReports = () => apiRequest('/reports');

// AI
export const checkSymptoms = (symptoms: string) =>
  apiRequest('/ai/symptom-checker', { method: 'POST', body: JSON.stringify({ symptoms }) });

export const getPredictiveAlerts = (history: string) =>
  apiRequest('/ai/predictive-alerts', { method: 'POST', body: JSON.stringify({ history }) });

export const getPrescriptionAssistance = (diagnosis: string) =>
  apiRequest('/ai/prescription-assistance', { method: 'POST', body: JSON.stringify({ diagnosis }) });

// Prescriptions
export const getPrescriptions = () => apiRequest('/prescriptions');
export const createPrescription = (data: any) => apiRequest('/prescriptions', { method: 'POST', body: JSON.stringify(data) });
export const getPrescription = (id: string) => apiRequest(`/prescriptions/${id}`);
export const searchPrescriptions = (query: string) => apiRequest(`/prescriptions/search?q=${encodeURIComponent(query)}`);