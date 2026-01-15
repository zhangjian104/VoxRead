import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService } from '../../core/logger/logger.service';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private logger;
    constructor(logger: LoggerService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
export declare class HttpExceptionFilter implements ExceptionFilter {
    private logger;
    constructor(logger: LoggerService);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
