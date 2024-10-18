import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { LinkEntity } from './Link/link.entity';
import { UserEntity } from "./User/user.entity";

@Entity('FileEntity')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ default: '' })
  mimetype: string;

  @Column({ default: '' })
  encoding: string;

  @Column()
  filename: string;

  @Column({ default: 0 })
  fileSize: number;

  @Column({ default: null })
  blurHash: string;

  @Column({ default: null })
  previewImage: string;

  @Column({default:null})
  ext:string



  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // --------
  // FILE IDs
  // --------

  @Column()
  fileId: string;

  @Column({ default: null })
  fileId_small: string;

  @Column({ default: null })
  fileId_middle: string;

  @Column({ default: null })
  fileId_75Percent: string;

  @Column({ default: null })
  fileId_100PercentCompressed: string;
}

export default FileEntity