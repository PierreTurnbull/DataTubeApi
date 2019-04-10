import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RegionsModule } from './regions/regions.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ]
    }),
    RegionsModule
  ],
  controllers: [AppController],
})
export class AppModule {}