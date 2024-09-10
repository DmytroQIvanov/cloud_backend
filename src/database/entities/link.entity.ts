import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('LinkEntity')
export class LinkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 500 })
  name: string;

  @OneToMany(() => FileEntity, (file) => file.link, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  files: FileEntity[];

  @Column({ default: null })
  password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  willDeleteAt: Date;
}
