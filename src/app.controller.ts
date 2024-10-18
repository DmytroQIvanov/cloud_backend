import {
  Body,
  Controller,
  Get, Ip,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Ip() ip,@Req() req): any {
    let resultIp = ip.toString()
    console.log("your ip", resultIp.replace("::ffff:",""));
    return {ip:resultIp.replace("::ffff:",'')}
    // console.log("your req", req);
    // return this.appService.getHello();
  }

  // @Post('/')
  // @UseInterceptors(FileInterceptor('file'))
  // test(@UploadedFile() file: any) {
  //   console.log('files', file);
  // }
}
