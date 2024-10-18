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
import { UserEntity } from '../User/user.entity';
import { InstrumentFileEntity } from "./instrumentFile.entity";

@Entity('InstrumentContainerEntity')
export class InstrumentFileContainerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 500,nullable:true })
  name: string;

  @OneToMany(() => InstrumentFileEntity, (file) => file.container, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  files: InstrumentFileEntity[];

  // @ManyToOne(() => UserEntity, (user) => user.links)
  // user: UserEntity;

  // @Column({ default: null })
  // password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ default: null })
  status: 'active' | 'mutated';

  @Column({ default: 'public' })
  publicity: 'public' | 'private';

  @Column()
  willDeleteAt: Date;
}
