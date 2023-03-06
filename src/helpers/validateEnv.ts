import * as joi from 'joi';

const envValidationSchema = joi.object().keys({
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USER: joi.string().required(),
  DB_PASS: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_SYNC: joi.boolean().required(),
  PORT: joi.number().required(),
  API_PREFIX: joi.string().required(),
});
export default envValidationSchema;
