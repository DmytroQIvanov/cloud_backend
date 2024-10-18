import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LinkEntity } from '../database/entities/Link/link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Cron } from '@nestjs/schedule';
import { FileService } from '../file/file.service';
import { MinioClientService } from '../minio-client/minio-client.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../database/entities/User/user.entity';
import { LinkFileEntity } from "../database/entities/Link/linkFile.entity";
// import fluent from "fluent-ffmpeg";

const availableHours = 3
@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkEntity)
    private linkEntityRepository: Repository<LinkEntity>,
    private fileUploadService: FileUploadService,
    private fileService: FileService,
    private minioService: MinioClientService,
    private userService: UserService,
  ) {}

  async createLink({ user }: { user: any }) {
    const result = await this.linkEntityRepository.create({
      name: 'test',
      files: [],
      willDeleteAt: new Date(new Date().setHours(new Date().getHours() + availableHours)),
      user: await this.userService.getUserById({ id: user.id }),
      // willDeleteAt: new Date(
      //   new Date().setSeconds(new Date().getSeconds() + 60),
      // ),
    });

    // await this.userService.addLinkToUser({linkEntity:result,userId:user.id})

    await this.linkEntityRepository.save(result);
    return result;
  }
  async checkAvailableLink({ linkId }: { linkId: number }) {
    const result = await this.linkEntityRepository.findOne({
      where: { id: linkId },
    });
    if (result) {
    }
  }
  async getFile({ fileId }: { fileId: number }) {
    console.log('fileId', fileId);
    if (!fileId)
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    return await this.fileService.getSingleFile(fileId);
  }

  async addFile({
    files,
    linkId,
    userId,
  }: {
    files: any[];
    linkId: any;
    userId: any;
  }) {
    console.log('linkId', linkId);
    console.log('userId', linkId);
    // ------------
    // --- USER ---
    // ------------
    let user = userId ?
       await this.userService.getUserById({ id: userId }) :
       await this.userService.createGuest()
    let Link: LinkEntity;
    let newLink: boolean = false;
    if (linkId) {
      try {
        Link = await this.linkEntityRepository.findOne({
          where: { id: linkId },
          relations: { files: true ,user:true},
        });

      } catch (e) {
        Link = await this.createLink({ user });
        newLink = true;
      }
    }
    if (!Link) {
      Link = await this.createLink({ user });
      newLink = true;
    }
    if (Link.user.id!==user.id){
      throw new HttpException("Заборонено", HttpStatus.FORBIDDEN);
      return
    }

    const uploadedFiles: LinkFileEntity[] = [];
    for (const file of files) {
      // if(file.mimetype.includes('video')){
      //   console.log('test',fluent(file))
      // }
      // let uploadedFile =
      //   await this.fileUploadService.uploadSingle(file, Link);
      await uploadedFiles.push(await this.fileService.addOne({ file, link:Link }));
      // Link.files.push(uploadedFile);
      // await this.linkEntityRepository.save(Link);

    }
    // console.log(Link.files, Link);
    Link.files.push(...uploadedFiles);

    await this.linkEntityRepository.save(Link);
    return {
      date: new Date(),
      Link,
      linkCode: Link.id,
      filesList: Link.files,
      newLink,
      user,
      author:true
    };
    //
  }
  async getAll() {
    const res = await this.linkEntityRepository.find({
      relations: { files: true },
    });
    return res;
  }

  async getPresignedUrl({fileName}){
    let result = await this.minioService.getPresignedUrl({fileName});
    return result;

  }

  async getLinkFiles({ id, userId }: { id: number; userId: number }) {
    const linkWithFiles: LinkEntity = await this.linkEntityRepository.findOne({
      where: { id },
      relations: { files: true,user:true },
    });
    if (!linkWithFiles) return;
    let responseData:any = linkWithFiles
    for (const [index, file] of linkWithFiles.files.entries()) {
      // console.log('index', index);
      responseData.files[index].file_url =
        await this.fileUploadService.getSingleUrl(file.fileId).then(element => element.file_url);
      if(file?.fileId_small) {
        responseData.files[index].smallImg_url =
          await this.fileUploadService.getSingleUrl(file.fileId_small).then(element => element.file_url);
      }
    }
    let user;
    if (userId) user = await this.userService.getUserById({ id: userId });
    console.log({ ...linkWithFiles, user,author:linkWithFiles.user.id===user?.id });
    return { ...linkWithFiles, user,author:linkWithFiles.user.id===user?.id };
  }
  async deleteLinkFile({ id, fileId }: { id: number; fileId }) {
    await this.minioService.delete(fileId);
    await this.fileService.deleteOne(fileId);
    return;
  }

  @Cron('*/60 * * * * *')
  async deleteOldLink() {
    console.log('deleteOldLinkF');
    const allLinkEntities = await this.linkEntityRepository.find({
      relations: { files: true },
    });
    for (const linkEntity of allLinkEntities) {
      if (new Date().getTime() >= linkEntity.willDeleteAt.getTime()) {
        console.log('deleteOldLinkF - DELETING');

        for (const file of linkEntity.files) {
          await this.minioService.delete(file.fileId);
          file?.fileId_small && await this.minioService.delete(file.fileId_small);
          file?.fileId_middle && await this.minioService.delete(file.fileId_middle);
          // await this.fileService.deleteOne(file.id);
        }
        await this.linkEntityRepository.delete(linkEntity.id);
      }
    }
  }
}
