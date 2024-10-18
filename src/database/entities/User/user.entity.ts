import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { LinkEntity } from '../Link/link.entity';
import { UserFile } from "./userFile.entity";

@Entity('UserEntity')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true, nullable: true })
  email: string;

  @Column({ nullable: true,default:' ' })
  password: string;

  @Column({default:5})
  maxCloudSpace: number;

  @Column({default:0})
  currentCloudSpace: number;



  @Column({default:50})
  maxTransferSpace: number;

  @Column({default:0})
  currentTransferSpace: number;

  @Column({ default: 'guest' })
  accountType: 'guest' | 'user';

  @OneToMany(() => LinkEntity, (link) => link.user)
  links: LinkEntity[];

  @OneToMany(() => UserFile, (file) => file.user)
  files: UserFile[];


}
//1111

export default UserEntity