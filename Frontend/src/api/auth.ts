import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}

export async function register(name: string, email: string, password: string) {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
}

export default { login, register };
