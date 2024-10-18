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
import { UserEntity } from './database/entities/User/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { LinkModule } from './link/link.module';
import { LinkEntity } from './database/entities/Link/link.entity';
import { UserFile } from './database/entities/User/userFile.entity';
import { LinkFileEntity } from './database/entities/Link/linkFile.entity';
import { InstrumentsController } from './instruments/instruments.controller';
import { InstrumentsService } from './instruments/instruments.service';
import { InstrumentsModule } from './instruments/instruments.module';
import { InstrumentFileEntity } from './database/entities/Instrument/instrumentFile.entity';
import { InstrumentFileContainerEntity } from './database/entities/Instrument/InstrumentFileContainer.entity';
import { MutatedInstrumentFileEntity } from './database/entities/Instrument/mutatedInstrumentFile.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '193.160.226.130',
      // host: 'postgresql.quanticfiles.com',
      port: 5432,
      // port: 443,
      username: 'DmytroPg_user',
      password: 'dmytropg_user3331',
      database: 'quantic_cloud',
      entities: [
        FileEntity,
        UserEntity,
        LinkEntity,
        UserFile,
        LinkFileEntity,
        InstrumentFileEntity,
        InstrumentFileContainerEntity,
        MutatedInstrumentFileEntity,
      ],
      synchronize: true,
      // logging: true,

      // ssl: true,
      //
      // extra: {
      //   trustServerCertificate: true,
      // },
      // extra: {
      //   ssl:true,
      // },
    }),

    MinioClientModule,
    FileUploadModule,
    DatabaseModule,
    FileModule,
    UserModule,
    LinkModule,
    InstrumentsModule,
  ],
  controllers: [AppController, InstrumentsController],
  providers: [AppService, InstrumentsService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
