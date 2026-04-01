import * as joi from 'joi';

const envValidationSchema = joi.object().keys({
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USER: joi.string().required(),
  DB_PASS: joi.string().required(),
  DB_NAME: joi.string().required(),
  /** Set to "true" for Supabase / managed Postgres (TLS). Omit or "false" for local Docker. */
  DB_SSL: joi.string().valid('true', 'false').optional(),
  /** Connection pool max (use a small value on Vercel, e.g. 5). */
  DB_POOL_MAX: joi.number().optional(),
  DB_SYNC: joi.boolean().required(),
  PORT: joi.number().required(),
  API_PREFIX: joi.string().required(),
  BACKEND_DOMAIN: joi.string().required(),
  FRONTEND_DOMAIN: joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES: joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES: joi.string().required(),
  JWT_ONBOARDING_TOKEN_SECRET: joi.string().required(),
  JWT_ONBOARDING_TOKEN_EXPIRES: joi.string().required(),
  REDIS_EXPIRY: joi.number().required(),
  REDIS_PERMISSIONS_EXPIRY: joi.number().required(),
  REDIS_URL: joi.string().required(),
});
export default envValidationSchema;
