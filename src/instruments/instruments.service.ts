import { Injectable } from '@nestjs/common';
import { LinkFileEntity } from '../database/entities/Link/linkFile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileService } from '../file/file.service';
import { InstrumentFileEntity } from '../database/entities/Instrument/instrumentFile.entity';
import { InstrumentFileContainerEntity } from '../database/entities/Instrument/InstrumentFileContainer.entity';
import { UserFile } from '../database/entities/User/userFile.entity';
import { MinioClientService } from '../minio-client/minio-client.service';
import * as sharp from 'sharp';
import { MutatedInstrumentFileEntity } from '../database/entities/Instrument/mutatedInstrumentFile.entity';
import { metadata } from "reflect-metadata/no-conflict";

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(InstrumentFileEntity)
    private instrumentFileEntityRepository: Repository<InstrumentFileEntity>,

    @InjectRepository(InstrumentFileContainerEntity)
    private instrumentContainerEntityRepository: Repository<InstrumentFileContainerEntity>,

    @InjectRepository(MutatedInstrumentFileEntity)
    private mutatedInstrumentFileEntity: Repository<MutatedInstrumentFileEntity>,

    private fileService: FileService,
    private minioClientService: MinioClientService,
  ) {}

  async addFile({ files, containerId }: { files: any[]; containerId: any }) {
    const availableHours = 1;
    const willDeleteAt = new Date(
      new Date().setHours(new Date().getHours() + availableHours),
    );
    // let newLink: boolean = false;
    let container = containerId
      ? await this.instrumentContainerEntityRepository.findOne({
          where: { id: containerId },
          relations: { files: true },
        })
      : await this.instrumentContainerEntityRepository.create({
          files: [],
          willDeleteAt,
        });
    if (!container) {
      container = await this.instrumentContainerEntityRepository.create({
        files: [],
        willDeleteAt,
      });
    }
    const uploadedFiles: InstrumentFileEntity[] = [];
    for (const file of files) {
      uploadedFiles.push(
        await this.fileService.addInstrumentFile({
          file,
          containerId: container.id,
        }),
      );
    }
    container.files.push(...uploadedFiles);
    await this.instrumentContainerEntityRepository.save(container);
    return {
      // newLink,
      container,
    };
    //
  }

  async getContainer({ containerId }: any) {
    let container: InstrumentFileContainerEntity =
      await this.instrumentContainerEntityRepository.findOne({
        where: { id: containerId },
        relations: { files: { mutatedFile: true } },
      });

    // console.log('container', container);
    let responseData: any = container;
    for (const [index, file] of responseData?.files.entries()) {
      // console.log('index', index);

      responseData.files[index].file_url =
        await this.minioClientService.getSingleUrl(file.fileId);

      if (file.mutatedFile) {
        responseData.files[index].mutatedFile.file_url =
          await this.minioClientService.getSingleUrl(file.mutatedFile.fileId);
        if (file.mutatedFile?.fileId_small) {
          responseData.files[index].mutatedFile.smallImg_url =
            await this.minioClientService.getSingleUrl(
              file.mutatedFile?.fileId_small,
            );
        }
      }
      if (file?.fileId_small) {
        responseData.files[index].smallImg_url =
          await this.minioClientService.getSingleUrl(file.fileId_small);
      }
    }

    return responseData;
  }

  async addMutatedFile({
    originalFileId,
    file,
  }: {
    originalFileId: any;
    file: any;
  }) {
    const originalFile = await this.instrumentFileEntityRepository.findOne({
      where: { id: originalFileId },
      relations: { mutatedFile: true },
    });
    const uploadedMutatedFile = await this.fileService.addMutatedInstrumentFile(
      { file },
    );
    // console.log('uploadedMutatedFile', uploadedMutatedFile.fileId);
    originalFile.mutatedFile = uploadedMutatedFile;

    await this.instrumentFileEntityRepository.save(originalFile);
    return {
      originalFile,
    };
    //
  }
  async resizeImage({
    containerId,
    options,
    instrument,
  }: {
    containerId: number;
    options: any[];
    instrument:
      | 'compress-image'
      | 'resize-image'
      | 'rotate-image'
      | 'greyscale-image'
      | 'blur-image'
      | 'flip-image'
      | 'flop-image'
      | 'metadata-image';
  }) {
    let container: InstrumentFileContainerEntity =
      await this.instrumentContainerEntityRepository.findOne({
        where: { id: containerId },
        relations: ['files', 'files.mutatedFile'],
      });
    for (const file of container.files) {
      let resultImg = await this.minioClientService.getFile({
        fileId: file.fileId,
      });
      const currentModification = options.find((elem) => elem.id == file.id);
      let mutatedFile: any;
      let optionsObject;

      switch (instrument) {
        case 'compress-image':
          switch (currentModification.type) {
            case 'size':
              optionsObject = {
                width: Number(currentModification.width),
                height: Number(currentModification.height),
              };
              mutatedFile = await sharp(resultImg)
                .resize(optionsObject)
                .toFile(file.filename);

              mutatedFile.buffer = await sharp(resultImg)
                .resize(optionsObject)
                .toBuffer();

              break;

            case 'percent':
              const config = {
                jpeg: { quality: Number(currentModification.percent) },
                jpg: { quality: Number(currentModification.percent) },
                webp: { quality: Number(currentModification.percent) },
                png: {
                  compressionLevel: 6,
                  quality: Number(currentModification.percent / 10),
                },
              };

              switch (file.ext) {
                case 'jpg':
                  mutatedFile = await sharp(resultImg)
                    .jpeg(config.jpg)
                    .toFile(file.filename);
                  mutatedFile.buffer = await sharp(resultImg)
                    .jpeg(config.jpg)
                    .toBuffer();

                  break;

                default:
                  mutatedFile = await sharp(resultImg)
                    .resize({ width: file.width })
                    [file.ext](config[file.ext])
                    .toFile(file.filename);
                  mutatedFile.buffer = await sharp(resultImg)
                    .resize({ width: file.width })
                    [file.ext](config[file.ext])
                    .toBuffer();

                  break;
              }

              break;
          }

          break;

        case 'resize-image':
          switch (currentModification.type) {
            case 'pixels':
              optionsObject = {
                width: Number(currentModification.width),
                height: Number(currentModification.height),
              };
              mutatedFile = await sharp(resultImg)
                .resize(optionsObject)
                .toFile(file.filename);

              mutatedFile.buffer = await sharp(resultImg)
                .resize(optionsObject)
                .toBuffer();

              break;

            case 'percent':
              optionsObject = {
                width: Math.round(
                  file.width * (Number(currentModification.percent) / 100),
                ),
                height: Math.round(
                  file.height * (Number(currentModification.percent) / 100),
                ),
              };
              mutatedFile = await sharp(resultImg)
                .resize(optionsObject)
                .toFile(file.filename);

              mutatedFile.buffer = await sharp(resultImg)
                .resize(optionsObject)
                .toBuffer();

              break;
          }

          break;

        case 'rotate-image':
          mutatedFile = await sharp(resultImg)
            .rotate(Number(currentModification.angle))
            .toFile(file.filename);

          mutatedFile.buffer = await sharp(resultImg)
            .rotate(Number(currentModification.angle))
            .toBuffer();
          break;

        case 'greyscale-image':
          mutatedFile = await sharp(resultImg)
            .greyscale()
            .toFile(file.filename);

          mutatedFile.buffer = await sharp(resultImg).greyscale().toBuffer();
          break;

        case 'blur-image':
          mutatedFile = await sharp(resultImg).blur(50).toFile(file.filename);

          console.log('blur');
          mutatedFile.buffer = await sharp(resultImg).blur(50).toBuffer();
          break;

        case 'flip-image':
          mutatedFile = await sharp(resultImg).flip().toFile(file.filename);

          mutatedFile.buffer = await sharp(resultImg).flip().toBuffer();
          break;

        case 'flop-image':
          mutatedFile = await sharp(resultImg).flop().toFile(file.filename);

          mutatedFile.buffer = await sharp(resultImg).flop().toBuffer();
          break;

        case 'metadata-image':
          mutatedFile = await sharp(resultImg).metadata();
          console.log(mutatedFile);



          // mutatedFile.buffer = await sharp(resultImg).metadata();
          break;
      }
      mutatedFile.originalname = file.filename;
      mutatedFile.mimetype = file.mimetype;
      // console.log(
      //   'test---',
      //   file.width * (Number(currentModification.percent) / 100),
      // );
      // console.log('test---', file.width);
      // console.log('test---', Number(currentModification.percent) / 100);
      // console.log('test---', mutatedFile);

      await this.addMutatedFile({ originalFileId: file.id, file: mutatedFile });
    }

    // container.status = 'mutated';
    // await this.instrumentContainerEntityRepository.save(container);

    return await this.instrumentContainerEntityRepository.findOne({
      where: { id: containerId },
      relations: ['files', 'files.mutatedFile'],
    });
  }
}
