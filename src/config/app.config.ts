import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT,
  prefix: process.env.API_PREFIX,
  backendDomain: process.env.BACKEND_DOMAIN,
  frontendDomain: process.env.FRONTEND_DOMAIN,
}));
