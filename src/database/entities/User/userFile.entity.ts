import { ChildEntity, Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import FileEntity from "../file.entity";
import UserEntity from "./user.entity";

@Entity("UserFileEntity")
export class UserFile extends FileEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  willDeleteAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.files)
  user: UserEntity;

  // @Column({ nullable: true });


}