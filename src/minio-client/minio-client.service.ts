import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from './confing';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import * as sharp from 'sharp';

const sharpConfig = {
  jpeg: { quality: 80 },
  webp: { quality: 80 },
  png: { compressionLevel: 8 },
}
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

  async getPresignedUrl({fileName}){
    const presignedUrl = await this.client.presignedPutObject('cloud', fileName, 24 * 60 * 60)
    // console.log(presignedUrl)
    return presignedUrl
  }
  async createSmallImage({ file }): Promise<any> {
    let resizedImg: Buffer;
    resizedImg = await sharp(file.buffer).resize({ width: 600}).toBuffer();

    return resizedImg;
  }

  async createBlurHash({ file }) {
    // console.log('createBlurHash', file);
    let resizedImg;

    // if (file.mimetype == 'image/png') {
    //   return ;
    //
    //   // console.log("!!!!!!!!!!!!",resizedImg);
    // } else {
    resizedImg = await sharp(file.buffer)
      .withMetadata()
      .resize(45, 30)
      .blur()
      .toBuffer();
    // }
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
    const temp_filename = Date.now().toString() + crypto.randomUUID();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    ).replace(".",'');
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    // const filename = hashedFileName + ext;
    // console.log('filename', filename);
    const fileName: string = `${hashedFileName}`;
    const fileBuffer = file.buffer;
    let blurHash;
    let smallImageBuffer
    let resultSmallImage
    if (file.mimetype.includes('image')) {
      blurHash = await this.createBlurHash({ file });
      smallImageBuffer =await this.createSmallImage({file});
      // console.log('TEST', baseBucket, fileName, metaData);
       resultSmallImage = await this.client.putObject(
        baseBucket,
        fileName+"_small",
        smallImageBuffer,
        metaData,
        function (err, res) {
          if (err) {
            console.log('--- ERROR', err);
            throw new HttpException(
              'Error uploading file',
              HttpStatus.BAD_REQUEST,
            );
          }
          console.log('file UPLOADED!', res);
        },
      );

    }
    const result = await this.client.putObject(
      baseBucket,
      fileName,
      fileBuffer,
      metaData,
      function (err, res) {
        if (err) {
          console.log('--- ERROR', err);
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
        console.log('file UPLOADED!', res);
      },
    );
    // console.log('1111', result);



    return {
      // url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`,
      fileName,
      fileSize: file.size,
      originalName: file.originalname,
      mimetype: file.mimetype,
      encoding: file.encoding,
      blurHash,
      smallImageId:fileName+"_small",
      smallSize: resultSmallImage && resultSmallImage.size,
      ext:ext
    };
  }

  async getFile({fileId}:{fileId:string}){

      // const dataStream = await this.client.getObject('cloud', fileId)

    let size = 0;
    const chunks = [];

    return new Promise(async (resolve, reject) => {
      try {
        const dataStream = await this.client.getObject('cloud', fileId);

        dataStream.on('data', function (chunk) {
          size += chunk.length;
          chunks.push(chunk);
        });

        dataStream.on('end', function () {
          console.log('End. Total size = ' + size);
          const buffer = Buffer.concat(chunks, size);
          resolve(buffer);
        });

        dataStream.on('error', function (err) {
          console.log(err);
          reject(err);
        });
      } catch (error) {
        console.log('Error downloading file:', error);
        reject(error);
      }
    });

    // return dataStream

  }
  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    await this.client.removeObject(baseBucket, objetName, function (err, res) {
      if (err) {
        console.log(err);
        throw new HttpException(
          'Oops Something wrong happened',
          HttpStatus.BAD_REQUEST,
        );
      }
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
