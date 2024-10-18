import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { FileUploadService } from '../file-upload/file-upload.service';
import { UserService } from './user.service';
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create-user')
  createUser(@Body() params: any) {
    console.log(params);
    if (!params.password || !params.email) return;
    this.userService.createUser({
      email: params.email,
      password: params.password,
    });
  }

  @Get('/get-user')
  getUser(@Query() query) {
    console.log(query);
    // return {'s':'s'}
    return this.userService.getUserById({id: query.userId});
  }

  @Get('/get-user-files')
  getUserFiles(@Query() query) {
    console.log(query);
    // return {'s':'s'}
    return this.userService.getUserAllFiles({id: query.userId});
  }

  @Post('/add-user-files')
  @UseInterceptors(AnyFilesInterceptor())
  addUserFiles(@Query() query,@UploadedFiles() files: any[]) {
    console.log(query);
    console.log('files---',files);
    // return {'s':'s'}
    return this.userService.addFile({userId: query.userId,files});
  }

  @Get('/ip')
  getUserIp(@Ip() ip,@Req() req){


    console.log(req.ip,req.connection.remoteAddress,req.headers['x-forwarded-for']);

    let resultIp = ip.toString()
    console.log("your ip", resultIp.replace("::ffff:",""));
    return {ip:resultIp.replace("::ffff:",'')}
    // const userIp= ip.slice
    // return {ip}
  }

  @Get('/get-all-users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }


  @Delete('/file/:fileId')
  deleteLinkFile(@Param() params: any, @Query() query: any) {
    console.log('params', params);
    console.log('query', query);
    return this.userService.deleteUserFile({
      // userId: params.userId,
      fileId: params.fileId,
    });
  }


}
