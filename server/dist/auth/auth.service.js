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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const logger_service_1 = require("../core/logger/logger.service");
const token_manager_service_1 = require("./services/token-manager.service");
const database_service_1 = require("../core/database/database.service");
let AuthService = class AuthService {
    constructor(logger, tokenManager, database) {
        this.logger = logger;
        this.tokenManager = tokenManager;
        this.database = database;
    }
    async validateLocalUser(username, password, clientIp) {
        try {
            const user = await this.getUserByUsername(username.toLowerCase());
            if (!user || !user.isActive) {
                this.logFailedLoginAttempt(username, clientIp, user ? 'User is not active' : 'User not found');
                return null;
            }
            if (user.type === 'root' && !user.pash) {
                if (password) {
                    this.logFailedLoginAttempt(username, clientIp, 'Root user has no password set');
                    return null;
                }
                this.logger.info(`[AuthService] Root 用户 "${username}" 无密码登录成功, IP: ${clientIp}`);
                return user;
            }
            if (!user.pash) {
                this.logFailedLoginAttempt(username, clientIp, 'User has no password set');
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.pash);
            if (!isPasswordValid) {
                this.logFailedLoginAttempt(username, clientIp, 'Invalid password');
                return null;
            }
            this.logger.info(`[AuthService] 用户 "${username}" 登录成功, IP: ${clientIp}`);
            return user;
        }
        catch (error) {
            this.logger.error('[AuthService] 验证用户时发生错误:', error);
            return null;
        }
    }
    logFailedLoginAttempt(username, clientIp, reason) {
        this.logger.warn(`[AuthService] 登录失败: 用户="${username}", IP=${clientIp}, 原因=${reason}`);
    }
    async getUserByUsername(username) {
        try {
            const { User } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            return await User.getUserByUsername(username);
        }
        catch (error) {
            this.logger.error('[AuthService] 获取用户失败:', error);
            return null;
        }
    }
    async getUserById(userId) {
        try {
            const { User } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            return await User.getUserById(userId);
        }
        catch (error) {
            this.logger.error('[AuthService] 获取用户失败:', error);
            return null;
        }
    }
    async getUserByIdOrOldId(userId) {
        try {
            const { User } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            return await User.getUserByIdOrOldId(userId);
        }
        catch (error) {
            this.logger.error('[AuthService] 获取用户失败:', error);
            return null;
        }
    }
    async validateApiKey(keyId) {
        try {
            const { ApiKey } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            return await ApiKey.getById(keyId);
        }
        catch (error) {
            this.logger.error('[AuthService] 验证 API Key 失败:', error);
            return null;
        }
    }
    async deactivateApiKey(keyId) {
        try {
            this.logger.info(`[AuthService] 停用过期的 API Key: ${keyId}`);
            const { ApiKey } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            const apiKey = await ApiKey.getById(keyId);
            if (apiKey) {
                await apiKey.deactivate();
            }
        }
        catch (error) {
            this.logger.error('[AuthService] 停用 API Key 失败:', error);
        }
    }
    async findOrCreateOidcUser(userinfo) {
        try {
            const { User } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            let user = await User.getUserByOpenIDSub(userinfo.sub);
            if (!user && global.ServerSettings?.authOpenIDAutoRegister) {
                this.logger.info(`[AuthService] 自动注册 OIDC 用户: ${userinfo.sub}`);
            }
            return user;
        }
        catch (error) {
            this.logger.error('[AuthService] 查找或创建 OIDC 用户失败:', error);
            return null;
        }
    }
    async updateUserFromOidcClaims(user, userinfo) {
        try {
            this.logger.debug(`[AuthService] 更新用户 ${user.username} 的 OIDC 权限`);
        }
        catch (error) {
            this.logger.error('[AuthService] 更新 OIDC 用户权限失败:', error);
        }
    }
    async deleteUser(userId) {
        try {
            const { User } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            const user = await User.findByPk(userId);
            if (user) {
                await user.destroy();
                this.logger.info(`[AuthService] 删除用户: ${userId}`);
            }
        }
        catch (error) {
            this.logger.error('[AuthService] 删除用户失败:', error);
        }
    }
    async login(user) {
        const { accessToken, refreshToken } = this.tokenManager.rotateTokens(user);
        user.lastSeen = new Date();
        await user.save();
        return {
            accessToken,
            refreshToken,
            user: this.sanitizeUserForResponse(user),
        };
    }
    async refreshToken(refreshToken) {
        const payload = this.tokenManager.verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.getUserById(payload.userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return this.tokenManager.rotateTokens(user);
    }
    async logout(token) {
        await this.tokenManager.revokeToken(token);
        this.logger.info('[AuthService] 用户已登出');
    }
    sanitizeUserForResponse(user) {
        const { pash, ...sanitized } = user;
        return sanitized;
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.pash) {
            const isValid = await bcrypt.compare(oldPassword, user.pash);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid old password');
            }
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.pash = hashedPassword;
        await user.save();
        this.logger.info(`[AuthService] 用户 ${user.username} 修改密码成功`);
    }
    async createRootUser(username, password) {
        try {
            const { User } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            const user = await User.createRootUser(username, hashedPassword);
            this.logger.info(`[AuthService] 创建 root 用户: ${username}`);
            return user;
        }
        catch (error) {
            this.logger.error('[AuthService] 创建 root 用户失败:', error);
            throw error;
        }
    }
    async hasRootUser() {
        try {
            const { User } = await Promise.resolve().then(() => __importStar(require('../core/database/models')));
            const count = await User.count({ where: { type: 'root' } });
            return count > 0;
        }
        catch (error) {
            this.logger.error('[AuthService] 检查 root 用户失败:', error);
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        token_manager_service_1.TokenManagerService,
        database_service_1.DatabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map