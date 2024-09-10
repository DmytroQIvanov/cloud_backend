import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkEntity } from '../database/entities/link.entity';
import { FileService } from '../file/file.service';
import { FileEntity } from '../database/entities/file.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { MinioClientService } from '../minio-client/minio-client.service';
import { DatabaseService } from '../database/database.service';
import { MinioModule, MinioService } from 'nestjs-minio-client';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkEntity, FileEntity]),
    MinioClientModule,
    FileUploadModule,
    FileModule,
  ],
  providers: [
    LinkService,
    // FileUploadService,
    // MinioClientService,
    // DatabaseService,
    // MinioService,
    // FileService,
  ],
  controllers: [LinkController],
})
export class LinkModule {}
