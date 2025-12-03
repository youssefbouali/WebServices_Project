import { ProfileService } from './ProfileService';
import { ProfileRole } from '../entities/Profile';
import { validateOrReject } from 'class-validator';

// 1. Mock la validation pour éviter les erreurs "unknownValue"
jest.mock('class-validator', () => {
  const actual = jest.requireActual('class-validator');
  return {
    ...actual,
    validateOrReject: jest.fn().mockResolvedValue(undefined),
  };
});

// 🧩 2. Fonction pour simuler le repository TypeORM
function mockRepo() {
  return {
    create: jest.fn((v) => v),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
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
      id: '507f1f77bcf86cd799439011',
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
    const updated = await svc.update('507f1f77bcf86cd799439011', { firstName: 'New' });

    expect(updated.firstName).toBe('New');
    expect(repo.save).toHaveBeenCalled();
  });

  it('validateCredentials returns null when profile not found', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue(null);
    const svc = new ProfileService(repo);
    const result = await svc.validateCredentials('no@user.com', 'x');
    expect(result).toBeNull();
  });

  it('validateCredentials returns null when inactive', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue({
      email: 'a@a.com',
      isActive: false,
      passwordHash: 'h',
    });
    const svc = new ProfileService(repo);
    const result = await svc.validateCredentials('a@a.com', 'x');
    expect(result).toBeNull();
  });

  it('validateCredentials returns null when missing passwordHash', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue({
      email: 'a@a.com',
      isActive: true,
    });
    const svc = new ProfileService(repo);
    const result = await svc.validateCredentials('a@a.com', 'x');
    expect(result).toBeNull();
  });

  it('validateCredentials returns profile when password correct', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue({
      email: 'a@a.com',
      isActive: true,
      passwordHash: 'h',
    });
    const svc = new ProfileService(repo);
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    const result = await svc.validateCredentials('a@a.com', 'pw');
    expect(result?.email).toBe('a@a.com');
  });

  it('validateCredentials returns null when password wrong', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue({
      email: 'a@a.com',
      isActive: true,
      passwordHash: 'h',
    });
    const svc = new ProfileService(repo);
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    const result = await svc.validateCredentials('a@a.com', 'pw');
    expect(result).toBeNull();
  });

  it('listAll applies filters', async () => {
    const repo = mockRepo();
    repo.find.mockResolvedValue([]);
    const svc = new ProfileService(repo);
    await svc.listAll(ProfileRole.Doctor, true);
    expect(repo.find).toHaveBeenCalledWith({ where: { role: ProfileRole.Doctor, isActive: true } });
  });

  it('remove throws when not found', async () => {
    const repo = mockRepo();
    repo.findOneBy.mockResolvedValue(null);
    const svc = new ProfileService(repo);
    await expect(svc.remove('507f1f77bcf86cd799439011')).rejects.toThrow('Profile not found');
  });

  it('remove calls repository when found', async () => {
    const repo = mockRepo();
    const p = { id: '507f1f77bcf86cd799439011' };
    repo.findOneBy.mockResolvedValue(p);
    repo.remove.mockResolvedValue(undefined);
    const svc = new ProfileService(repo);
    await svc.remove('507f1f77bcf86cd799439011');
    expect(repo.remove).toHaveBeenCalledWith(p);
  });

  it('updatePassword hashes and saves', async () => {
    const repo = mockRepo();
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');
    const profile = { id: '507f1f77bcf86cd799439011', passwordHash: 'old' };
    repo.findOneBy.mockResolvedValue(profile);
    repo.save.mockResolvedValue(profile);
    const svc = new ProfileService(repo);
    await svc.updatePassword('507f1f77bcf86cd799439011', 'newpass');
    expect(profile.passwordHash).toBe('hashed');
    expect(repo.save).toHaveBeenCalledWith(profile);
  });

  it('getStatistics returns counts', async () => {
    const repo = mockRepo();
    repo.find.mockResolvedValue([
      { role: ProfileRole.Patient, isActive: true },
      { role: ProfileRole.Doctor, isActive: false },
      { role: ProfileRole.Admin, isActive: true },
      { role: ProfileRole.Patient, isActive: false },
    ]);
    const svc = new ProfileService(repo);
    const stats = await svc.getStatistics();
    expect(stats.total).toBe(4);
    expect(stats.patients).toBe(2);
    expect(stats.doctors).toBe(1);
    expect(stats.admins).toBe(1);
    expect(stats.active).toBe(2);
  });
});
