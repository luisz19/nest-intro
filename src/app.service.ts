import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/config.types';
import { AppConfig } from './config/app.config';

@Injectable()
export class AppService {
  constructor(
    private readonly Logger: LoggerService,
    private readonly configService: ConfigService<ConfigType>
  ) {}

  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')
    return this.Logger.log(`${prefix} Hello World`);
  }
}
