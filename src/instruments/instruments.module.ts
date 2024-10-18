import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkEntity } from "../database/entities/Link/link.entity";
import { LinkFileEntity } from "../database/entities/Link/linkFile.entity";
import { UserFile } from "../database/entities/User/userFile.entity";
import { MinioClientModule } from "../minio-client/minio-client.module";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { FileModule } from "../file/file.module";
import { UserModule } from "../user/user.module";
import { LinkService } from "../link/link.service";
import { LinkController } from "../link/link.controller";
import { InstrumentsService } from "./instruments.service";
import { InstrumentsController } from "./instruments.controller";
import { InstrumentFileEntity } from "../database/entities/Instrument/instrumentFile.entity";
import { InstrumentFileContainerEntity } from "../database/entities/Instrument/InstrumentFileContainer.entity";
import { MutatedInstrumentFileEntity } from "../database/entities/Instrument/mutatedInstrumentFile.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([InstrumentFileEntity,InstrumentFileContainerEntity,MutatedInstrumentFileEntity]),
    FileModule,MinioClientModule,
    FileUploadModule
  ],
  providers: [
    InstrumentsService,
  ],
  controllers: [InstrumentsController],})
export class InstrumentsModule {

}
