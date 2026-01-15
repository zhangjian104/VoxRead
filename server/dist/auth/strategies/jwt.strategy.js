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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const logger_service_1 = require("../../core/logger/logger.service");
const token_manager_service_1 = require("../services/token-manager.service");
const auth_service_1 = require("../auth.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(authService, logger) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                passport_jwt_1.ExtractJwt.fromUrlQueryParameter('token'),
            ]),
            secretOrKey: token_manager_service_1.TokenManagerService.getTokenSecret(),
            passReqToCallback: true,
        });
        this.authService = authService;
        this.logger = logger;
    }
    async validate(req, payload) {
        try {
            if (payload.type === 'api') {
                return await this.validateApiKey(payload);
            }
            return await this.validateJwtUser(payload);
        }
        catch (error) {
            this.logger.error('[JwtStrategy] JWT 验证失败:', error);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async validateApiKey(payload) {
        if (payload.exp && payload.exp < Date.now() / 1000) {
            this.logger.warn(`[JwtStrategy] API Key 已过期: ${payload.keyId}`);
            await this.authService.deactivateApiKey(payload.keyId);
            throw new common_1.UnauthorizedException('API key expired');
        }
        const apiKey = await this.authService.validateApiKey(payload.keyId);
        if (!apiKey || !apiKey.isActive) {
            throw new common_1.UnauthorizedException('Invalid or inactive API key');
        }
        const user = await this.authService.getUserById(apiKey.userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        this.logger.debug(`[JwtStrategy] API Key 认证成功: ${payload.keyId}`);
        return user;
    }
    async validateJwtUser(payload) {
        if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new common_1.UnauthorizedException('Token expired');
        }
        const user = await this.authService.getUserByIdOrOldId(payload.userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        if (!payload.exp && !user.isOldToken) {
            this.logger.debug(`[JwtStrategy] 用户 ${user.username} 使用无过期时间的旧 Token`);
            user.isOldToken = true;
        }
        else if (payload.exp && user.isOldToken !== undefined) {
            delete user.isOldToken;
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        logger_service_1.LoggerService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map