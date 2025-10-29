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
      svc.create({ email: 'a@a.com', firstName: 'A', lastName: 'B', role: ProfileRole.Patient })
    ).rejects.toThrow('Email already exists');
  });

  it('create success', async () => {
    const repo = mockRepo();
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue({ id: '1', email: 'x@x.com' });
    const svc = new ProfileService(repo);

    const res = await svc.create({
      email: 'x@x.com',
      firstName: 'X',
      lastName: 'Y',
      role: ProfileRole.Doctor,
    });
    expect(res.email).toBe('x@x.com');
  });
});


