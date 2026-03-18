import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/dummy-data';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="group block">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              {/* Color bar */}
              <div className="h-2 rounded-t-xl" style={{ backgroundColor: project.color }} />
              <CardBody className="flex flex-col gap-3">
                <h2 className="font-semibold text-slate-900">{project.name}</h2>
                <p className="text-sm text-slate-500 flex-1">{project.description}</p>
                <span className="text-sm font-medium text-primary-600 group-hover:underline">
                  View →
                </span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
