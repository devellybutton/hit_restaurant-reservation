import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const get = <T>(key: string): T => configService.get<T>(key) as T;

  const isLocal = get<string>('NODE_ENV') === 'development';

  return {
    type: 'mysql',
    host: get<string>(isLocal ? 'LOCAL_DB_HOST' : 'PROD_DB_HOST'),
    port: get<number>(isLocal ? 'LOCAL_DB_PORT' : 'PROD_DB_PORT'),
    username: get<string>(isLocal ? 'LOCAL_DB_USERNAME' : 'PROD_DB_USERNAME'),
    password: get<string>(isLocal ? 'LOCAL_DB_PASSWORD' : 'PROD_DB_PASSWORD'),
    database: get<string>(isLocal ? 'LOCAL_DB_DATABASE' : 'PROD_DB_DATABASE'),
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
    migrationsTableName: 'migrations',
    synchronize: get<boolean>('TYPEORM_SYNCHRONIZE'),
    logging: isLocal,
    charset: 'utf8mb4',
  };
};
