import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioClientService } from '../minio-client/minio-client.service';
import { LinkFileEntity } from '../database/entities/Link/linkFile.entity';
import { UserFile } from '../database/entities/User/userFile.entity';
import { InstrumentFileEntity } from "../database/entities/Instrument/instrumentFile.entity";
import * as sharp from 'sharp';
import { MutatedInstrumentFileEntity } from "../database/entities/Instrument/mutatedInstrumentFile.entity";


@Injectable()
export class FileService {
  constructor(
    @InjectRepository(LinkFileEntity)
    private fileEntityRepository: Repository<LinkFileEntity>,

    @InjectRepository(UserFile)
    private userFileEntityRepository: Repository<UserFile>,

    @InjectRepository(InstrumentFileEntity)
    private instrumentFileEntityRepository: Repository<InstrumentFileEntity>,


    @InjectRepository(MutatedInstrumentFileEntity)
    private MutatedInstrumentFileEntity: Repository<MutatedInstrumentFileEntity>,

    private minioClientService: MinioClientService,
  ) {}

  async findAll(): Promise<LinkFileEntity[]> {
    return this.fileEntityRepository.find();
  }

  async getSingleFile(id: any) {
    const resultFile = await this.fileEntityRepository.findOne({
      where: { id },
    });
    console.log('resultFile', resultFile);
    if (!resultFile)
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);

    const uploaded_imageUrl = await this.minioClientService.getSingleUrl(
      resultFile.fileId,
    );
    if (!uploaded_imageUrl)
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);

    return {
      file_url: uploaded_imageUrl,
      ...resultFile,
      // message: 'Successfully uploaded to MinIO S322222222',
    };
  }
  async addOne({ file, link }: { file: any; link: any }): Promise<any> {
    const uploaded_image = await this.minioClientService.upload(file);

    const res = await this.fileEntityRepository.create({
      fileId: uploaded_image.fileName,
      name: uploaded_image.originalName,

      filename: 'img',
      link: link,
      mimetype: uploaded_image.mimetype,
      encoding: uploaded_image.encoding,

      // fileSize,
      blurHash: uploaded_image.blurHash,
      fileId_small: uploaded_image.smallImageId,
    });
    await this.fileEntityRepository.save(res);
    return res;
  }

  async addUserFile({ file, user }: { file: any; user: any }): Promise<any> {
    const uploaded_image = await this.minioClientService.upload(file);

    const res = await this.userFileEntityRepository.create({
      fileId: uploaded_image.fileName,
      name: uploaded_image.originalName,
      filename: 'img',
      mimetype: uploaded_image.mimetype,

      encoding: uploaded_image.encoding,
      blurHash: uploaded_image.blurHash,
      // smallImageId:uploaded_image.smallImageId,
      // fileSize,
      fileId_small: uploaded_image.smallImageId,
      user,
    });
    await this.userFileEntityRepository.save(res);
    return res;
  }



  async addInstrumentFile({ file,containerId }: { file: any; containerId: any }): Promise<any> {
    const uploaded_image = await this.minioClientService.upload(file);
    const image = await sharp(file.buffer)
    const metadata = await image.metadata()
    const res = await this.instrumentFileEntityRepository.create({
      fileId: uploaded_image.fileName,
      name: uploaded_image.originalName,
      mimetype: uploaded_image.mimetype,
      filename: 'img',
      height:metadata.height,
      width:metadata.width,

      encoding: uploaded_image.encoding,
      blurHash: uploaded_image.blurHash,
      container: containerId,
      // smallImageId:uploaded_image.smallImageId,
      // fileSize,
      fileId_small: uploaded_image.smallImageId,
      ext:uploaded_image.ext
    });
    await this.instrumentFileEntityRepository.save(res);
    return res;
  }


  async addMutatedInstrumentFile({ file }: { file: any;  }): Promise<any> {
    const uploaded_image = await this.minioClientService.upload(file);
    const image = await sharp(file.buffer)
    const metadata = await image.metadata()
    const res = await this.MutatedInstrumentFileEntity.create({
      fileId: uploaded_image.fileName,
      name: uploaded_image.originalName,
      mimetype: uploaded_image.mimetype,
      filename: 'img',
      height:metadata.height,
      width:metadata.width,

      encoding: uploaded_image.encoding,
      blurHash: uploaded_image.blurHash,

      // container: containerId
      // smallImageId:uploaded_image.smallImageId,
      // fileSize,
      fileId_small: uploaded_image.smallImageId,
    });
    await this.MutatedInstrumentFileEntity.save(res);
    return res;
  }

  async deleteOne(id) {
    const res = await this.fileEntityRepository.delete(id);
    // await this.fileEntityRepository.save(res);
    return res;
  }


  async deleteOneUser(id) {
    const res = await this.userFileEntityRepository.delete(id);
    // await this.fileEntityRepository.save(res);
    return res;
  }
}
