import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
// import { databaseProviders } from './database.providers';
import { FileEntity } from './entities/file.entity';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [FileModule],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService],
})
export class DatabaseModule {}
