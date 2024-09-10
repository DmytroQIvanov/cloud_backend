import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileEntityRepository: Repository<FileEntity>,
  ) {}

  async findAll(): Promise<FileEntity[]> {
    return this.fileEntityRepository.find();
  }

  async addOne({
    id,
    link,
    fileSize,
    originalName,
    mimetype,
    encoding,
    blurHash,
  }: {
    id: string;
    link: any;
    fileSize: number;
    originalName: any;
    mimetype: any;
    encoding: any;
    blurHash: any;
  }): Promise<any> {
    const res = await this.fileEntityRepository.create({
      fileId: id,
      name: originalName,
      filename: 'img',
      link: link,
      mimetype,
      encoding,
      fileSize,
      blurHash,
    });
    await this.fileEntityRepository.save(res);
    return res;
  }

  async deleteOne(id) {
    const res = await this.fileEntityRepository.delete(id);
    // await this.fileEntityRepository.save(res);
    return res;
  }
}
