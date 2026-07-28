import axios from 'axios';

export const api = axios.create({
  // ⚠️ FIX 1: 5000 se 3004 kiya (backend port)
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Cookies ko allow karne ke liye (Zaroori hai)
});

// ⚠️ FIX 2: Duplicate interceptor ko hata kar, ek hi interceptor mein dono conditions handle karo
api.interceptors.request.use((config) => {
  let token = null;

  // 1. Server Side (Next.js Server Components / Route Handlers)
  if (typeof window === 'undefined') {
    // IMPORTANT: 'next/headers' sirf Server Components mein kaam karta hai.
    // Agar yeh file kisi Client Component mein import hui, toh error aayega.
    // Isliye try-catch mein wrap karna safe hai.
    try {
      const { cookies } = require('next/headers');
      const cookieStore = cookies();
      token = cookieStore.get('accessToken')?.value;
    } catch (error) {
      // Server side par agar 'next/headers' available nahi hai toh ignore kar do
    }
  } 
  // 2. Client Side (Browser)
  else {
    token = localStorage.getItem('accessToken');
  }

  // Agar token mila, toh header mein daal do
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});