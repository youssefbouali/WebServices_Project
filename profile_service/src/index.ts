import 'reflect-metadata';
import { createProfileService } from './app';
import { ProfileRole } from './entities/Profile';

async function main() {
  const svc = await createProfileService();
  // Demo run: only when executed directly
  if (process.env.DEMO === '1') {
    const email = `demo_${Date.now()}@example.com`;
    await svc.create({ email, firstName: 'Demo', lastName: 'User', role: ProfileRole.Patient });
    const found = await svc.getByEmail(email);
    console.log('Created profile:', found?.email);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


