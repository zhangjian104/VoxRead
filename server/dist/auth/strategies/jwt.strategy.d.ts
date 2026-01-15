import { Strategy } from 'passport-jwt';
import { LoggerService } from '../../core/logger/logger.service';
import { JwtPayload } from '../services/token-manager.service';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private logger;
    constructor(authService: AuthService, logger: LoggerService);
    validate(req: any, payload: JwtPayload): Promise<any>;
    private validateApiKey;
    private validateJwtUser;
}
export {};
