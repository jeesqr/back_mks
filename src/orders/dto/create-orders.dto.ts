import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { ToppingOrderDto } from 'src/toppings/dto/create-toppings-orders.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  flavoursId: number;

  @ApiProperty()
  @IsInt()
  sizesId: number;

  @ApiProperty()
  @IsInt()
  tempId: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToppingOrderDto)
  toppings: ToppingOrderDto[];

  @ApiProperty()
  @IsInt()
  milksId: number;

  @ApiProperty()
  @IsInt()
  cashierId: number;

  @ApiProperty()
  @IsString()
  payment_method: string;
}
