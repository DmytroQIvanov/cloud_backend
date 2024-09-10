import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import { DatabaseService } from '../database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
  ) {}
  async createUser({ email, password }) {
    if (!email || !password) return;

    let user;
    try {
      user = await this.userEntityRepository.create({ email, password });
    } catch (e) {
      throw new HttpException('Error creating user', HttpStatus.BAD_GATEWAY);
      return;
    }

    return await this.userEntityRepository.save(user);
  }

  async getUser() {
    console.log('Getting user');
  }
  async checkPassword() {}
  async generateToken() {}
  async getAllUsers() {
    return await this.userEntityRepository.find();
  }
}
