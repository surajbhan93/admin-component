// app/admin/layout.tsx
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ✅ Middleware token check kar chuka hai, isliye yahan koi redirect/check nahi hai.
  // Sirf UI render karo.
  
  return (
    <div className="min-h-screen bg-[#0b0d17] text-white flex">
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0 z-40">
        <AdminSidebar />
      </div>
      <main className="flex-1 md:ml-64 min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}