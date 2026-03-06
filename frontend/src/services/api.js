import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// ---- Problem API ----

export const fetchProblems = async (params = {}) => {
  const response = await API.get("/problems", { params });
  return response.data;
};

export const fetchProblemById = async (id) => {
  const response = await API.get(`/problems/${id}`);
  return response.data;
};

export const createProblem = async (data) => {
  const response = await API.post("/problems", data);
  return response.data;
};

export const updateProblem = async (id, data) => {
  const response = await API.put(`/problems/${id}`, data);
  return response.data;
};

export const deleteProblem = async (id) => {
  const response = await API.delete(`/problems/${id}`);
  return response.data;
};
