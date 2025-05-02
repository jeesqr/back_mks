import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milks } from './entity/milks.entity';
import { MilksService } from './milks.service';
import { MilksController } from './milks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Milks])],
  providers: [MilksService],
  controllers: [MilksController],
})
export class MilksModule {}
