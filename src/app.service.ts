import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly Logger: LoggerService ) {}

  getHello(): string {
    return this.Logger.log('Hello world');
  }
}
