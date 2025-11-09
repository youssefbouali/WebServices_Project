import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { Profile } from './entities/Profile';
import { ProfileService } from './services/ProfileService';
import { ProfileRole } from './entities/Profile';

async function createProfileService(): Promise<ProfileService> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getMongoRepository(Profile);
  return new ProfileService(repo);
}

async function main() {
  const svc = await createProfileService();
  
  // Demo run: only when executed directly
  if (process.env.DEMO === '1') {
    const email = `demo_${Date.now()}@example.com`;
    await svc.create({ 
      email, 
      firstName: 'Demo', 
      lastName: 'User', 
      role: ProfileRole.Patient,
      password: 'demo123',
    });
    const found = await svc.getByEmail(email);
    console.log('Created profile:', found?.email);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});