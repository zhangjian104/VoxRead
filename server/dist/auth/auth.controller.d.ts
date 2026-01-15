import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { TokenManagerService } from './services/token-manager.service';
import { LoggerService } from '../core/logger/logger.service';
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class AuthController {
    private authService;
    private tokenManager;
    private logger;
    constructor(authService: AuthService, tokenManager: TokenManagerService, logger: LoggerService);
    login(req: Request, res: Response): Promise<{
        user: any;
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    refresh(body: RefreshTokenDto, req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    getMe(user: any): Promise<{
        user: any;
    }>;
    changePassword(user: any, body: ChangePasswordDto): Promise<{
        message: string;
    }>;
    checkInit(): Promise<{
        init: boolean;
    }>;
    initRootUser(body: {
        username: string;
        password: string;
    }): Promise<{
        user: any;
        accessToken: string;
    }>;
    oidcLogin(res: Response): void;
    oidcCallback(req: Request, res: Response): Promise<void>;
    oidcLogout(user: any, res: Response): Promise<void>;
    private setRefreshTokenCookie;
    private sanitizeUser;
}
