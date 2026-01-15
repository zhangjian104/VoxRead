"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TokenManagerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManagerService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
const jwt = __importStar(require("jsonwebtoken"));
const logger_service_1 = require("../../core/logger/logger.service");
const global_config_service_1 = require("../../core/config/global-config.service");
let TokenManagerService = TokenManagerService_1 = class TokenManagerService {
    constructor(jwtService, logger, config) {
        this.jwtService = jwtService;
        this.logger = logger;
        this.config = config;
        if (!TokenManagerService_1.tokenSecret) {
            TokenManagerService_1.tokenSecret = this.generateSecretKey();
        }
    }
    generateSecretKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let secret = '';
        for (let i = 0; i < 256; i++) {
            secret += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return secret;
    }
    static getTokenSecret() {
        return TokenManagerService_1.tokenSecret;
    }
    static setTokenSecret(secret) {
        TokenManagerService_1.tokenSecret = secret;
    }
    generateAccessToken(payload, expiresIn) {
        const tokenPayload = {
            userId: payload.userId,
            username: payload.username,
            type: 'access',
        };
        const options = {};
        if (expiresIn) {
            options.expiresIn = expiresIn;
        }
        return jwt.sign(tokenPayload, TokenManagerService_1.tokenSecret, options);
    }
    generateRefreshToken(payload) {
        const tokenPayload = {
            userId: payload.userId,
            username: payload.username,
            type: 'refresh',
        };
        return jwt.sign(tokenPayload, TokenManagerService_1.tokenSecret, {
            expiresIn: '30d',
        });
    }
    generateApiKeyToken(userId, keyId, expiresAt) {
        const tokenPayload = {
            userId,
            username: '',
            type: 'api',
            keyId,
        };
        const options = {};
        if (expiresAt) {
            options.expiresIn = Math.floor((expiresAt - Date.now()) / 1000);
        }
        return jwt.sign(tokenPayload, TokenManagerService_1.tokenSecret, options);
    }
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, TokenManagerService_1.tokenSecret);
            return decoded;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                this.logger.debug('[TokenManager] Token 已过期');
            }
            else if (error.name === 'JsonWebTokenError') {
                this.logger.debug('[TokenManager] Token 验证失败:', error.message);
            }
            else {
                this.logger.error('[TokenManager] Token 验证错误:', error);
            }
            return null;
        }
    }
    verifyRefreshToken(refreshToken) {
        const payload = this.verifyToken(refreshToken);
        if (!payload) {
            return null;
        }
        if (payload.type !== 'refresh') {
            this.logger.warn('[TokenManager] Token 类型不是 refresh');
            return null;
        }
        return payload;
    }
    decodeToken(token) {
        try {
            const decoded = jwt.decode(token);
            return decoded;
        }
        catch (error) {
            this.logger.error('[TokenManager] Token 解码失败:', error);
            return null;
        }
    }
    extractTokenFromHeader(authorizationHeader) {
        if (!authorizationHeader) {
            return null;
        }
        const parts = authorizationHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        return parts[1];
    }
    isTokenExpiringSoon(token, thresholdSeconds = 3600) {
        const payload = this.decodeToken(token);
        if (!payload || !payload.exp) {
            return false;
        }
        const expiresAt = payload.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        return timeUntilExpiry < thresholdSeconds * 1000;
    }
    rotateTokens(user) {
        const accessToken = this.generateAccessToken({
            userId: user.id,
            username: user.username,
        }, 3600 * 24 * 7);
        const refreshToken = this.generateRefreshToken({
            userId: user.id,
            username: user.username,
        });
        this.logger.debug(`[TokenManager] 为用户 "${user.username}" 轮换 Token`);
        return { accessToken, refreshToken };
    }
    async revokeToken(token) {
        const payload = this.decodeToken(token);
        if (payload) {
            this.logger.info(`[TokenManager] Token 已撤销: ${payload.userId}`);
        }
    }
    generateSessionToken() {
        return (0, uuid_1.v4)();
    }
};
exports.TokenManagerService = TokenManagerService;
exports.TokenManagerService = TokenManagerService = TokenManagerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        logger_service_1.LoggerService,
        global_config_service_1.GlobalConfigService])
], TokenManagerService);
//# sourceMappingURL=token-manager.service.js.map