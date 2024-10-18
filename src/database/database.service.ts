import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { MinioClientService } from '../minio-client/minio-client.service';
import { FileService } from '../file/file.service';

@Injectable()
export class DatabaseService {
  constructor(private fileService: FileService) {}

  getAll() {
    return this.fileService.findAll();
  }

  // async addOne({
  //   id,
  //   link,
  //   fileSize,
  //   originalName,
  //   mimetype,
  //   encoding,
  //   blurHash,
  //   smallImageId,
  //   smallFileSize,
  // }: {
  //   id: string;
  //   link: any;
  //   fileSize: number;
  //   originalName: any;
  //   mimetype: any;
  //   encoding: any;
  //   blurHash: any;
  //   smallImageId: any;
  //   smallFileSize: any;
  // }): Promise<any> {
  //   return await this.fileService.addOne({
  //     id,
  //     link,
  //     fileSize,
  //     originalName,
  //     mimetype,
  //     encoding,
  //     blurHash,
  //     smallImageId,
  //   });
  // }
  //
  // async addUserFile({
  //   id,
  //   fileSize,
  //   originalName,
  //   mimetype,
  //   encoding,
  //   blurHash,
  //   smallImageId,
  //   smallFileSize,
  //   user,
  // }: {
  //   id: string;
  //   fileSize: number;
  //   originalName: any;
  //   mimetype: any;
  //   encoding: any;
  //   blurHash: any;
  //   smallImageId: any;
  //   smallFileSize: any;
  //   user: any;
  // }): Promise<any> {
  //   return await this.fileService.addUserFile({
  //     id,
  //     user,
  //     fileSize,
  //     originalName,
  //     mimetype,
  //     encoding,
  //     blurHash,
  //     smallImageId,
  //   });
  // }
}
