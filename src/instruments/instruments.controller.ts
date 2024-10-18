import { Body, Controller, Get, Param, Post, Query, Request, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { LinkService } from "../link/link.service";
import { InstrumentsService } from "./instruments.service";

@Controller('instruments')
export class InstrumentsController {
  constructor(private instrumentsService:  InstrumentsService) {}

  @Post('/add-file')
  @UseInterceptors(AnyFilesInterceptor())
  addFile(@UploadedFiles() files: any[], @Query() query: any, @Body() body) {
    console.log('files', files, query, body);
    if (!files) return;
    return this.instrumentsService.addFile({
      files,
      containerId: query?.containerId,
    });
  }

  @Post('/resize-image/:containerId')
  resizeImage(@Param() query: any,@Body() body){
    console.log('resize image', body);
    if (!query?.containerId) return;
    // console.log(query);

    return this.instrumentsService.resizeImage({
      containerId: query?.containerId,
      options:body?.modifications,
      instrument:body?.instrument
    })
  }

  @Get('/:containerId')
  getContainer(@Param() query: any) {
    if (!query?.containerId) return;
    return this.instrumentsService.getContainer({
      containerId: query?.containerId,
    });
  }
}
