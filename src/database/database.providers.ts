import { DataSource } from 'typeorm';
import { FileEntity } from './entities/file.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: '192.168.0.101',
        port: 5432,
        username: 'user',
        password: 'admin',
        database: 'postgres',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
