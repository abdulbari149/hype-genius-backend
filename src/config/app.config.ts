import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT,
  prefix: process.env.API_PREFIX,
}));
