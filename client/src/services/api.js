import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
});


export const getJobs = () => API.get('/api/jobs');
export const createJob = (data) => API.post('/api/jobs', data);
export const updateJob = (id, data) => API.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/api/jobs/${id}`);