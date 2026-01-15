import { LoggerService } from '../core/logger/logger.service';
import { TokenManagerService } from './services/token-manager.service';
import { DatabaseService } from '../core/database/database.service';
export declare class AuthService {
    private logger;
    private tokenManager;
    private database;
    constructor(logger: LoggerService, tokenManager: TokenManagerService, database: DatabaseService);
    validateLocalUser(username: string, password: string, clientIp: string): Promise<any>;
    private logFailedLoginAttempt;
    getUserByUsername(username: string): Promise<any>;
    getUserById(userId: string): Promise<any>;
    getUserByIdOrOldId(userId: string): Promise<any>;
    validateApiKey(keyId: string): Promise<any>;
    deactivateApiKey(keyId: string): Promise<void>;
    findOrCreateOidcUser(userinfo: any): Promise<any>;
    updateUserFromOidcClaims(user: any, userinfo: any): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    login(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(token: string): Promise<void>;
    private sanitizeUserForResponse;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
    createRootUser(username: string, password: string): Promise<any>;
    hasRootUser(): Promise<boolean>;
}
