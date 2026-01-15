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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.ChangePasswordDto = exports.RefreshTokenDto = exports.LoginDto = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const token_manager_service_1 = require("./services/token-manager.service");
const auth_guard_1 = require("./guards/auth.guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
const logger_service_1 = require("../core/logger/logger.service");
class LoginDto {
}
exports.LoginDto = LoginDto;
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
let AuthController = class AuthController {
    constructor(authService, tokenManager, logger) {
        this.authService = authService;
        this.tokenManager = tokenManager;
        this.logger = logger;
    }
    async login(req, res) {
        const user = req.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const loginResult = await this.authService.login(user);
        this.setRefreshTokenCookie(res, req, loginResult.refreshToken);
        return {
            user: loginResult.user,
            accessToken: loginResult.accessToken,
        };
    }
    async logout(req, res) {
        const token = this.tokenManager.extractTokenFromHeader(req.headers.authorization);
        if (token) {
            await this.authService.logout(token);
        }
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }
    async refresh(body, req, res) {
        const refreshToken = body.refreshToken || req.cookies?.refresh_token;
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token not provided');
        }
        const tokens = await this.authService.refreshToken(refreshToken);
        this.setRefreshTokenCookie(res, req, tokens.refreshToken);
        return {
            accessToken: tokens.accessToken,
        };
    }
    async getMe(user) {
        return {
            user: this.sanitizeUser(user),
        };
    }
    async changePassword(user, body) {
        await this.authService.changePassword(user.id, body.oldPassword, body.newPassword);
        return { message: 'Password changed successfully' };
    }
    async checkInit() {
        const hasRoot = await this.authService.hasRootUser();
        return {
            init: hasRoot,
        };
    }
    async initRootUser(body) {
        const hasRoot = await this.authService.hasRootUser();
        if (hasRoot) {
            throw new common_1.UnauthorizedException('Root user already exists');
        }
        const user = await this.authService.createRootUser(body.username, body.password);
        const loginResult = await this.authService.login(user);
        return {
            user: loginResult.user,
            accessToken: loginResult.accessToken,
        };
    }
    oidcLogin(res) {
        res.redirect('/auth/openid/login');
    }
    async oidcCallback(req, res) {
        const user = req.user;
        if (!user) {
            return res.redirect('/login?error=oidc_failed');
        }
        const loginResult = await this.authService.login(user);
        this.setRefreshTokenCookie(res, req, loginResult.refreshToken);
        return res.redirect(`/?token=${loginResult.accessToken}`);
    }
    async oidcLogout(user, res) {
        res.clearCookie('refresh_token');
        if (user.openid_id_token) {
            const logoutUrl = `${global.ServerSettings?.authOpenIDLogoutURL}?id_token_hint=${user.openid_id_token}`;
            return res.redirect(logoutUrl);
        }
        return res.redirect('/login');
    }
    setRefreshTokenCookie(res, req, refreshToken) {
        const isSecure = req.secure || req.get('x-forwarded-proto') === 'https';
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
    sanitizeUser(user) {
        const { pash, ...sanitized } = user;
        return sanitized;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(auth_guard_1.LocalAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('password'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('/init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkInit", null);
__decorate([
    (0, common_1.Post)('/init'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initRootUser", null);
__decorate([
    (0, common_1.Get)('openid'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "oidcLogin", null);
__decorate([
    (0, common_1.Get)('openid/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oidcCallback", null);
__decorate([
    (0, common_1.Post)('openid/logout'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oidcLogout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        token_manager_service_1.TokenManagerService,
        logger_service_1.LoggerService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map