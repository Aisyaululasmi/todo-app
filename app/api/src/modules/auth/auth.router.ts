import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { AppRequest } from '../../types';
import prisma from '../../lib/prisma';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(1, 'Name is required'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message },
      });
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: 'Email already in use' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { user } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name, password: hashedPassword },
      });

      const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + user.id.slice(0, 8);
      await tx.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          slug,
          members: { create: { userId: user.id, role: 'OWNER' } },
        },
      });

      return { user };
    });

    const { accessToken, refreshToken } = generateTokens(user.id);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message },
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' },
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' },
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    setRefreshCookie(res, refreshToken);

    return res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AppRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        workspaceMembers: {
          select: {
            workspaceId: true,
            role: true,
            workspace: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        memberships: user.workspaceMembers,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
  return res.json({ success: true, data: null });
});

export default router;
