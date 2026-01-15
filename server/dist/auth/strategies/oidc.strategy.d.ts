import { Strategy, Client } from 'openid-client';
import { LoggerService } from '../../core/logger/logger.service';
import { AuthService } from '../auth.service';
declare const OidcStrategy_base: new (...args: any[]) => Strategy<unknown, import("openid-client").BaseClient>;
export declare class OidcStrategy extends OidcStrategy_base {
    private authService;
    private logger;
    private client;
    private openIdAuthSession;
    constructor(authService: AuthService, logger: LoggerService);
    initializeClient(serverSettings: any): Promise<void>;
    validate(req: any, tokenset: any, userinfo: any, done: (err: any, user?: any) => void): Promise<any>;
    private validateGroupClaim;
    getClient(): Client;
    saveAuthSession(state: string, data: any): void;
    getAuthSession(state: string): any;
}
export {};
