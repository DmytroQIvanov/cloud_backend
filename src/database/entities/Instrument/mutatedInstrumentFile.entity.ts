import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import FileEntity from "../file.entity";
import UserEntity from "../User/user.entity";
import { InstrumentFileContainerEntity } from "./InstrumentFileContainer.entity";

@Entity("MutatedInstrumentFileEntity")
export class MutatedInstrumentFileEntity extends FileEntity {
  // @CreateDateColumn({ type: 'timestamptz' })
  // willDeleteAt: Date;

  // @ManyToOne(() => UserEntity, (user) => user.files)
  // user: UserEntity;
  // @ManyToOne(()=>InstrumentFileContainerEntity,(container)=>container.files)
  // container: InstrumentFileContainerEntity;

  @Column({default:0})
  height:number;

  @Column({default:0})
  width:number;


  // @OneToOne({default:null})
  // originalFileId:string;

  


}