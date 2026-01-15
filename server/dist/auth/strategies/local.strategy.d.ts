import { Strategy } from 'passport-local';
import { LoggerService } from '../../core/logger/logger.service';
import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private logger;
    constructor(authService: AuthService, logger: LoggerService);
    validate(req: any, username: string, password: string): Promise<any>;
    private getClientIp;
}
export {};
