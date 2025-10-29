import { Entity, ObjectIdColumn, Column, Index } from 'typeorm';
import type { ObjectId } from 'mongodb';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

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
  firstName!: string;

  @Column()
  @IsString()
  lastName!: string;

  @Column()
  @IsEnum(ProfileRole)
  role!: ProfileRole;

  @Column()
  @IsOptional()
  @IsString()
  phone?: string;
}
