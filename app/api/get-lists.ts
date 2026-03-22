import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.list.findMany({ orderBy: { position: 'asc' }, select: { id: true, name: true } })
  .then(r => { console.log(JSON.stringify(r)); })
  .finally(() => prisma.$disconnect());
