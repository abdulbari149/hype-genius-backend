import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  expiry: parseInt(process.env.REDIS_EXPIRY, 10),
  permissionsExpiry: parseInt(process.env.REDIS_PERMISSIONS_EXPIRY, 10),
  url: process.env.REDIS_URL,
}));
