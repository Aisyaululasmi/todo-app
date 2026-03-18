import { AlertTriangle, CheckSquare, Clock, FolderKanban, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { currentUser, dashboardStats, projects } from '@/lib/dummy-data';

const stats = [
  {
    label: 'Total Projects',
    value: dashboardStats.totalProjects,
    icon: FolderKanban,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  {
    label: 'Total Tasks',
    value: dashboardStats.totalTasks,
    icon: CheckSquare,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  {
    label: 'Due Soon',
    value: dashboardStats.dueSoon,
    icon: Clock,
    color: dashboardStats.dueSoon > 0 ? 'text-amber-600' : 'text-slate-600',
    bg: dashboardStats.dueSoon > 0 ? 'bg-amber-100' : 'bg-slate-100',
  },
  {
    label: 'Overdue',
    value: dashboardStats.overdue,
    icon: AlertTriangle,
    color: dashboardStats.overdue > 0 ? 'text-red-600' : 'text-slate-600',
    bg: dashboardStats.overdue > 0 ? 'bg-red-100' : 'bg-slate-100',
  },
  {
    label: 'Completed This Week',
    value: dashboardStats.completedThisWeek,
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Welcome back, {currentUser.name}!</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardBody className="flex flex-col gap-3 p-4">
              <div className={`w-fit rounded-lg p-2 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Projects</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardBody className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 shrink-0 rounded"
                    style={{ backgroundColor: project.color }}
                  />
                  <h3 className="font-medium text-slate-900 truncate">{project.name}</h3>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
