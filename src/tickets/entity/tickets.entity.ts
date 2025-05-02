import { Orders } from 'src/orders/entity/orders.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TicketStatus {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
}

@Entity()
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  ticket_date: Date;
  @Column({ type: 'time', default: () => 'CURRENT_TIME' })
  ticket_time: string;
  @Column()
  total: number;
  @ManyToOne(() => User, (user) => user.tickets)
  cashier: User;
  @OneToMany(() => Orders, (order) => order.ticket)
  orders: Orders[];
  @Column()
  payment_method: string;
  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.PENDIENTE })
  status: TicketStatus;
}
