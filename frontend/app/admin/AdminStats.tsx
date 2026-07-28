// components/admin/AdminStats.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, Briefcase, DollarSign } from 'lucide-react';

export default function AdminStats() {
  const [stats, setStats] = useState({ models: 0, admins: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Api call (token interceptor se auto add ho jayega)
        const res = await api.get('/admin/stats'); 
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Models', value: stats.models, icon: Users, color: 'bg-blue-500/10 text-blue-400' },
    { title: 'Total Admins', value: stats.admins, icon: Briefcase, color: 'bg-purple-500/10 text-purple-400' },
    { title: 'Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'bg-green-500/10 text-green-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <h3 className="text-3xl font-bold mt-2 text-white">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}