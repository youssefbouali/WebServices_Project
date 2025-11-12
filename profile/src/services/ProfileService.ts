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
      isActive: true, // ✅ FIX: Set isActive to true by default
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
    // ✅ FIX: Use findOne with proper selection
    return this.repo.findOne({ 
      where: { email },
    });
  }

  async listAll(role?: ProfileRole, isActive?: boolean): Promise<Profile[]> {
    const where: any = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    
    return this.repo.find({ where });
  }

  async listByRole(role: ProfileRole): Promise<Profile[]> {
    // ✅ FIX: Don't filter by isActive here, return all users with that role
    return this.repo.find({ where: { role } });
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
    // Supprimer de façon sûre un seul document en chargeant l'entité
    const profile = await this.findById(id);
    if (!profile) throw new Error('Profile not found');
    await this.repo.remove(profile);
  }

  async softDelete(id: string): Promise<Profile> {
    return this.update(id, { isActive: false });
  }

  async validateCredentials(email: string, password: string): Promise<Profile | null> {
    // ✅ FIX: Properly fetch profile with password hash
    const profile = await this.getByEmailWithPassword(email);
    
    console.log('Login attempt:', {
      email,
      profileFound: !!profile,
      isActive: profile?.isActive,
      hasPasswordHash: !!profile?.passwordHash,
    });

    if (!profile) {
      console.log('Profile not found for email:', email);
      return null;
    }

    if (!profile.isActive) {
      console.log('Profile is inactive');
      return null;
    }

    // ✅ FIX: Ensure passwordHash exists before comparing
    if (!profile.passwordHash) {
      console.error('No password hash found for profile');
      return null;
    }

    const isValid = await bcrypt.compare(password, profile.passwordHash);
    console.log('Password validation result:', isValid);

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