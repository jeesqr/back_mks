import { Module } from '@nestjs/common';
import { Temps } from './entity/temps.entity';
import { TempsService } from './temps.service';
import { TempsController } from './temps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Temps])],
        providers: [TempsService],
        controllers: [TempsController],
})
export class TempsModule {}
