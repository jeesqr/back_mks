import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateToppingsDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  max_quantity: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  free_quantity: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({ required: false })
  @IsString()
  image?: string;
}
