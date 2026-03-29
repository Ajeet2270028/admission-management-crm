import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);

// Master
export const getInstitutions = () => API.get('/master/institutions');
export const createInstitution = (data) => API.post('/master/institutions', data);
export const getCampuses = () => API.get('/master/campuses');
export const createCampus = (data) => API.post('/master/campuses', data);
export const getDepartments = () => API.get('/master/departments');
export const createDepartment = (data) => API.post('/master/departments', data);
export const getAcademicYears = () => API.get('/master/academic-years');
export const createAcademicYear = (data) => API.post('/master/academic-years', data);

// Programs
export const getPrograms = () => API.get('/programs');
export const getProgram = (id) => API.get(`/programs/${id}`);
export const createProgram = (data) => API.post('/programs', data);
export const getProgramQuotas = (id) => API.get(`/programs/${id}/quotas`);

// Applicants
export const getApplicants = (params) => API.get('/applicants', { params });
export const getApplicant = (id) => API.get(`/applicants/${id}`);
export const createApplicant = (data) => API.post('/applicants', data);
export const allocateSeat = (id) => API.post(`/applicants/${id}/allocate-seat`);
export const confirmAdmission = (id) => API.post(`/applicants/${id}/confirm`);
export const updateDocStatus = (id, status) => API.patch(`/applicants/${id}/document-status`, { status });
export const updateFeeStatus = (id, status) => API.patch(`/applicants/${id}/fee-status`, { status });
export const cancelAdmission = (id) => API.post(`/applicants/${id}/cancel`);

// Dashboard
export const getDashboardSummary = () => API.get('/dashboard/summary');
export const getPendingDocuments = () => API.get('/dashboard/pending-documents');
export const getPendingFees = () => API.get('/dashboard/pending-fees');

export default API;