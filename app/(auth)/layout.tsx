'use client';

import { CheckSquare } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Branding */}
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-600">
          <CheckSquare className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Todo Platform</h1>
        <p className="text-sm text-slate-500">Manage your tasks and projects</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
