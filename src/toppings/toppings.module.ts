import { Module } from '@nestjs/common';
import { ToppingsService } from './toppings.service';
import { ToppingsController } from './toppings.controller';
import { Toppings } from './entity/toppings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Toppings])],
    providers: [ToppingsService],
    controllers: [ToppingsController],
})
export class ToppingsModule {}
