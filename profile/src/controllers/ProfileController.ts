import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { generateToken } from '../middleware/auth.middleware';
import { CreateProfileDto, LoginDto, ProfileResponseDto, UpdateProfileDto } from '../dto/profile.dto';
import { Profile, ProfileRole } from '../entities/Profile';

/**
 * Contrôleur des profils: gère l'inscription, l'authentification,
 * les opérations sur le profil courant, les requêtes admin et basées sur les rôles.
 */
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  /**
   * Transforme une entité Profile en DTO envoyé au client.
   */
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
      res.status(201).json({ profile: this.toResponseDto(profile), token });
    } catch (error: any) {
      if (Array.isArray(error)) {
        const details = error.map(e => ({
          property: e.property,
          constraints: e.constraints,
        }));
        return res.status(422).json({ error: "Validation failed", details });
      }
      return res.status(400).json({ error: error?.message || "Bad Request" });
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

  // CORRIGÉ: Remplacez AuthRequest par Request
  async getCurrentProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const profile = await this.service.findById(userId);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(this.toResponseDto(profile));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // CORRIGÉ: Remplacez AuthRequest par Request
  async updateCurrentProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const dto: UpdateProfileDto = req.body;
      const profile = await this.service.update(userId, dto);
      res.json(this.toResponseDto(profile));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // CORRIGÉ: Remplacez AuthRequest par Request
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;
      
      if (!userId || !userEmail) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { currentPassword, newPassword } = req.body;
      
      const profile = await this.service.validateCredentials(userEmail, currentPassword);
      if (!profile) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      await this.service.updatePassword(userId, newPassword);
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

  // AJOUT: Méthode pour récupérer les patients
  async getPatients(req: Request, res: Response) {
    try {
      const patients = await this.service.listByRole(ProfileRole.Patient);
      res.json(patients.map(p => this.toResponseDto(p)));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
