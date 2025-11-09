import { ProfileService } from './ProfileService';
import { ProfileRole } from '../entities/Profile';
import { validateOrReject } from 'class-validator';

// 🧩 1. Mock la validation pour éviter les erreurs "unknownValue"
jest.mock('class-validator', () => ({
  validateOrReject: jest.fn().mockResolvedValue(undefined),
}));

// 🧩 2. Fonction pour simuler le repository TypeORM
function mockRepo() {
  return {
    create: jest.fn((v) => v),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  } as any;
}

// 🧩 3. Début de la suite de tests
describe('ProfileService (unit)', () => {
  
  // === Test 1 : email déjà existant ===
  it('create rejects duplicated email', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue({ email: 'a@a.com' });
    const svc = new ProfileService(repo);

    await expect(
      svc.create({
        email: 'a@a.com',
        firstName: 'A',
        lastName: 'B',
        role: ProfileRole.Patient,
        password: 'password123',
      })
    ).rejects.toThrow('Email already exists');
  });

  // === Test 2 : création réussie ===
  it('create success', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue({
      id: '1',
      email: 'x@x.com',
      firstName: 'X',
      lastName: 'Y',
      role: ProfileRole.Doctor,
    });

    const svc = new ProfileService(repo);

    const res = await svc.create({
      email: 'x@x.com',
      firstName: 'X',
      lastName: 'Y',
      role: ProfileRole.Doctor,
      password: 'password123',
    });

    expect(res.email).toBe('x@x.com');
    expect(repo.save).toHaveBeenCalled();
  });

  // === Test 3 : mise à jour réussie ===
  it('update profile success', async () => {
    const repo = mockRepo();

    const mockProfile = {
      id: '123',
      email: 'test@test.com',
      firstName: 'Old',
      lastName: 'Name',
      role: ProfileRole.Patient,
      phone: '1234567890',
    };

    // 🧩 selon ton implémentation dans ProfileService.findById()
    // si tu utilises repo.findOneBy({ id }), garde cette ligne :
    repo.findOneBy.mockResolvedValue(mockProfile);

    // sinon, si tu utilises repo.findOne({ where: { id } }), remplace par :
    // repo.findOne.mockResolvedValue(mockProfile);

    repo.save.mockImplementation((profile: Record<string, any>) =>
      Promise.resolve(profile)
    );

    const svc = new ProfileService(repo);
    const updated = await svc.update('123', { firstName: 'New' });

    expect(updated.firstName).toBe('New');
    expect(repo.save).toHaveBeenCalled();
  });
});
