import { Injectable } from '@nestjs/common';
import { LinkEntity } from '../database/entities/link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Cron } from '@nestjs/schedule';
import { FileService } from '../file/file.service';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkEntity)
    private linkEntityRepository: Repository<LinkEntity>,
    private fileUploadService: FileUploadService,
    private fileService: FileService,
    private minioService: MinioClientService,
  ) {}

  async createLink() {
    let result = await this.linkEntityRepository.create({
      name: 'test',
      files: [],
      willDeleteAt: new Date(new Date().setHours(new Date().getHours() + 1)),
      // willDeleteAt: new Date(
      //   new Date().setSeconds(new Date().getSeconds() + 60),
      // ),
    });
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

  async addFile({ files, linkId }: { files: any[]; linkId: any }) {
    let Link: LinkEntity;
    let newLink: Boolean = false;
    if (linkId) {
      try {
        Link = await this.linkEntityRepository.findOne({
          where: { id: linkId },
          relations: { files: true },
        });
      } catch (e) {
        Link = await this.createLink();
        newLink = true;
      }
    }
    // console.log('LINK', Link);
    if (!Link) {
      Link = await this.createLink();
      newLink = true;
    }

    let uploadedFiles: FileEntity[] = [];
    for (const file of files) {
      await uploadedFiles.push(
        await this.fileUploadService.uploadSingle(file, Link),
      );
    }
    console.log(Link.files, Link);
    Link.files.push(...uploadedFiles);

    await this.linkEntityRepository.save(Link);
    const test1 = new Date(
      new Date().setHours(new Date().getHours() - 1),
    ).getTime();
    const test2 = new Date(
      new Date().setHours(new Date().getHours()),
    ).getTime();
    return {
      test1: { test1, test2, test3: new Date(1725649362727).toDateString() },
      date: new Date(),
      Link,
      linkCode: Link.id,
      filesList: Link.files,
      newLink,
    };
    //
  }

  async getLinkFiles({ id }: { id: number }) {
    const linkWithFiles: any = await this.linkEntityRepository.findOne({
      where: { id },
      relations: { files: true },
    });
    // console.log('getLinkFiles', linkWithFiles);
    if (!linkWithFiles) return;
    for (const [index, file] of linkWithFiles.files.entries()) {
      // console.log('index', index);
      linkWithFiles.files[index].url =
        await this.fileUploadService.getSingleUrl(file.fileId);
    }
    return linkWithFiles;
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
    allLinkEntities.map(async (entity: LinkEntity) => {
      if (new Date().getTime() >= entity.willDeleteAt.getTime()) {
        console.log('deleteOldLinkF - DELETING');

        for (const file of entity.files) {
          await this.minioService.delete(file.fileId);
          // await this.fileService.deleteOne(file.id);
        }
        this.linkEntityRepository.delete(entity.id);
      }
    });
  }
}
