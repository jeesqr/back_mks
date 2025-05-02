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
export class Sizes {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column()
  price: number;
  @Column()
  image: string;

  @ManyToMany(() => Products, (product) => product.sizes)
  products: Products[];
}
