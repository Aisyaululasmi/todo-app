import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './modules/auth/auth.router';
import workspacesRouter from './modules/workspaces/workspaces.router';
import projectsRouter from './modules/projects/projects.router';
import tasksRouter from './modules/tasks/tasks.router';
import tagsRouter from './modules/tags/tags.router';
import commentsRouter from './modules/comments/comments.router';

const app = express();
const PORT = process.env.PORT || 3001;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

app.use(cors({ origin: APP_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/workspaces/:workspaceId/projects', projectsRouter);
app.use('/api/workspaces/:workspaceId/tasks/:taskId/comments', commentsRouter);
app.use('/api/workspaces/:workspaceId/tasks', tasksRouter);
app.use('/api/workspaces/:workspaceId/tags', tagsRouter);

app.get('/', (_req, res) => res.json({ message: 'Todo Platform API', version: '1.0.0' }));
app.get('/api/ping', (_req, res) => res.json({ message: 'pong', timestamp: new Date().toISOString() }));
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_JSON', message: 'Request body contains invalid JSON' },
    });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  });
});

async function start() {
  // In development, spin up embedded PostgreSQL
  if (process.env.NODE_ENV !== 'production') {
    const { existsSync } = await import('fs');
    const { join } = await import('path');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const EmbeddedPostgres = require('embedded-postgres').default ?? require('embedded-postgres');

    const DB_DIR = 'C:/Users/T480s/AppData/Local/Temp/todo-pg-data';
    const pg = new EmbeddedPostgres({
      databaseDir: DB_DIR,
      user: 'postgres',
      password: 'postgres',
      port: 5432,
      persistent: true,
    });

    if (!existsSync(join(DB_DIR, 'PG_VERSION'))) {
      await pg.initialise();
    } else {
      console.log('Using existing database directory');
    }
    await pg.start();
    console.log('PostgreSQL started on port 5432');
    try {
      await pg.createDatabase('todo_platform');
      console.log('Database todo_platform created');
    } catch {
      console.log('Database todo_platform already exists');
    }
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err?.message ?? err);
  process.exit(1);
});
