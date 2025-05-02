import { Orders } from 'src/orders/entity/orders.entity';
import { Products } from 'src/products/entity/products.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Toppings {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column()
  max_quantity: number;
  @Column()
  free_quantity: number;
  @Column()
  price: number;
  @Column()
  image: string;

  @ManyToMany(() => Products, (product) => product.toppings)
  products: Products[];

  @ManyToMany(() => Orders)
  orders: Orders[];
}
