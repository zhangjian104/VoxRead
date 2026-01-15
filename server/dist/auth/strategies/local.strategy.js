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
exports.LocalStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_local_1 = require("passport-local");
const logger_service_1 = require("../../core/logger/logger.service");
const auth_service_1 = require("../auth.service");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy, 'local') {
    constructor(authService, logger) {
        super({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        });
        this.authService = authService;
        this.logger = logger;
    }
    async validate(req, username, password) {
        try {
            const clientIp = this.getClientIp(req);
            this.logger.debug(`[LocalStrategy] 认证尝试: 用户名="${username}", IP=${clientIp}`);
            const user = await this.authService.validateLocalUser(username, password, clientIp);
            if (!user) {
                this.logger.warn(`[LocalStrategy] 认证失败: 用户名="${username}", IP=${clientIp}`);
                return null;
            }
            this.logger.info(`[LocalStrategy] 用户 "${username}" 认证成功, IP=${clientIp}`);
            return user;
        }
        catch (error) {
            this.logger.error('[LocalStrategy] 认证过程中发生错误:', error);
            return null;
        }
    }
    getClientIp(req) {
        return (req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.ip ||
            'unknown');
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        logger_service_1.LoggerService])
], LocalStrategy);
//# sourceMappingURL=local.strategy.js.map