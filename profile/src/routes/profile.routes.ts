import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { ProfileRole } from '../entities/Profile';

export function createProfileRouter(controller: ProfileController): Router {
  const router = Router();

  // Public routes
  router.post('/auth/register', controller.register.bind(controller));
  router.post('/auth/login', controller.login.bind(controller));

  // Protected routes - require authentication
  router.get('/me', authenticate, controller.getCurrentProfile.bind(controller));
  router.put('/me', authenticate, controller.updateCurrentProfile.bind(controller));
  router.put('/me/password', authenticate, controller.changePassword.bind(controller));

  // Admin only routes
  router.get('/', authenticate, authorize(ProfileRole.Admin), controller.list.bind(controller));
  router.get('/statistics', authenticate, authorize(ProfileRole.Admin), controller.statistics.bind(controller));
  router.get('/:id', authenticate, controller.getById.bind(controller));
  router.put('/:id', authenticate, authorize(ProfileRole.Admin), controller.update.bind(controller));
  router.delete('/:id', authenticate, authorize(ProfileRole.Admin), controller.remove.bind(controller));

  // Role-based queries
  router.get('/role/:role', authenticate, controller.listByRole.bind(controller));

  return router;
}
