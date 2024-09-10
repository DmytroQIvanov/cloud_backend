import { Controller, Get, Post } from '@nestjs/common';
import { FileUploadService } from '../file-upload/file-upload.service';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private DatabaseService: DatabaseService) {}
  @Get()
  getAll() {
    return this.DatabaseService.getAll();
  }

  // @Post()
  // addOne() {
  //   return this.DatabaseService.addOne({ id: test });
  // }
}
