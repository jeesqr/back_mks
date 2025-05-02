import { Products } from 'src/products/entity/products.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Milks {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  image: string;
  
  @ManyToMany(() => Products, (product) => product.milks)
  products: Products[];
 
}
