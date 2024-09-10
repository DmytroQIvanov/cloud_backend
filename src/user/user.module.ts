import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { UserEntity } from '../database/entities/user.entity';

@Module({
  imports: [MinioClientModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
