import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { UserEntity } from '../database/entities/User/user.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileModule } from '../file/file.module';
import { LinkFileEntity } from '../database/entities/Link/linkFile.entity';
import { UserFile } from '../database/entities/User/userFile.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { FileService } from "../file/file.service";

@Module({
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([UserEntity, FileEntity, UserFile,LinkFileEntity]),
    FileModule,
    FileUploadModule,
    // FileService
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
