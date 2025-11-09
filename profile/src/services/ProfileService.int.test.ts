import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataSource } from 'typeorm';
import { Profile, ProfileRole } from '../entities/Profile';
import { ProfileService } from './ProfileService';

let mongo: MongoMemoryServer;
let ds: DataSource;
let svc: ProfileService;

// Augmente le timeout pour le premier lancement (téléchargement MongoDB)
jest.setTimeout(120000); // 2 minutes

beforeAll(async () => {
  // 🔹 Création d'un serveur MongoDB en mémoire
  mongo = await MongoMemoryServer.create();

  // 🔹 Configuration DataSource TypeORM (TypeORM 3+)
  ds = new DataSource({
    type: 'mongodb',
    url: mongo.getUri(),
    synchronize: true,           // synchronise les entities
    logging: false,
    entities: [Profile],
  });

  await ds.initialize();

  // 🔹 Création du service avec le repository MongoDB
  svc = new ProfileService(ds.getMongoRepository(Profile));
});

afterAll(async () => {
  if (ds?.isInitialized) await ds.destroy();
  if (mongo) await mongo.stop();
});

describe('ProfileService Integration Tests', () => {

  test('create & getByEmail', async () => {
    const profile = await svc.create({
      email: 'p@p.com',
      firstName: 'P',
      lastName: 'Q',
      role: ProfileRole.Patient,
      password: 'password123',
    });

    expect(profile.email).toBe('p@p.com');

    const found = await svc.getByEmail('p@p.com');
    expect(found?.email).toBe('p@p.com');
    expect(found?.firstName).toBe('P');
  });

  test('listByRole filter', async () => {
    await svc.create({
      email: 'd@d.com',
      firstName: 'D',
      lastName: 'R',
      role: ProfileRole.Doctor,
      password: 'password123',
    });

    const doctors = await svc.listByRole(ProfileRole.Doctor);
    expect(doctors.length).toBeGreaterThan(0);
    expect(doctors[0].role).toBe(ProfileRole.Doctor);
  });

  test('validateCredentials - correct password', async () => {
    await svc.create({
      email: 'auth@test.com',
      firstName: 'Auth',
      lastName: 'Test',
      role: ProfileRole.Patient,
      password: 'correctpassword',
    });

    const validated = await svc.validateCredentials('auth@test.com', 'correctpassword');
    expect(validated).not.toBeNull();
    expect(validated?.email).toBe('auth@test.com');
  });

  test('validateCredentials - wrong password', async () => {
    const validated = await svc.validateCredentials('auth@test.com', 'wrongpassword');
    expect(validated).toBeNull();
  });

});
