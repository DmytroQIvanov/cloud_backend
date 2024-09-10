import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UserService } from './user.service';

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

  @Get('/get-all-users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
