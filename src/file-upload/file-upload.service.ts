import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { DatabaseService } from '../database/database.service';
import { LinkFileEntity } from "../database/entities/Link/linkFile.entity";

@Injectable()
export class FileUploadService {
  constructor(
    private minioClientService: MinioClientService,
    private databaseService: DatabaseService,
  ) {}

  // async uploadSingle(file: BufferedFile, link): Promise<LinkFileEntity> {
  //   const uploaded_image = await this.minioClientService.upload(file);
  //   const res = await this.databaseService.addOne({
  //     id: uploaded_image.fileName,
  //     link,
  //     fileSize: uploaded_image.fileSize,
  //     smallFileSize: uploaded_image.fileSize,
  //     originalName: uploaded_image.originalName,
  //     mimetype: uploaded_image.mimetype,
  //     encoding: uploaded_image.encoding,
  //     blurHash: uploaded_image.blurHash,
  //     smallImageId:uploaded_image.smallImageId
  //   });
  //
  //   return res;
  // }


  // async uploadSingleUserFile(file: BufferedFile, user): Promise<LinkFileEntity> {
  //   const uploaded_image = await this.minioClientService.upload(file);
  //   const res = await this.databaseService.addUserFile({
  //     id: uploaded_image.fileName,
  //     user,
  //     fileSize: uploaded_image.fileSize,
  //     smallFileSize: uploaded_image.fileSize,
  //     originalName: uploaded_image.originalName,
  //     mimetype: uploaded_image.mimetype,
  //     encoding: uploaded_image.encoding,
  //     blurHash: uploaded_image.blurHash,
  //     smallImageId:uploaded_image.smallImageId
  //   });
  //
  //   return res;
  // }


  // async uploadInstrumentFiles(file: BufferedFile, user): Promise<LinkFileEntity> {
  //   const uploaded_image = await this.minioClientService.upload(file);
  //   const res = await this.databaseService.addUserFile({
  //     id: uploaded_image.fileName,
  //     user,
  //     fileSize: uploaded_image.fileSize,
  //     smallFileSize: uploaded_image.fileSize,
  //     originalName: uploaded_image.originalName,
  //     mimetype: uploaded_image.mimetype,
  //     encoding: uploaded_image.encoding,
  //     blurHash: uploaded_image.blurHash,
  //     smallImageId:uploaded_image.smallImageId
  //   });
  //
  //   return res;
  // }

  async getAll2() {
    return await this.databaseService.getAll();
  }
  async getSingleUrl(id: any) {
    const uploaded_imageUrl = await this.minioClientService.getSingleUrl(id);

    return {
      file_url: uploaded_imageUrl,
      // message: 'Successfully uploaded to MinIO S322222222',
    };
  }

  async getAllUrl(quantity = 20) {
    const result = await this.databaseService.getAll();
    const allUrlRes = [];

    for (const item of result) {
      const uploaded_imageUrl = await this.minioClientService.getSingleUrl(
        item.fileId,
      );
      console.log('uploaded_imageUrl', uploaded_imageUrl);
      allUrlRes.push({ image_url: uploaded_imageUrl });
    }
    // await result.forEach(async (elem) => {
    //   });
    console.log('result', result);
    // let uploaded_imageUrl = await this.minioClientService.getSingleUrl(id);

    return allUrlRes;
  }
}
