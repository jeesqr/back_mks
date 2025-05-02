import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsPositive,
  isNumber,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  base_price: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  type: number;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  flavours: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  sizes: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  temp: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  toppings: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  milks: number[];

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  order: number;



}
