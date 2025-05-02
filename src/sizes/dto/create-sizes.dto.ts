import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({ required: false })
  @IsString()
  image?: string;
}
