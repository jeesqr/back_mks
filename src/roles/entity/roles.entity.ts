import { User } from 'src/users/entity/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleList {
  ADMIN = 'admin',
  CASHIER = 'cashier',
  CLIENT = 'client',
}

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: RoleList })
  role: RoleList;
  @OneToMany(() => User, (user) => user.role) 
  //es necesario cuando queremos buscar a todos los usuarios que tengan algun rol, no es estrictamente necesario utilizarlo
  users: User[];
}
