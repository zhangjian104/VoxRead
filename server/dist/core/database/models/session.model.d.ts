import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class Session extends Model {
    id: string;
    ipAddress: string;
    userAgent: string;
    refreshToken: string;
    expiresAt: Date;
    userId: string;
    user: User;
    static createSession(userId: string, ipAddress: string, userAgent: string, refreshToken: string, expiresAt: Date): Promise<Session>;
    static cleanupExpiredSessions(): Promise<number>;
    static findByRefreshToken(refreshToken: string): Promise<Session | null>;
    static getUserActiveSessions(userId: string): Promise<Session[]>;
    static deleteUserSessions(userId: string): Promise<number>;
    static deleteOtherUserSessions(userId: string, currentSessionId: string): Promise<number>;
    isExpired(): boolean;
    touch(): Promise<void>;
    toJSON(): any;
}
