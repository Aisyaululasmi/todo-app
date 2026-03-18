export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  description: string;
};

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  assigneeId: string;
};

export type DashboardStats = {
  totalProjects: number;
  totalTasks: number;
  dueSoon: number;
  overdue: number;
  completedThisWeek: number;
};

export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: null,
};

export const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatarUrl: null },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatarUrl: null },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', avatarUrl: null },
  { id: '4', name: 'Alice Chen', email: 'alice@example.com', avatarUrl: null },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: null },
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    color: '#6366f1',
    description: 'Redesign the company website with modern UI',
  },
  {
    id: 'p2',
    name: 'Mobile App',
    color: '#22c55e',
    description: 'Build the mobile application for iOS and Android',
  },
  {
    id: 'p3',
    name: 'Marketing Campaign',
    color: '#f59e0b',
    description: 'Q2 marketing campaign planning and execution',
  },
  {
    id: 'p4',
    name: 'API Integration',
    color: '#ef4444',
    description: 'Third-party API integrations and documentation',
  },
];

export const tasks: Task[] = [
  // BACKLOG (2)
  {
    id: 't1',
    title: 'Set up analytics dashboard',
    description: 'Integrate analytics tracking and build an internal reporting dashboard.',
    status: 'BACKLOG',
    priority: 'LOW',
    dueDate: '2026-04-15',
    projectId: 'p1',
    assigneeId: '3',
  },
  {
    id: 't2',
    title: 'Research push notification providers',
    description: 'Evaluate Firebase, OneSignal, and other push notification services.',
    status: 'BACKLOG',
    priority: 'NONE',
    dueDate: '2026-04-20',
    projectId: 'p2',
    assigneeId: '5',
  },
  // TODO (2)
  {
    id: 't3',
    title: 'Design homepage mockup',
    description: 'Create high-fidelity Figma mockups for the new homepage layout.',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-03-25',
    projectId: 'p1',
    assigneeId: '2',
  },
  {
    id: 't4',
    title: 'Plan Q2 campaign calendar',
    description: 'Draft the content calendar and campaign milestones for Q2.',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-03-28',
    projectId: 'p3',
    assigneeId: '4',
  },
  // IN_PROGRESS (3)
  {
    id: 't5',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-03-20',
    projectId: 'p4',
    assigneeId: '1',
  },
  {
    id: 't6',
    title: 'Build onboarding screens',
    description: 'Implement the user onboarding flow with animations for the mobile app.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    dueDate: '2026-03-19',
    projectId: 'p2',
    assigneeId: '3',
  },
  {
    id: 't7',
    title: 'Integrate Stripe payment API',
    description: 'Connect Stripe checkout and handle webhooks for subscription billing.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    dueDate: '2026-03-17',
    projectId: 'p4',
    assigneeId: '1',
  },
  // IN_REVIEW (3)
  {
    id: 't8',
    title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI 3.0 spec in Swagger.',
    status: 'IN_REVIEW',
    priority: 'MEDIUM',
    dueDate: '2026-03-22',
    projectId: 'p4',
    assigneeId: '2',
  },
  {
    id: 't9',
    title: 'Create social media ad creatives',
    description: 'Design banner ads and copy for LinkedIn and Instagram campaigns.',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    dueDate: '2026-03-21',
    projectId: 'p3',
    assigneeId: '5',
  },
  {
    id: 't10',
    title: 'Responsive navigation component',
    description: 'Build a fully responsive header and mobile hamburger menu.',
    status: 'IN_REVIEW',
    priority: 'MEDIUM',
    dueDate: '2026-03-23',
    projectId: 'p1',
    assigneeId: '4',
  },
  // DONE (2)
  {
    id: 't11',
    title: 'Competitor analysis report',
    description: 'Summarize findings from reviewing five competitor websites and apps.',
    status: 'DONE',
    priority: 'LOW',
    dueDate: '2026-03-14',
    projectId: 'p3',
    assigneeId: '2',
  },
  {
    id: 't12',
    title: 'Configure app signing certificates',
    description: 'Set up iOS and Android signing certificates for release builds.',
    status: 'DONE',
    priority: 'HIGH',
    dueDate: '2026-03-15',
    projectId: 'p2',
    assigneeId: '3',
  },
];

export const dashboardStats: DashboardStats = {
  totalProjects: 4,
  totalTasks: 12,
  dueSoon: 3,
  overdue: 1,
  completedThisWeek: 2,
};
