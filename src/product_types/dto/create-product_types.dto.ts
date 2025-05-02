import { IsInt, IsPositive, IsString } from "class-validator";

export class CreateProductTypeDto {
    @IsString()
    type: string;
   
}