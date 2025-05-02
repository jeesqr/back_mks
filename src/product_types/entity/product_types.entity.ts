import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product_Type {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({unique: true})
  type: string;
  
 
}
