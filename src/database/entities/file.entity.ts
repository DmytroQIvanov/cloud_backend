import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { LinkEntity } from './link.entity';

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

  @ManyToOne(() => LinkEntity, (link) => link.files, {
    onDelete: 'CASCADE',
  })
  link: LinkEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  fileId: string;
}
