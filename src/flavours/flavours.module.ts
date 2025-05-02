import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flavours } from './entity/flavours.entity';
import { FlavoursService } from './flavours.service';
import { FlavoursController } from './flavours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Flavours])],
  providers: [FlavoursService],
  controllers: [FlavoursController],
})
export class FlavoursModule {}
