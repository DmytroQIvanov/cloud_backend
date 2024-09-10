import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() image: BufferedFile) {
    // return await this.fileUploadService.uploadSingle(image);
  }

  @Get('/all')
  async getAll(@Param() params: any) {
    console.log('params', params);
    return await this.fileUploadService.getAllUrl();
  }
  @Get('/:id')
  async getSingle(@Param() params: any) {
    console.log('params', params);
    return await this.fileUploadService.getSingleUrl(params.id);
  }
}
