// app/admin/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Update State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/admin/profile/me');
        if (res.data.success) {
          setProfile(res.data.data);
          setName(res.data.data.name);
          setPhone(res.data.data.phone);
        }
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/admin/profile/me', { name, phone });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setProfile(res.data.data);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/admin/change-password', { currentPassword, newPassword });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

      {message.text && (
        <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/50'}`}>
          {message.text}
        </div>
      )}

      {/* Update Profile Form */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Update Details</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email (Read Only)</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-bold transition-colors">
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
              required
            />
          </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded font-bold transition-colors">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}