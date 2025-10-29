import { MongoRepository } from 'typeorm';
import { Profile, ProfileRole } from '../entities/Profile';
import { validateOrReject } from 'class-validator';

export interface CreateProfileInput {
  email: string;
  firstName: string;
  lastName: string;
  role: ProfileRole;
  phone?: string;
}

export class ProfileService {
  constructor(private readonly repo: MongoRepository<Profile>) {}

  async create(input: CreateProfileInput): Promise<Profile> {
    const profile = this.repo.create(input);
    await validateOrReject(profile);
    const exists = await this.repo.findOne({ where: { email: input.email } });
    if (exists) throw new Error('Email already exists');
    return this.repo.save(profile);
  }

  async getByEmail(email: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { email } });
  }

  async listByRole(role?: ProfileRole): Promise<Profile[]> {
    if (!role) return this.repo.find();
    return this.repo.find({ where: { role } });
  }

  async updateEmail(id: string, newEmail: string): Promise<Profile> {
    const { ObjectId } = await import('mongodb');
    const profile = await this.repo.findOneBy({ _id: new ObjectId(id) } as any);
    if (!profile) throw new Error('Profile not found');
    profile.email = newEmail;
    await validateOrReject(profile);
    return this.repo.save(profile);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }
}


