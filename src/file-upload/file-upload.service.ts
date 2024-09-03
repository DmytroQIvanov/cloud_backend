import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadSingle(image: BufferedFile) {
    let uploaded_image = await this.minioClientService.upload(image);

    return {
      ...uploaded_image,
      image_url: uploaded_image.url,
      message: 'Successfully uploaded to MinIO S3',
    };
  }

  async getSingleUrl(id: any) {
    let uploaded_imageUrl = await this.minioClientService.getSingleUrl(id);

    return {
      image_url: uploaded_imageUrl,
      message: 'Successfully uploaded to MinIO S322222222',
    };
  }
}
