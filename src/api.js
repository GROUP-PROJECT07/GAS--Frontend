import axios from "axios";

const API = axios.create({
  baseURL: "https://gas-backend-qlfc.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("supabaseToken"); // store token after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const login = (email, password) =>
  API.post("/auth/login", { email, password });

// ---------- CORRESPONDENCE ----------
export const getCorrespondence = () =>
  API.get("/correspondence");

export const createCorrespondence = (formData) =>
  API.post("/correspondence", formData);

export const updateCorrespondence = (id, formData) =>
  API.put(`/correspondence/${id}`, formData);

export const deleteCorrespondence = (id) =>
  API.delete(`/correspondence/${id}`);

export const getCorrespondenceById = (id) =>
  API.get(`/correspondence/${id}`);

// ---------- USERS (Admin) ----------
export const getUsers = () =>
  API.get("/users");

export const createUser = (formData) =>
  API.post("/users", formData);

export const updateUser = (id, formData) =>
  API.put(`/users/${id}`, formData);

export const deleteUser = (id) =>
  API.delete(`/users/${id}`);

export default API;
