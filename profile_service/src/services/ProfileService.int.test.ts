import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataSource } from 'typeorm';
import { Profile, ProfileRole } from '../entities/Profile';
import { ProfileService } from './ProfileService';

let mongo: MongoMemoryServer;
let ds: InstanceType<typeof DataSource>;
let svc: ProfileService;

// Increase timeout for first run (MongoDB binary download)
jest.setTimeout(120000); // 2 minutes

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  ds = new DataSource({
    type: 'mongodb',
    url: mongo.getUri(),
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    entities: [Profile],
  });
  await ds.initialize();
  svc = new ProfileService(ds.getMongoRepository(Profile));
});

afterAll(async () => {
  if (ds?.isInitialized) await ds.destroy();
  if (mongo) await mongo.stop();
});

test('create & getByEmail', async () => {
  await svc.create({
    email: 'p@p.com',
    firstName: 'P',
    lastName: 'Q',
    role: ProfileRole.Patient,
  });
  const found = await svc.getByEmail('p@p.com');
  expect(found?.email).toBe('p@p.com');
});

test('listByRole filter', async () => {
  await svc.create({
    email: 'd@d.com',
    firstName: 'D',
    lastName: 'R',
    role: ProfileRole.Doctor,
  });
  const doctors = await svc.listByRole(ProfileRole.Doctor);
  expect(doctors.length).toBeGreaterThan(0);
});