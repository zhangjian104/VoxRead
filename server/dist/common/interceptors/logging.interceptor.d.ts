import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../../core/logger/logger.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private logger;
    constructor(logger: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
export declare class PerformanceInterceptor implements NestInterceptor {
    private logger;
    private readonly slowRequestThreshold;
    constructor(logger: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
