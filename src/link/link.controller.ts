import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Post('/add-file')
  @UseInterceptors(AnyFilesInterceptor())
  addFile(@UploadedFiles() files: any[], @Query() query: any, @Body() body) {
    console.log('files', files, query, body);
    if (!files) return;
    return this.linkService.addFile({
      files,
      linkId: query.id,
      userId: query.userId,
    });
  }

  @Get('/presignedUrl')
  getPresignedUrl(@Query() query, @Param() params) {
    console.log(query);
    return this.linkService.getPresignedUrl({fileName:query.fileName});
  }
  @Get('/')
  getAll(@Param() params: any) {
    console.log('params', params);
    return this.linkService.getAll();
  }
  @Get('/:id')
  getLinkFiles(@Param() params: any, @Query() query) {
    console.log('params', params);
    return this.linkService.getLinkFiles({
      id: params.id,
      userId: query.userId,
    });
  }
  @Get('/file/:id')
  getFile(@Query() query, @Param() params) {
    return this.linkService.getFile({ fileId: params.id });
  }

  @Delete('/:id')
  deleteLinkFile(@Param() params: any, @Query() query: any) {
    console.log('params', params);
    console.log('query', query);
    return this.linkService.deleteLinkFile({
      id: params.id,
      fileId: query.fileId,
    });
  }
}
