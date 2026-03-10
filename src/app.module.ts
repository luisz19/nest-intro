import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], //carrega antes
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnknown: false, só faz sentido se a aplicação estiver usando um container docker muito isolado que execute apenas Node por exemplo.
        abortEarly: true, // alerta sobre possíveis erros com validação de Schema
      },
    }),

    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, MessageFormatterService, LoggerService],
})
export class AppModule {}
