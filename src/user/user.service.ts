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
import { UserEntity } from '../database/entities/User/user.entity';
import { Cron } from '@nestjs/schedule';
import { UserFile } from "../database/entities/User/userFile.entity";
import { FileUploadService } from "../file-upload/file-upload.service";
import { LinkEntity } from "../database/entities/Link/link.entity";
import { LinkFileEntity } from "../database/entities/Link/linkFile.entity";
import { FileService } from "../file/file.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,

    private fileUploadService: FileUploadService,
    private fileService: FileService,
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

  async createGuest() {
    // if (!email || !password) return;

    let user;
    try {
      user = await this.userEntityRepository.create();
    } catch (e) {
      throw new HttpException('Error creating user', HttpStatus.BAD_GATEWAY);
    }

    await this.userEntityRepository.save(user);
    return user;
  }

  async getUserByEmail({ email }: { email: string }) {
    console.log('Getting user');
    if (!email) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
    const { password, ...user } = await this.userEntityRepository.findOne({
      where: { email: email },
    });
    return user;
  }
  async addLinkToUser({
    linkEntity,
    userId,
  }: {
    linkEntity: any;
    userId: number;
  }) {
    const user = await this.userEntityRepository.findOne({
      where: { id: userId },
      relations: { links: true },
    });
    user.links = [...user.links, linkEntity];

    await this.userEntityRepository.save(user);
    return;
  }

  async getUserById({ id }: { id: number }) {
    console.log('Getting user', id);
    let resultUser: UserEntity;
    if (!id) {
      // throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
      resultUser = await this.createGuest();
    } else {
      resultUser = await this.userEntityRepository.findOne({
        // const { ...user } = await this.userEntityRepository.findOne({
        where: { id },
        relations: ['links', 'links.files', 'files'],
      });
    }

    if (resultUser) {
      const { password, ...user } = resultUser;
      return user;
    } else {
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);
    }
  }
  async getUserAllFiles({ id }: any) {
    let userFiles: UserFile[] = await this.userEntityRepository
      .findOne({ where: { id }, relations: { files: true } })
      .then((res) => res.files);

    console.log('userFiles', userFiles);
    let responseData: any = userFiles;
    for (const [index, file] of responseData.entries()) {
      // console.log('index', index);
      responseData[index].file_url = await this.fileUploadService
        .getSingleUrl(file.fileId)
        .then((element) => element.file_url);
      if (file?.fileId_small) {
        responseData[index].smallImg_url = await this.fileUploadService
          .getSingleUrl(file.fileId_small)
          .then((element) => element.file_url);
      }
    }

    return responseData;
  }

  async addFile({ files, userId }: { files: any[]; userId: any }) {
    // ------------
    // --- USER ---
    // ------------
    let user = userId
      ? await this.getUserById({ id: userId })
      : await this.createGuest();
    let newLink: boolean = false;
    const uploadedFiles: LinkFileEntity[] = [];
    for (const file of files) {
      await uploadedFiles.push(
        await this.fileService.addUserFile({ file, user }),
      );
      // Link.files.push(uploadedFile);
      // await this.linkEntityRepository.save(Link);
    }
    // console.log(Link.files, Link);
    user.files.push(...uploadedFiles);

    await this.userEntityRepository.save(user);
    return {
      date: new Date(),
      newLink,
      user,
      author: true,
    };
    //
  }
  async deleteUserFile({ userId, fileId }:any) {
    // if (!userId || !fileId) return;
    if (!fileId) return;

    let file;
    try {
      file = await this.fileService.deleteOneUser(fileId);
    } catch (e) {
      throw new HttpException('Error deleting file', HttpStatus.BAD_GATEWAY);
    }
    return {message:"file deleted"}

    // return await this.userEntityRepository.save(user);
  }

  async checkPassword() {}
  async generateToken() {}
  async getAllUsers() {
    return await this.userEntityRepository.find({ relations: { links: true } });
  }
}
