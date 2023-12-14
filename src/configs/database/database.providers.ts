import { createConnection } from 'typeorm';
import { MYSQL_CONFIG } from '../constant.config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      createConnection({
        type: 'mysql',
        host: MYSQL_CONFIG.host,
        port: 3306,
        username: MYSQL_CONFIG.username,
        password: MYSQL_CONFIG.password,
        database: MYSQL_CONFIG.database,
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      }),
  },
];
