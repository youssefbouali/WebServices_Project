import { MongoRepository } from 'typeorm';
import { Profile, ProfileRole } from '../entities/Profile';
import { validateOrReject } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { CreateProfileDto, UpdateProfileDto } from '../dto/profile.dto';

export class ProfileService {
  constructor(private readonly repo: MongoRepository<Profile>) {}

  async create(input: CreateProfileDto): Promise<Profile> {
    const exists = await this.repo.findOne({ where: { email: input.email } });
    if (exists) throw new Error('Email already exists');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const profile = this.repo.create({
      ...input,
      passwordHash,
    });

    await validateOrReject(profile);
    return this.repo.save(profile);
  }

  async findById(id: string): Promise<Profile | null> {
    try {
      return await this.repo.findOneBy({ _id: new ObjectId(id) } as any);
    } catch {
      return null;
    }
  }

  async getByEmail(email: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { email } });
  }

  async getByEmailWithPassword(email: string): Promise<Profile | null> {
    return this.repo.findOne({ 
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'passwordHash', 'isActive']
    });
  }

  async listAll(role?: ProfileRole, isActive?: boolean): Promise<Profile[]> {
    const where: any = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    
    return this.repo.find({ where });
  }

  async listByRole(role: ProfileRole): Promise<Profile[]> {
    return this.repo.find({ where: { role, isActive: true } });
  }

  async update(id: string, input: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findById(id);
    if (!profile) throw new Error('Profile not found');

    Object.assign(profile, input);
    await validateOrReject(profile);
    return this.repo.save(profile);
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const profile = await this.findById(id);
    if (!profile) throw new Error('Profile not found');

    profile.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.repo.save(profile);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ _id: new ObjectId(id) } as any);
    if (result.affected === 0) throw new Error('Profile not found');
  }

  async softDelete(id: string): Promise<Profile> {
    return this.update(id, { isActive: false });
  }

  async validateCredentials(email: string, password: string): Promise<Profile | null> {
    const profile = await this.getByEmailWithPassword(email);
    if (!profile || !profile.isActive) return null;

    const isValid = await bcrypt.compare(password, profile.passwordHash);
    return isValid ? profile : null;
  }

  async getStatistics(): Promise<{
    total: number;
    patients: number;
    doctors: number;
    admins: number;
    active: number;
  }> {
    const all = await this.repo.find();
    return {
      total: all.length,
      patients: all.filter(p => p.role === ProfileRole.Patient).length,
      doctors: all.filter(p => p.role === ProfileRole.Doctor).length,
      admins: all.filter(p => p.role === ProfileRole.Admin).length,
      active: all.filter(p => p.isActive).length,
    };
  }
}
