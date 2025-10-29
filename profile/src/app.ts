import { AppDataSource } from './data-source';
import { Profile } from './entities/Profile';
import { ProfileService } from './services/ProfileService';

export async function createProfileService(): Promise<ProfileService> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getMongoRepository(Profile);
  return new ProfileService(repo);
}


