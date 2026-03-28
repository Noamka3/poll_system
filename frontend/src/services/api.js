import axios from "axios";

const api = axios.create({
baseURL:import.meta.env.VITE_API_URL,
});

export const getAllPolls = () => api.get("/polls");
export const getPollById = (id) => api.get(`/polls/${id}`);
export const createPoll = (data) => api.post("/polls", data);
export const vote = (pollId, data) => api.post(`/polls/${pollId}/vote`, data);
export const getPollResults = (pollId) => api.get(`/polls/${pollId}/results`);