import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
const envFilePath = resolve(__dirname, `../../env/${process.env.NODE_ENV}.env`);
console.log(envFilePath);
config({
  path: envFilePath,
});

console.log(process.env);

export const app_data_source = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [resolve(__dirname, '../app/**/**/*.entity{.ts,.js}')],
  migrations: ['src/migrations/*.{ts,js}'],
});
app_data_source.initialize();
