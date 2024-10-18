import { ChildEntity, Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import FileEntity from "../file.entity";
import UserEntity from "../User/user.entity";
import { LinkEntity } from "./link.entity";

@Entity("LinkFileEntity")
export class LinkFileEntity extends FileEntity {
  // @CreateDateColumn({ type: 'timestamptz' })
  // willDeleteAt: Date;
  //
  // @ManyToOne(() => UserEntity, (user) => user.files)
  // user: UserEntity;

  @ManyToOne(() => LinkEntity, (link) => link.files, {
    onDelete: 'CASCADE',
  })
  link: LinkEntity;

}