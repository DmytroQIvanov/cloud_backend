import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import { config } from './confing';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = config.MINIO_BUCKET;

  public get client(): any {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioStorageService');
  }

  async createBlurHash({ file }) {
    console.log('createBlurHash', file);
    const resizedImg = await sharp(file.buffer)
      .resize(45, 30)
      .blur()
      .toBuffer();
    const base64str = Buffer.from(resizedImg).toString('base64');

    const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
      

      <image preserveAspectRatio='none' x='0' y='0' height='100%' width='100%' 
      href='data:image/avif;base64,${base64str}' />
    </svg>
  `;

    const toBase64 = (str) =>
      typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);

    return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
  }
  public async upload(
    file: BufferedFile,
    baseBucket: string = this.baseBucket,
  ) {
    console.log('UPLOAD', file);
    // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
    //   throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    // }
    let temp_filename = Date.now().toString();
    let hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    let filename = hashedFileName + ext;
    console.log('filename', filename);
    const fileName: string = `${filename}`;
    const fileBuffer = file.buffer;
    console.log('TEST', baseBucket, fileName, metaData);
    const result = await this.client.putObject(
      baseBucket,
      fileName,
      fileBuffer,
      metaData,
      function (err, res) {
        if (err) {
          console.log(err);
          console.log(res);
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    console.log('1111', file);

    let blurHash;
    if (file.mimetype.includes('image')) {
      blurHash = await this.createBlurHash({ file });
    }

    return {
      // url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`,
      fileName,
      fileSize: file.size,
      originalName: file.originalname,
      mimetype: file.mimetype,
      encoding: file.encoding,
      blurHash,
    };
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objetName, function (err, res) {
      if (err)
        throw new HttpException(
          'Oops Something wrong happend',
          HttpStatus.BAD_REQUEST,
        );
    });
  }

  async getSingleUrl(objectName: string, baseBucket: string = this.baseBucket) {
    const res = await this.minio.client.presignedUrl(
      'GET',
      baseBucket,
      objectName,
    );
    // console.log('res', res);
    return res;
  }
}
