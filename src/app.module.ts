// import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/user.entity';
import { TicketsModule } from './tickets/tickets.module';
import { OrdersModule } from './orders/orders.module';
import { RolesModule } from './roles/roles.module';
import { OrderToppingsModule } from './order_toppings/order_toppings.module';
import { SizesModule } from './sizes/sizes.module';
import { MilksModule } from './milks/milks.module';
import { ToppingsModule } from './toppings/toppings.module';
import { FlavoursModule } from './flavours/flavours.module';
import { Roles } from './roles/entity/roles.entity';
import { Flavours } from './flavours/entity/flavours.entity';
import { Milks } from './milks/entity/milks.entity';
import { Orders } from './orders/entity/orders.entity';
import { Product_Type } from './product_types/entity/product_types.entity';
import { Products } from './products/entity/products.entity';
import { Sizes } from './sizes/entity/sizes.entity';
import { Temps } from './temps/entity/temps.entity';
import { Tickets } from './tickets/entity/tickets.entity';
import { Toppings } from './toppings/entity/toppings.entity';
import { TempsModule } from './temps/temps.module';
import { Product_TypesModule } from './product_types/product_types.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      entities: [
        User,
        Roles,
        Flavours,
        Milks,
        Orders,
        Product_Type,
        Products,
        Sizes,
        Temps,
        Tickets,
        Toppings,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    TicketsModule,
    TempsModule,
    OrdersModule,
    RolesModule,
    OrderToppingsModule,
    SizesModule,
    MilksModule,
    ProductsModule,
    ToppingsModule,
    Product_TypesModule,
    FlavoursModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
