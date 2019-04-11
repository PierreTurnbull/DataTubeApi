import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { RegionModule } from './region.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    }),
    RegionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
