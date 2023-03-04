import * as joi from 'joi';

const envValidationSchema = joi.object().keys({
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USER: joi.string().required(),
  DB_PASS: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_SYNC: joi.boolean().required(),
});
export default envValidationSchema;
