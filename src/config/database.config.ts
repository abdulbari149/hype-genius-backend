import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  sync: process.env.DB_SYNC == 'true' ? true : false,
  name: process.env.DB_NAME,
}));
