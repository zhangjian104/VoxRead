import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../core/logger/logger.service';
import { GlobalConfigService } from '../../core/config/global-config.service';
export interface JwtPayload {
    userId: string;
    username: string;
    type?: 'api' | 'access' | 'refresh';
    keyId?: string;
    iat?: number;
    exp?: number;
}
export declare class TokenManagerService {
    private jwtService;
    private logger;
    private config;
    private static tokenSecret;
    constructor(jwtService: JwtService, logger: LoggerService, config: GlobalConfigService);
    private generateSecretKey;
    static getTokenSecret(): string;
    static setTokenSecret(secret: string): void;
    generateAccessToken(payload: Partial<JwtPayload>, expiresIn?: number): string;
    generateRefreshToken(payload: Partial<JwtPayload>): string;
    generateApiKeyToken(userId: string, keyId: string, expiresAt?: number): string;
    verifyToken(token: string): JwtPayload | null;
    verifyRefreshToken(refreshToken: string): JwtPayload | null;
    decodeToken(token: string): JwtPayload | null;
    extractTokenFromHeader(authorizationHeader: string): string | null;
    isTokenExpiringSoon(token: string, thresholdSeconds?: number): boolean;
    rotateTokens(user: any): {
        accessToken: string;
        refreshToken: string;
    };
    revokeToken(token: string): Promise<void>;
    generateSessionToken(): string;
}
