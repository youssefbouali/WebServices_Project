import { Entity, ObjectIdColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { ObjectId } from 'mongodb';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export enum ProfileRole {
  Patient = 'PATIENT',
  Doctor = 'DOCTOR',
  Admin = 'ADMIN',
}

@Entity('profiles')
export class Profile {
  @ObjectIdColumn()
  id!: ObjectId;

  @Index({ unique: true })
  @Column()
  @IsEmail()
  email!: string;

  @Column()
  @IsString()
  @MinLength(2)
  firstName!: string;

  @Column()
  @IsString()
  @MinLength(2)
  lastName!: string;

  @Column()
  @IsEnum(ProfileRole)
  role!: ProfileRole;

  @Column()
  @IsOptional()
  @IsString()
  phone?: string;

  @Column()
  @IsOptional()
  @IsString()
  maladieChronique?: string;

  // ✅ FIX: Remove select: false to allow password retrieval for validation
  @Column()
  @IsString()
  @MinLength(6)
  passwordHash!: string;

  @Column()
  @IsBoolean()
  isActive!: boolean; // ✅ Make sure this is not optional

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}