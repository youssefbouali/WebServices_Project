import { ProfileRole } from '../entities/Profile';

export interface CreateProfileDto {
  email: string;
  firstName: string;
  lastName: string;
  role: ProfileRole;
  phone?: string;
  password: string;
  maladieChronique?: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  maladieChronique?: string;
  isActive?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ProfileResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ProfileRole;
  phone?: string;
  maladieChronique?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
