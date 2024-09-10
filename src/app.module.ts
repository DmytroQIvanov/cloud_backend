import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioClientModule } from './minio-client/minio-client.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';
import { DataSource } from 'typeorm';
import { FileEntity } from './database/entities/file.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './database/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { LinkModule } from './link/link.module';
import { LinkEntity } from './database/entities/link.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '193.160.226.130',
      port: 5432,
      username: 'user',
      password: 'admin',
      database: 'postgres',
      entities: [FileEntity, UserEntity, LinkEntity],
      synchronize: true,
    }),

    MinioClientModule,
    FileUploadModule,
    DatabaseModule,
    FileModule,
    UserModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
