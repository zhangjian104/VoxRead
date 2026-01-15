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
exports.MeService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../../core/database/models/user.model");
const media_progress_model_1 = require("../../core/database/models/media-progress.model");
const library_item_model_1 = require("../../core/database/models/library-item.model");
const series_model_1 = require("../../core/database/models/series.model");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
let MeService = class MeService {
    constructor(userModel, mediaProgressModel, libraryItemModel, seriesModel, logger, socketGateway) {
        this.userModel = userModel;
        this.mediaProgressModel = mediaProgressModel;
        this.libraryItemModel = libraryItemModel;
        this.seriesModel = seriesModel;
        this.logger = logger;
        this.socketGateway = socketGateway;
    }
    getCurrentUser(user) {
        return user.toJSONForBrowser();
    }
    async getListeningSessions(userId, page, itemsPerPage) {
        return {
            total: 0,
            numPages: 0,
            page,
            itemsPerPage,
            sessions: [],
        };
    }
    async getItemListeningSessions(userId, libraryItemId, episodeId, page, itemsPerPage) {
        const libraryItem = await this.libraryItemModel.findByPk(libraryItemId);
        if (!libraryItem) {
            this.logger.error(`[MeService] 媒体项未找到，ID: "${libraryItemId}"`);
            throw new common_1.NotFoundException('媒体项未找到');
        }
        return {
            total: 0,
            numPages: 0,
            page,
            itemsPerPage,
            sessions: [],
        };
    }
    async getListeningStats(userId) {
        return {};
    }
    async getMediaProgress(user, libraryItemId, episodeId) {
        const mediaProgress = user.getOldMediaProgress(libraryItemId, episodeId || null);
        if (!mediaProgress) {
            throw new common_1.NotFoundException('媒体进度未找到');
        }
        return mediaProgress;
    }
    async removeMediaProgress(user, progressId) {
        await this.mediaProgressModel.removeById(progressId);
        user.mediaProgresses = user.mediaProgresses.filter((mp) => mp.id !== progressId);
        this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
    }
    async createUpdateMediaProgress(user, libraryItemId, episodeId, progressData) {
        const progressUpdatePayload = {
            ...progressData,
            libraryItemId,
            episodeId,
        };
        const mediaProgressResponse = await user.createUpdateMediaProgressFromPayload(progressUpdatePayload);
        if (mediaProgressResponse.error) {
            throw new common_1.BadRequestException(mediaProgressResponse.error);
        }
        this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
    }
    async batchUpdateMediaProgress(user, itemProgressPayloads) {
        if (!itemProgressPayloads?.length) {
            throw new common_1.BadRequestException('缺少请求载荷');
        }
        let hasUpdated = false;
        for (const itemProgress of itemProgressPayloads) {
            const mediaProgressResponse = await user.createUpdateMediaProgressFromPayload(itemProgress);
            if (mediaProgressResponse.error) {
                this.logger.error(`[MeService] batchUpdateMediaProgress: ${mediaProgressResponse.error}`);
                continue;
            }
            else {
                hasUpdated = true;
            }
        }
        if (hasUpdated) {
            this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
        }
    }
    async createBookmark(user, libraryItemId, time, title) {
        const exists = await this.libraryItemModel.checkExistsById(libraryItemId);
        if (!exists) {
            throw new common_1.NotFoundException('媒体项未找到');
        }
        if (isNaN(time) || time === null) {
            this.logger.error(`[MeService] createBookmark 无效的时间`, time);
            throw new common_1.BadRequestException('无效的时间');
        }
        if (!title || typeof title !== 'string') {
            this.logger.error(`[MeService] createBookmark 无效的标题`, title);
            throw new common_1.BadRequestException('无效的标题');
        }
        const bookmark = await user.createBookmark(libraryItemId, time, title);
        this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
        return bookmark;
    }
    async updateBookmark(user, libraryItemId, time, title) {
        const exists = await this.libraryItemModel.checkExistsById(libraryItemId);
        if (!exists) {
            throw new common_1.NotFoundException('媒体项未找到');
        }
        if (isNaN(time) || time === null) {
            this.logger.error(`[MeService] updateBookmark 无效的时间`, time);
            throw new common_1.BadRequestException('无效的时间');
        }
        if (!title || typeof title !== 'string') {
            this.logger.error(`[MeService] updateBookmark 无效的标题`, title);
            throw new common_1.BadRequestException('无效的标题');
        }
        const bookmark = await user.updateBookmark(libraryItemId, time, title);
        if (!bookmark) {
            this.logger.error(`[MeService] updateBookmark 未找到书签，媒体项 ID: "${libraryItemId}"，时间: "${time}"`);
            throw new common_1.NotFoundException('书签未找到');
        }
        this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
        return bookmark;
    }
    async removeBookmark(user, libraryItemId, time) {
        const exists = await this.libraryItemModel.checkExistsById(libraryItemId);
        if (!exists) {
            throw new common_1.NotFoundException('媒体项未找到');
        }
        if (isNaN(time)) {
            throw new common_1.BadRequestException('无效的时间');
        }
        if (!user.findBookmark(libraryItemId, time)) {
            this.logger.error(`[MeService] removeBookmark 未找到书签`);
            throw new common_1.NotFoundException('书签未找到');
        }
        await user.removeBookmark(libraryItemId, time);
        this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
    }
    async updatePassword(user, currentPassword, newPassword, changePassword) {
        if (user.isGuest) {
            this.logger.error(`[MeService] 访客用户 "${user.username}" 尝试修改密码`);
            throw new common_1.ForbiddenException('访客用户不能修改密码');
        }
        if ((typeof currentPassword !== 'string' && currentPassword !== null) || (typeof newPassword !== 'string' && newPassword !== null)) {
            throw new common_1.BadRequestException('缺少或无效的当前密码或新密码');
        }
        const result = await changePassword(user, currentPassword, newPassword);
        if (result.error) {
            throw new common_1.BadRequestException(result.error);
        }
    }
    async getAllLibraryItemsInProgress(user, limit) {
        const mediaProgressesInProgress = user.mediaProgresses.filter((mp) => !mp.isFinished && (mp.currentTime > 0 || mp.ebookProgress > 0));
        const libraryItemsIds = [...new Set(mediaProgressesInProgress.map((mp) => mp.extraData?.libraryItemId).filter((id) => id))];
        const libraryItems = await this.libraryItemModel.findAllExpandedWhere({ id: libraryItemsIds });
        let itemsInProgress = [];
        for (const mediaProgress of mediaProgressesInProgress) {
            const oldMediaProgress = mediaProgress.getOldMediaProgress();
            const libraryItem = libraryItems.find((li) => li.id === oldMediaProgress.libraryItemId);
            if (libraryItem) {
                if (oldMediaProgress.episodeId && libraryItem.isPodcast) {
                    const episode = libraryItem.media.podcastEpisodes.find((ep) => ep.id === oldMediaProgress.episodeId);
                    if (episode) {
                        const libraryItemWithEpisode = {
                            ...libraryItem.toOldJSONMinified(),
                            recentEpisode: episode.toOldJSON(libraryItem.id),
                            progressLastUpdate: oldMediaProgress.lastUpdate,
                        };
                        itemsInProgress.push(libraryItemWithEpisode);
                    }
                }
                else if (!oldMediaProgress.episodeId) {
                    itemsInProgress.push({
                        ...libraryItem.toOldJSONMinified(),
                        progressLastUpdate: oldMediaProgress.lastUpdate,
                    });
                }
            }
        }
        itemsInProgress = itemsInProgress.sort((a, b) => b.progressLastUpdate - a.progressLastUpdate).slice(0, limit);
        return {
            libraryItems: itemsInProgress,
        };
    }
    async removeSeriesFromContinueListening(user, seriesId) {
        const exists = await this.seriesModel.checkExistsById(seriesId);
        if (!exists) {
            this.logger.error(`[MeService] removeSeriesFromContinueListening: 系列 ${seriesId} 未找到`);
            throw new common_1.NotFoundException('系列未找到');
        }
        const hasUpdated = await user.addSeriesToHideFromContinueListening(seriesId);
        if (hasUpdated) {
            this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
        }
        return user.toJSONForBrowser();
    }
    async readdSeriesFromContinueListening(user, seriesId) {
        const exists = await this.seriesModel.checkExistsById(seriesId);
        if (!exists) {
            this.logger.error(`[MeService] readdSeriesFromContinueListening: 系列 ${seriesId} 未找到`);
            throw new common_1.NotFoundException('系列未找到');
        }
        const hasUpdated = await user.removeSeriesFromHideFromContinueListening(seriesId);
        if (hasUpdated) {
            this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
        }
        return user.toJSONForBrowser();
    }
    async removeItemFromContinueListening(user, progressId) {
        const mediaProgress = user.mediaProgresses.find((mp) => mp.id === progressId);
        if (!mediaProgress) {
            throw new common_1.NotFoundException('媒体进度未找到');
        }
        if (mediaProgress.hideFromContinueListening) {
            return user.toJSONForBrowser();
        }
        mediaProgress.hideFromContinueListening = true;
        await mediaProgress.save();
        this.socketGateway.clientEmitter(user.id, 'user_updated', user.toJSONForBrowser());
        return user.toJSONForBrowser();
    }
    async updateUserEReaderDevices(user, ereaderDevices) {
        if (!ereaderDevices || !Array.isArray(ereaderDevices)) {
            throw new common_1.BadRequestException('无效的载荷。需要 ereaderDevices 数组');
        }
        for (const device of ereaderDevices) {
            if (!device.name || !device.email) {
                throw new common_1.BadRequestException('无效的载荷。ereaderDevices 数组项必须包含 name 和 email');
            }
            else if (device.availabilityOption !== 'specificUsers' || device.users?.length !== 1 || device.users[0] !== user.id) {
                throw new common_1.BadRequestException('无效的载荷。ereaderDevices 数组项必须具有 availabilityOption "specificUsers" 且仅包含当前用户');
            }
        }
        return {
            ereaderDevices: [],
        };
    }
    async getStatsForYear(userId, year) {
        if (isNaN(year) || year < 2000 || year > 9999) {
            this.logger.error(`[MeService] 无效的年份 "${year}"`);
            throw new common_1.BadRequestException('无效的年份');
        }
        return {};
    }
};
exports.MeService = MeService;
exports.MeService = MeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(media_progress_model_1.MediaProgress)),
    __param(2, (0, sequelize_1.InjectModel)(library_item_model_1.LibraryItem)),
    __param(3, (0, sequelize_1.InjectModel)(series_model_1.Series)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway])
], MeService);
//# sourceMappingURL=me.service.js.map