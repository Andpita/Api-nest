import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressModule } from './address/address.module';
import { StateController } from './state/state.controller';
import { StateService } from './state/state.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DATABASE,
      host: process.env.DATABASE_HOST,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      port: Number(process.env.DATABASE_PORT),
      entities: [`${__dirname}/**/*.entity{.js, .ts}`],
      migrations: [`${__dirname}/data/migration/{.ts,*.js}`],
      migrationsRun: true,
    }),
    UserModule,
    StateModule,
    CityModule,
    AddressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
