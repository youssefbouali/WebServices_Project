import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Profile } from './entities/Profile';

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URL ?? 'mongodb://localhost:27017/healthtrack',
  synchronize: true, // seulement en dev; gérer les indexes manuellement en prod
  logging: process.env.NODE_ENV === 'development',
  entities: [Profile],
});
