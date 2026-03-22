import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppRequest } from '../types';

// Keep AuthRequest as an alias for backwards compat during transition
export type AuthRequest = AppRequest;

export function authenticate(req: AppRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' },
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
    });
  }
}
