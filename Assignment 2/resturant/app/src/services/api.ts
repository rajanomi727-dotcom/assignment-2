import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Replace with your machine's local IP (run `ipconfig` / `ifconfig`)
// Example: http://192.168.1.42:5000
// For Android emulator use: http://10.0.2.2:5000
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = 'http://YOUR_LOCAL_IP:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

export interface UserProfile {
  id:    number;
  name:  string;
  email: string;
  phone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?:   T;
  message?: string;
}

/** Fetch the single user profile */
export async function fetchProfile(): Promise<UserProfile> {
  const { data } = await api.get<ApiResponse<UserProfile>>('/profile');
  if (!data.success || !data.data) throw new Error(data.message ?? 'Failed to fetch profile');
  return data.data;
}

/** Update the single user profile */
export async function updateProfile(
  payload: Omit<UserProfile, 'id'>
): Promise<UserProfile> {
  const { data } = await api.put<ApiResponse<UserProfile>>('/profile', payload);
  if (!data.success || !data.data) throw new Error(data.message ?? 'Failed to update profile');
  return data.data;
}
