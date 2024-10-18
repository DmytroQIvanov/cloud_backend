import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
// import { fileProviders } from '../database/entities/file.providers';
// import { PhotoService } from './photo.service';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { LinkFileEntity } from "../database/entities/Link/linkFile.entity";
import { UserFile } from "../database/entities/User/userFile.entity";
import { InstrumentFileEntity } from "../database/entities/Instrument/instrumentFile.entity";
import { InstrumentFileContainerEntity } from "../database/entities/Instrument/InstrumentFileContainer.entity";
import { MutatedInstrumentFileEntity } from "../database/entities/Instrument/mutatedInstrumentFile.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity,LinkFileEntity,UserFile,InstrumentFileEntity,InstrumentFileContainerEntity,MutatedInstrumentFileEntity]), MinioClientModule],
  providers: [FileService],
  exports: [TypeOrmModule, FileService],
})
export class FileModule {}
