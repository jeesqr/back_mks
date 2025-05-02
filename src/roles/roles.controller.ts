import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from './entity/roles.entity';
import { CreateRolesDto } from './dto/create-roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get()
  async getRoles(): Promise<Roles[]> {
    return this.rolesService.findAll();
  }
  @Post('create')
  async createRole(@Body() createRoleDto: CreateRolesDto): Promise<Roles> {
    return this.rolesService.createRoles(createRoleDto);
  }
  @Get(':id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<Roles | null> {
    return this.rolesService.findOne(id);
  }
  @Put(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: CreateRolesDto,
  ): Promise<Roles | null> {
    return this.rolesService.updateRole(id, updateRoleDto);
  }
  @Delete(':id')
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.rolesService.deleteRole(id);
  }
}
