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

// ---- Notes API ----

export const fetchNotes = async (params = {}) => {
  const response = await API.get("/notes", { params });
  return response.data;
};

export const fetchNoteById = async (id) => {
  const response = await API.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (data) => {
  const response = await API.post("/notes", data);
  return response.data;
};

export const updateNote = async (id, data) => {
  const response = await API.put(`/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await API.delete(`/notes/${id}`);
  return response.data;
};
