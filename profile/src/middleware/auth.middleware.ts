import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ProfileRole } from '../entities/Profile';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123!';

// SUPPRIMEZ complètement l'interface AuthRequest - elle cause l'erreur
// export interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     email: string;
//     role: ProfileRole;
//   };
// }

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: ProfileRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const generateToken = (id: string, email: string, role: ProfileRole): string => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' });
};