import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { LinkFileEntity } from './linkFile.entity';
import { UserEntity } from '../User/user.entity';

@Entity('LinkEntity')
export class LinkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 500 })
  name: string;

  @OneToMany(() => LinkFileEntity, (file) => file.link, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  files: LinkFileEntity[];

  @ManyToOne(() => UserEntity, (user) => user.links)
  user: UserEntity;

  @Column({ default: null })
  password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ default: null })
  status: 'deleted' | 'active';

  @Column({ default: 'public' })
  publicity: 'public' | 'private';

  @Column()
  willDeleteAt: Date;
}
