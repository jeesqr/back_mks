import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, Max } from 'class-validator';

export class ToppingOrderDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  quantity: number;
}
