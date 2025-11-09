import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { AuthRequest, generateToken } from '../middleware/auth.middleware';
import { CreateProfileDto, LoginDto, ProfileResponseDto, UpdateProfileDto } from '../dto/profile.dto';
import { Profile, ProfileRole } from '../entities/Profile';

export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  private toResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id.toString(),
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      phone: profile.phone,
      maladieChronique: profile.maladieChronique,
      isActive: profile.isActive,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async register(req: Request, res: Response) {
    try {
      const dto: CreateProfileDto = req.body;
      const profile = await this.service.create(dto);
      const token = generateToken(profile.id.toString(), profile.email, profile.role);
      
      res.status(201).json({
        profile: this.toResponseDto(profile),
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginDto = req.body;
      const profile = await this.service.validateCredentials(email, password);
      
      if (!profile) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(profile.id.toString(), profile.email, profile.role);
      res.json({
        profile: this.toResponseDto(profile),
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCurrentProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await this.service.findById(req.user!.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(this.toResponseDto(profile));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCurrentProfile(req: AuthRequest, res: Response) {
    try {
      const dto: UpdateProfileDto = req.body;
      const profile = await this.service.update(req.user!.id, dto);
      res.json(this.toResponseDto(profile));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const profile = await this.service.validateCredentials(req.user!.email, currentPassword);
      if (!profile) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      await this.service.updatePassword(req.user!.id, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const role = req.query.role as ProfileRole | undefined;
      const isActive = req.query.isActive === 'true' ? true : 
                      req.query.isActive === 'false' ? false : undefined;
      
      const profiles = await this.service.listAll(role, isActive);
      res.json(profiles.map(p => this.toResponseDto(p)));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listByRole(req: Request, res: Response) {
    try {
      const role = req.params.role as ProfileRole;
      if (!Object.values(ProfileRole).includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const profiles = await this.service.listByRole(role);
      res.json(profiles.map(p => this.toResponseDto(p)));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const profile = await this.service.findById(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(this.toResponseDto(profile));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const dto: UpdateProfileDto = req.body;
      const profile = await this.service.update(req.params.id, dto);
      res.json(this.toResponseDto(profile));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      await this.service.remove(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async statistics(req: Request, res: Response) {
    try {
      const stats = await this.service.getStatistics();
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
