import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API calls
export const userApi = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  getUserById: (id) => api.get(`/users/${id}`),
};

// Department API calls
export const departmentApi = {
  getDepartments: () => api.get('/departments'),
  createDepartment: (departmentData) => api.post('/departments', departmentData),
  getDepartmentById: (id) => api.get(`/departments/${id}`),
};

// Forum API calls
export const forumApi = {
  getForums: () => api.get('/forums'),
  createForum: (forumData) => api.post('/forums', forumData),
  getForumById: (id) => api.get(`/forums/${id}`),
  createTopic: (forumId, topicData) => api.post(`/forums/${forumId}/topics`, topicData),
  createPost: (forumId, topicId, postData) => 
    api.post(`/forums/${forumId}/topics/${topicId}/posts`, postData),
};

export default api; 