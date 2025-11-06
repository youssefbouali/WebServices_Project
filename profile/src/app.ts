import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { Profile } from './entities/Profile';
import { ProfileService } from './services/ProfileService';
import { ProfileController } from './controllers/ProfileController';
import { createProfileRouter } from './routes/profile.routes';

export async function createApp() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'profile-service' });
  });

  // Profile routes
  const repo = AppDataSource.getMongoRepository(Profile);
  const service = new ProfileService(repo);
  const controller = new ProfileController(service);
  const profileRouter = createProfileRouter(controller);

  app.use('/api/profiles', profileRouter);

  // Error handling
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
