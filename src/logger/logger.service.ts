import { Get, Injectable } from '@nestjs/common';
import { MessageFormatterService } from 'src/message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
    constructor(private readonly messageFormatter: MessageFormatterService){}

    log(message: string): string {
        
        let formattedMessage = this.messageFormatter.format(message)
        console.log(formattedMessage)
        return formattedMessage
    }

}
