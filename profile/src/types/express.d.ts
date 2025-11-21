import { Request } from 'express';
import { ProfileRole } from '../entities/Profile';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: ProfileRole;
      };
    }
  }
}