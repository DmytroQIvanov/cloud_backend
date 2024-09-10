import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { DatabaseService } from '../database/database.service';
import { FileEntity } from '../database/entities/file.entity';

@Injectable()
export class FileUploadService {
  constructor(
    private minioClientService: MinioClientService,
    private databaseService: DatabaseService,
  ) {}

  async uploadSingle(file: BufferedFile, link): Promise<FileEntity> {
    let uploaded_image = await this.minioClientService.upload(file);
    let res = await this.databaseService.addOne({
      id: uploaded_image.fileName,
      link,
      fileSize: uploaded_image.fileSize,
      originalName: uploaded_image.originalName,
      mimetype: uploaded_image.mimetype,
      encoding: uploaded_image.encoding,
      blurHash: uploaded_image.blurHash,
    });

    return res;
  }

  async getSingleUrl(id: any) {
    let uploaded_imageUrl = await this.minioClientService.getSingleUrl(id);

    return {
      image_url: uploaded_imageUrl,
      // message: 'Successfully uploaded to MinIO S322222222',
    };
  }

  async getAllUrl(quantity = 20) {
    const result = await this.databaseService.getAll();
    let allUrlRes = [];

    for (const item of result) {
      let uploaded_imageUrl = await this.minioClientService.getSingleUrl(
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
