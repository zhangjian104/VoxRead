import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../../core/logger/logger.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private logger;
    constructor(logger: LoggerService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
    private shouldSkipAuth;
    private escapeRegExp;
}
declare const LocalAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LocalAuthGuard extends LocalAuthGuard_base {
    private logger;
    constructor(logger: LoggerService);
    handleRequest(err: any, user: any, info: any): any;
}
declare const OidcAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OidcAuthGuard extends OidcAuthGuard_base {
    private logger;
    constructor(logger: LoggerService);
    handleRequest(err: any, user: any, info: any): any;
}
export declare class AdminGuard implements CanActivate {
    private logger;
    constructor(logger: LoggerService);
    canActivate(context: ExecutionContext): boolean;
}
export declare class RootGuard implements CanActivate {
    private logger;
    constructor(logger: LoggerService);
    canActivate(context: ExecutionContext): boolean;
}
export declare class LibraryAccessGuard implements CanActivate {
    private logger;
    constructor(logger: LoggerService);
    canActivate(context: ExecutionContext): boolean;
    private checkLibraryAccess;
}
export {};
