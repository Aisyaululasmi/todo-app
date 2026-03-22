import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@todo.local' },
    update: {},
    create: {
      email: 'admin@todo.local',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log(`  Admin user: admin@todo.local (${admin.id})`)

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@todo.local' },
    update: {},
    create: {
      email: 'user@todo.local',
      name: 'Regular User',
      password: userPassword,
      role: 'MEMBER',
    },
  })
  console.log(`  Regular user: user@todo.local (${regularUser.id})`)

  // Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'A demo workspace with sample data',
    },
  })
  console.log(`  Workspace: Demo Workspace (${workspace.id})`)

  // Memberships
  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: admin.id } },
    update: {},
    create: { workspaceId: workspace.id, userId: admin.id, role: 'OWNER' },
  })
  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: regularUser.id } },
    update: {},
    create: { workspaceId: workspace.id, userId: regularUser.id, role: 'MEMBER' },
  })
  console.log('  Memberships created')

  // Tags
  const tagData = [
    { name: 'Bug', color: '#ef4444' },
    { name: 'Feature', color: '#3b82f6' },
    { name: 'Enhancement', color: '#8b5cf6' },
    { name: 'Urgent', color: '#f97316' },
    { name: 'Documentation', color: '#10b981' },
  ]
  const tags = await Promise.all(
    tagData.map((t) =>
      prisma.tag.create({ data: { ...t, workspaceId: workspace.id } })
    )
  )
  console.log(`  Tags: ${tags.map((t) => t.name).join(', ')}`)

  // Project
  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Product Launch',
      description: 'Q2 product launch campaign',
      color: '#6366f1',
      status: 'ACTIVE',
    },
  })
  console.log(`  Project: Product Launch`)

  // Project members
  await prisma.projectMember.createMany({
    data: [
      { projectId: project.id, userId: admin.id, role: 'OWNER' },
      { projectId: project.id, userId: regularUser.id, role: 'MEMBER' },
    ],
    skipDuplicates: true,
  })

  // Lists
  const listNames = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done']
  const lists = await Promise.all(
    listNames.map((name, position) =>
      prisma.list.create({ data: { projectId: project.id, name, position } })
    )
  )
  console.log(`  Lists: ${listNames.join(', ')}`)

  const [backlog, todo, inProgress, inReview, done] = lists

  // Tasks (15 total)
  const taskDefs: Array<{
    title: string
    description: string
    listId: string
    priority: TaskPriority
    status: TaskStatus
    position: number
    tagIndexes: number[]
  }> = [
    { title: 'Define product requirements', description: 'Write the PRD for the Q2 launch', listId: done.id, priority: 'HIGH', status: 'DONE', position: 0, tagIndexes: [1, 4] },
    { title: 'Design system architecture', description: 'Plan the backend and frontend architecture', listId: done.id, priority: 'HIGH', status: 'DONE', position: 1, tagIndexes: [1] },
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated deployments', listId: inReview.id, priority: 'MEDIUM', status: 'IN_REVIEW', position: 0, tagIndexes: [2] },
    { title: 'Implement authentication', description: 'JWT-based auth with refresh tokens', listId: inReview.id, priority: 'HIGH', status: 'IN_REVIEW', position: 1, tagIndexes: [1] },
    { title: 'Build task board UI', description: 'Drag-and-drop kanban board component', listId: inProgress.id, priority: 'HIGH', status: 'IN_PROGRESS', position: 0, tagIndexes: [1, 2] },
    { title: 'API rate limiting', description: 'Add Redis-based rate limiting to all endpoints', listId: inProgress.id, priority: 'MEDIUM', status: 'IN_PROGRESS', position: 1, tagIndexes: [2] },
    { title: 'Fix login redirect bug', description: 'Users are not redirected after login on mobile', listId: inProgress.id, priority: 'URGENT', status: 'IN_PROGRESS', position: 2, tagIndexes: [0, 3] },
    { title: 'Write API documentation', description: 'Document all REST endpoints with examples', listId: todo.id, priority: 'MEDIUM', status: 'TODO', position: 0, tagIndexes: [4] },
    { title: 'Add email notifications', description: 'Send email on task assignment and due date', listId: todo.id, priority: 'LOW', status: 'TODO', position: 1, tagIndexes: [1, 2] },
    { title: 'User profile settings page', description: 'Allow users to update name, avatar, and password', listId: todo.id, priority: 'MEDIUM', status: 'TODO', position: 2, tagIndexes: [1] },
    { title: 'Dark mode support', description: 'Implement dark/light theme toggle', listId: backlog.id, priority: 'LOW', status: 'TODO', position: 0, tagIndexes: [2] },
    { title: 'Mobile responsive layout', description: 'Ensure all pages work on small screens', listId: backlog.id, priority: 'MEDIUM', status: 'TODO', position: 1, tagIndexes: [2] },
    { title: 'Export tasks to CSV', description: 'Allow exporting project tasks as CSV file', listId: backlog.id, priority: 'LOW', status: 'TODO', position: 2, tagIndexes: [1] },
    { title: 'Integrate Slack notifications', description: 'Post updates to Slack channels on task changes', listId: backlog.id, priority: 'LOW', status: 'TODO', position: 3, tagIndexes: [1, 2] },
    { title: 'Performance audit', description: 'Run Lighthouse and fix all critical issues', listId: backlog.id, priority: 'MEDIUM', status: 'TODO', position: 4, tagIndexes: [0, 2] },
  ]

  const createdTasks = await Promise.all(
    taskDefs.map(({ tagIndexes, ...def }) =>
      prisma.task.create({
        data: {
          ...def,
          creatorId: admin.id,
          assignees: { create: { userId: regularUser.id } },
          tags: {
            create: tagIndexes.map((i) => ({ tagId: tags[i].id })),
          },
        },
      })
    )
  )
  console.log(`  Created ${createdTasks.length} tasks`)

  // Subtasks (3)
  await prisma.subtask.createMany({
    data: [
      { taskId: createdTasks[4].id, title: 'Design board layout', completed: true, position: 0 },
      { taskId: createdTasks[4].id, title: 'Implement drag-and-drop', completed: false, position: 1 },
      { taskId: createdTasks[3].id, title: 'Set up refresh token rotation', completed: false, position: 0 },
    ],
  })
  console.log('  Created 3 subtasks')

  // Comments (3)
  await prisma.comment.createMany({
    data: [
      { taskId: createdTasks[4].id, userId: admin.id, body: 'Using @dnd-kit for drag-and-drop — lightweight and accessible.' },
      { taskId: createdTasks[6].id, userId: regularUser.id, body: 'Reproduced on iOS Safari 17. Looks like a cookie issue.' },
      { taskId: createdTasks[3].id, userId: admin.id, body: 'Refresh tokens will be stored in httpOnly cookies.' },
    ],
  })
  console.log('  Created 3 comments')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
