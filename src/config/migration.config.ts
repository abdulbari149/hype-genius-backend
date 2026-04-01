import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

/** Paths assume CLI is run from the backend package root (e.g. `npm run migration:up`). */
const root = process.cwd();

const envFilePath = resolve(root, '.env');
config({
  path: envFilePath,
});

export const app_data_source = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [resolve(root, 'src/app/**/**/*.entity{.ts,.js}')],
  migrations: ['src/migrations/*.{ts,js}'],
  ssl: {
    rejectUnauthorized: false,
  },
  logging: true,
  
});
app_data_source.initialize();
