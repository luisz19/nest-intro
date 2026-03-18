/* eslint-disable @typescript-eslint/no-misused-promises */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get('database'),
      }),
    }),

    //nesse caso, deve ser inicializado antes do forRootAsync
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig], //carrega antes
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnknown: false, só faz sentido se a aplicação estiver usando um container docker muito isolado que execute apenas Node por exemplo.
        abortEarly: true, // alerta sobre possíveis erros com validação de Schema
      },
    }),

    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, MessageFormatterService, LoggerService, {
    provide: TypedConfigService,
    useExisting: ConfigService
  }],
})
export class AppModule {}
