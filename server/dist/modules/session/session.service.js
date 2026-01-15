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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const playback_session_model_1 = require("../../core/database/models/playback-session.model");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
let SessionService = class SessionService {
    constructor(playbackSessionModel, logger, socketGateway) {
        this.playbackSessionModel = playbackSessionModel;
        this.logger = logger;
        this.socketGateway = socketGateway;
    }
    async getAllWithUserData(user) {
        if (!user.isAdminOrUp) {
            this.logger.error(`[SessionService] 非管理员用户 "${user.username}" 尝试获取所有会话`);
            throw new common_1.ForbiddenException('用户权限不足');
        }
        return {
            sessions: [],
            openSessions: [],
        };
    }
    async getLibrarySessions(user, libraryId) {
        if (!user.isAdminOrUp) {
            this.logger.error(`[SessionService] 非管理员用户 "${user.username}" 尝试获取媒体库会话`);
            throw new common_1.ForbiddenException('用户权限不足');
        }
        const sessions = await this.playbackSessionModel.findAll({
            where: { libraryId },
            order: [['updatedAt', 'DESC']],
            limit: 50,
        });
        return {
            sessions: sessions.map((s) => s.toOldJSON()),
        };
    }
    async delete(sessionId, user) {
        if (!user.canDelete) {
            this.logger.warn(`[SessionService] 用户 "${user.username}" 无删除权限`);
            throw new common_1.ForbiddenException('用户权限不足');
        }
        const session = await this.playbackSessionModel.findByPk(sessionId);
        if (!session) {
            this.logger.error(`[SessionService] 未找到播放会话 id=${sessionId}`);
            throw new common_1.NotFoundException('播放会话未找到');
        }
        await session.destroy();
    }
    async batchDelete(sessionIds, user) {
        if (!user.canDelete) {
            this.logger.warn(`[SessionService] 用户 "${user.username}" 无删除权限`);
            throw new common_1.ForbiddenException('用户权限不足');
        }
        if (!sessionIds || !sessionIds.length) {
            return;
        }
        await this.playbackSessionModel.destroy({
            where: {
                id: sessionIds,
            },
        });
        this.logger.info(`[SessionService] 删除了 ${sessionIds.length} 个播放会话`);
    }
    async getOpenSession(sessionId) {
        throw new common_1.NotFoundException('打开的会话未找到');
    }
    async syncOpenSession(sessionId, syncData, user) {
        throw new common_1.NotFoundException('打开的会话未找到');
    }
    async closeSession(sessionId, syncData, user) {
        throw new common_1.NotFoundException('会话未找到');
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(playback_session_model_1.PlaybackSession)),
    __metadata("design:paramtypes", [Object, logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway])
], SessionService);
//# sourceMappingURL=session.service.js.map