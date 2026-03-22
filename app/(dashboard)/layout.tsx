'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Users, Settings, Menu, X, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';
import { useWorkspaceStore } from '@/stores/workspace-store';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loadUser, logout } = useAuthStore();
  const { projects, fetchProjects } = useWorkspaceStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const workspaceId = user?.memberships[0]?.workspaceId;
    if (workspaceId) fetchProjects(workspaceId);
  }, [user]);

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-50 border-r border-slate-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <span className="text-base font-bold text-slate-900">Todo Platform</span>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-200',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* Projects list */}
        <div className="pt-4">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Projects
          </p>
          {projects.length === 0 && (
            <p className="px-3 py-2 text-xs text-slate-400">No projects yet</p>
          )}
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === `/projects/${project.id}`
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-700 hover:bg-slate-200',
              )}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: project.color ?? '#6366f1' }}
              />
              <span className="truncate">{project.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* User + logout */}
      <div className="border-t border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name ?? '?'} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name ?? '—'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 transition-transform duration-200 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-4">
          <button
            className="lg:hidden p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
