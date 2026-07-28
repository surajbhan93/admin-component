// app/admin/dashboard/page.tsx
'use client'; // ✅ Sabse IMPORTANT: Isko Client Component bana diya

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy Loaded Components (Client Components)
const AdminStats = dynamic(() => import('@/components/admin/AdminSidebar'), {
  loading: () => <StatsSkeleton />,
  // ✅ Next.js 15 mein Server Component ke andar ssr:false nahi chalega.
  // Isliye pure page ko 'use client' bana diya, ab yeh safe hai.
});

const RecentModels = dynamic(() => import('@/components/admin/AdminSidebar'), {
  loading: () => <TableSkeleton />,
});

// Skeleton Loaders
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4 animate-pulse mt-8">
    <div className="h-10 bg-gray-800 rounded w-full"></div>
    <div className="h-64 bg-gray-800 rounded w-full"></div>
  </div>
);

export default function AdminDashboardPage() {
  // Middleware token check kar chuka hai, isliye yahan token lene ki zaroorat nahi.
  // Components apne aap API call kar lenge.

  return (
    <div className="min-h-screen bg-black text-white p-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-sm">Welcome back, Super Admin</p>
      </div>

      {/* Lazy Loaded Stats Component */}
      <Suspense fallback={<StatsSkeleton />}>
        <AdminStats />
      </Suspense>

      {/* Lazy Loaded Recent Models Table */}
      <Suspense fallback={<TableSkeleton />}>
        <RecentModels />
      </Suspense>
    </div>
  );
}