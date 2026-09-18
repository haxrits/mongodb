const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Seed
  seedDemoData: () => request('/seed/demo', { method: 'POST' }),

  // Analytics
  getDashboardStats: () => request('/analytics/dashboard'),
  getConflictAnalytics: () => request('/analytics/conflicts'),
  getRoomAnalytics: () => request('/analytics/rooms'),
  getStudentDemographics: () => request('/analytics/students'),

  // Students
  getStudents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/students${query ? `?${query}` : ''}`);
  },
  getStudentFilters: () => request('/students/filters'),
  getStudentById: (id) => request(`/students/${id}`),
  createStudent: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),
  importStudentsCSV: (csvText) => request('/students/import', { method: 'POST', body: JSON.stringify({ csvText }) }),

  // Rooms
  getRooms: () => request('/rooms'),
  getRoomById: (id) => request(`/rooms/${id}`),
  createRoom: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateRoom: (id, data) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),

  // Exams
  getExams: () => request('/exams'),
  getExamById: (id) => request(`/exams/${id}`),
  createExam: (data) => request('/exams', { method: 'POST', body: JSON.stringify(data) }),
  updateExam: (id, data) => request(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExam: (id) => request(`/exams/${id}`, { method: 'DELETE' }),

  // Seating
  generateSeating: (data) => request('/seating/generate', { method: 'POST', body: JSON.stringify(data) }),
  getSeatingPlans: () => request('/seating'),
  getSeatingPlanById: (id) => request(`/seating/${id}`),
  deleteSeatingPlan: (id) => request(`/seating/${id}`, { method: 'DELETE' }),
  getExportCSVUrl: (id) => `${BASE_URL}/seating/${id}/export-csv`,
};
