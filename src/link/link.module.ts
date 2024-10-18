import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkEntity } from '../database/entities/Link/link.entity';
import { FileEntity } from '../database/entities/file.entity';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';
import { LinkFileEntity } from "../database/entities/Link/linkFile.entity";
import { UserFile } from "../database/entities/User/userFile.entity";
import { FileService } from "../file/file.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkEntity, FileEntity,LinkFileEntity,UserFile,]),
    MinioClientModule,
    FileUploadModule,
    FileModule,
    UserModule,
    // FileService

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
