import { IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
import { RoleList } from '../entity/roles.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolesDto {
  @ApiProperty()
  @IsEnum(RoleList, {
    message: 'Role must be a valid value like: admin, cashier, client',
  })
  role: RoleList;
}
