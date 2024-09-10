import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UserEntity')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  email: string;

  @Column()
  password: string;
}
