import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),

  LOCAL_DB_HOST: Joi.string().default('localhost'),
  LOCAL_DB_PORT: Joi.number().default(3306),
  LOCAL_DB_USERNAME: Joi.string().default('root'),
  LOCAL_DB_PASSWORD: Joi.string().default(''),
  LOCAL_DB_DATABASE: Joi.string().default('restaurant'),

  PROD_DB_HOST: Joi.string().default('localhost'),
  PROD_DB_PORT: Joi.number().default(3306),
  PROD_DB_USERNAME: Joi.string().default('root'),
  PROD_DB_PASSWORD: Joi.string().default(''),
  PROD_DB_DATABASE: Joi.string().default('restaurant'),

  TYPEORM_SYNCHRONIZE: Joi.boolean().default(true),
});
