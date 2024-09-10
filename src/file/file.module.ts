import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
// import { fileProviders } from '../database/entities/file.providers';
// import { PhotoService } from './photo.service';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../database/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileService],
  exports: [TypeOrmModule, FileService],
})
export class FileModule {}
