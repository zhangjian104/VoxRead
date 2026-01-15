"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryAccessGuard = exports.RootGuard = exports.AdminGuard = exports.OidcAuthGuard = exports.LocalAuthGuard = exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const logger_service_1 = require("../../core/logger/logger.service");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(logger) {
        super();
        this.logger = logger;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (this.shouldSkipAuth(request)) {
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            const request = context.switchToHttp().getRequest();
            this.logger.warn(`[JwtAuthGuard] 认证失败: ${request.method} ${request.url}`);
            throw err || new common_1.UnauthorizedException('Authentication required');
        }
        return user;
    }
    shouldSkipAuth(request) {
        const routerBasePath = global.RouterBasePath || '';
        const path = request.path;
        const skipPatterns = [
            new RegExp(`^${this.escapeRegExp(routerBasePath)}/api/items/[^/]+/cover$`),
            new RegExp(`^${this.escapeRegExp(routerBasePath)}/api/authors/[^/]+/image$`),
            new RegExp(`^/items/[^/]+/cover$`),
            new RegExp(`^/authors/[^/]+/image$`),
        ];
        return request.method === 'GET' && skipPatterns.some((pattern) => pattern.test(path));
    }
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], JwtAuthGuard);
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
    constructor(logger) {
        super();
        this.logger = logger;
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            this.logger.warn('[LocalAuthGuard] 本地认证失败');
            throw err || new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LocalAuthGuard);
let OidcAuthGuard = class OidcAuthGuard extends (0, passport_1.AuthGuard)('oidc') {
    constructor(logger) {
        super();
        this.logger = logger;
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            this.logger.warn('[OidcAuthGuard] OIDC 认证失败');
            throw err || new common_1.UnauthorizedException('OIDC authentication failed');
        }
        return user;
    }
};
exports.OidcAuthGuard = OidcAuthGuard;
exports.OidcAuthGuard = OidcAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], OidcAuthGuard);
let AdminGuard = class AdminGuard {
    constructor(logger) {
        this.logger = logger;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            this.logger.warn('[AdminGuard] 未找到用户信息');
            throw new common_1.UnauthorizedException('Authentication required');
        }
        const isAdmin = user.type === 'root' || user.type === 'admin' || user.isAdminOrUp === true;
        if (!isAdmin) {
            this.logger.warn(`[AdminGuard] 用户 "${user.username}" 尝试访问管理员资源`);
            throw new common_1.UnauthorizedException('Admin access required');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], AdminGuard);
let RootGuard = class RootGuard {
    constructor(logger) {
        this.logger = logger;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        const isRoot = user.type === 'root';
        if (!isRoot) {
            this.logger.warn(`[RootGuard] 用户 "${user.username}" 尝试访问 root 资源`);
            throw new common_1.UnauthorizedException('Root access required');
        }
        return true;
    }
};
exports.RootGuard = RootGuard;
exports.RootGuard = RootGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], RootGuard);
let LibraryAccessGuard = class LibraryAccessGuard {
    constructor(logger) {
        this.logger = logger;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const libraryId = request.params.id || request.params.libraryId;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        if (user.type === 'root' || user.type === 'admin' || user.isAdminOrUp) {
            return true;
        }
        const hasAccess = this.checkLibraryAccess(user, libraryId);
        if (!hasAccess) {
            this.logger.warn(`[LibraryAccessGuard] 用户 "${user.username}" 无权访问库 ${libraryId}`);
            throw new common_1.UnauthorizedException('Library access denied');
        }
        return true;
    }
    checkLibraryAccess(user, libraryId) {
        if (user.permissions?.accessAllLibraries) {
            return true;
        }
        const accessibleLibraries = user.permissions?.librariesAccessible || [];
        return accessibleLibraries.includes(libraryId);
    }
};
exports.LibraryAccessGuard = LibraryAccessGuard;
exports.LibraryAccessGuard = LibraryAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LibraryAccessGuard);
//# sourceMappingURL=auth.guard.js.map