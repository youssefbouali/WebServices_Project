import { ProfileService } from './ProfileService';
import { ProfileRole } from '../entities/Profile';

function mockRepo() {
  return {
    create: jest.fn((v) => v),
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  } as any;
}

describe('ProfileService (unit)', () => {
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
  });

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
    
    repo.findOneBy.mockResolvedValue(mockProfile);
    repo.save.mockImplementation((profile) => Promise.resolve(profile));
    
    const svc = new ProfileService(repo);
    const updated = await svc.update('123', { firstName: 'New' });
    
    expect(updated.firstName).toBe('New');
  });
});
