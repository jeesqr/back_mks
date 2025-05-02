import { Products } from 'src/products/entity/products.entity';
import { Column, DeleteDateColumn, Entity,  JoinTable,  ManyToMany,  PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flavours {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column()
  price: number;
  @Column()
  image: string;

  @ManyToMany(() => Products, (product) => product.flavours)
  products: Products[];


}
