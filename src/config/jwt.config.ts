import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
  },
  refresh: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
  },
}));
