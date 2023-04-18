import { resolve } from 'path';
import { config } from 'dotenv';
const envFilePath = resolve(__dirname, `../env/${process.env.NODE_ENV}.env`);

config({
  path: envFilePath,
});

/* eslint-disable prettier/prettier */
module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  migrations: ['/dist/migrations/*{.ts,.js}'],
  entities: ['src/app/**/*.entity.{ts,js}'],
};
