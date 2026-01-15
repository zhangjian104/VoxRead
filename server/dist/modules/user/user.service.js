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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../../core/database/models/user.model");
const playlist_model_1 = require("../../core/database/models/playlist.model");
const playback_session_model_1 = require("../../core/database/models/playback-session.model");
const media_progress_model_1 = require("../../core/database/models/media-progress.model");
const book_model_1 = require("../../core/database/models/book.model");
const podcast_episode_model_1 = require("../../core/database/models/podcast-episode.model");
const podcast_model_1 = require("../../core/database/models/podcast.model");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
const uuid_1 = require("uuid");
let UserService = class UserService {
    constructor(userModel, playlistModel, playbackSessionModel, mediaProgressModel, logger, socketGateway) {
        this.userModel = userModel;
        this.playlistModel = playlistModel;
        this.playbackSessionModel = playbackSessionModel;
        this.mediaProgressModel = mediaProgressModel;
        this.logger = logger;
        this.socketGateway = socketGateway;
    }
    async findAll(currentUser, include) {
        if (!currentUser.isAdminOrUp) {
            throw new common_1.ForbiddenException('用户权限不足');
        }
        const hideRootToken = !currentUser.isRoot;
        const includes = include || [];
        const allUsers = await this.userModel.findAll();
        const users = allUsers.map((u) => u.toJSONForBrowser(hideRootToken, true));
        if (includes.includes('latestSession')) {
            for (const user of users) {
                const userSessions = await this.playbackSessionModel.findAll({
                    where: { userId: user.id },
                    order: [['updatedAt', 'DESC']],
                    limit: 1,
                });
                user.latestSession = userSessions[0] || null;
            }
        }
        return { users };
    }
    async findOne(userId, currentUser) {
        if (!currentUser.isAdminOrUp) {
            this.logger.error(`非管理员用户 "${currentUser.username}" 尝试获取用户信息`);
            throw new common_1.ForbiddenException('用户权限不足');
        }
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('用户未找到');
        }
        const mediaProgresses = await this.mediaProgressModel.findAll({
            where: { userId: user.id },
            include: [
                {
                    model: book_model_1.Book,
                    attributes: ['id', 'title', 'coverPath', 'updatedAt'],
                },
                {
                    model: podcast_episode_model_1.PodcastEpisode,
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: podcast_model_1.Podcast,
                            attributes: ['id', 'title', 'coverPath', 'updatedAt'],
                        },
                    ],
                },
            ],
        });
        const oldMediaProgresses = mediaProgresses.map((mp) => {
            const oldMediaProgress = mp.getOldMediaProgress();
            oldMediaProgress.displayTitle = mp.mediaItem?.title;
            if (mp.mediaItem?.podcast) {
                oldMediaProgress.displaySubtitle = mp.mediaItem.podcast?.title;
                oldMediaProgress.coverPath = mp.mediaItem.podcast?.coverPath;
                oldMediaProgress.mediaUpdatedAt = mp.mediaItem.podcast?.updatedAt;
            }
            else if (mp.mediaItem) {
                oldMediaProgress.coverPath = mp.mediaItem.coverPath;
                oldMediaProgress.mediaUpdatedAt = mp.mediaItem.updatedAt;
            }
            return oldMediaProgress;
        });
        const userJson = user.toJSONForBrowser(!currentUser.isRoot);
        userJson.mediaProgress = oldMediaProgresses;
        return userJson;
    }
    async create(createUserDto, currentUser, hashPassword, generateAccessToken) {
        if (!createUserDto.username || !createUserDto.password || typeof createUserDto.username !== 'string' || typeof createUserDto.password !== 'string') {
            throw new common_1.BadRequestException('用户名和密码是必需的');
        }
        if (createUserDto.type && !this.userModel.accountTypes.includes(createUserDto.type)) {
            throw new common_1.BadRequestException('无效的账户类型');
        }
        const usernameExists = await this.userModel.checkUserExistsWithUsername(createUserDto.username);
        if (usernameExists) {
            throw new common_1.BadRequestException('用户名已被使用');
        }
        const userId = (0, uuid_1.v4)();
        const pash = await hashPassword(createUserDto.password);
        const token = generateAccessToken({ id: userId, username: createUserDto.username });
        const userType = createUserDto.type || 'user';
        let reqLibrariesAccessible = createUserDto.librariesAccessible || createUserDto.permissions?.librariesAccessible;
        if (reqLibrariesAccessible && (!Array.isArray(reqLibrariesAccessible) || reqLibrariesAccessible.some((libId) => typeof libId !== 'string'))) {
            this.logger.warn(`[UserService] create: 无效的 librariesAccessible 值: ${reqLibrariesAccessible}`);
            reqLibrariesAccessible = null;
        }
        let reqItemTagsSelected = createUserDto.itemTagsSelected || createUserDto.permissions?.itemTagsSelected;
        if (reqItemTagsSelected && (!Array.isArray(reqItemTagsSelected) || reqItemTagsSelected.some((tagId) => typeof tagId !== 'string'))) {
            this.logger.warn(`[UserService] create: 无效的 itemTagsSelected 值: ${reqItemTagsSelected}`);
            reqItemTagsSelected = null;
        }
        const permissions = this.userModel.getDefaultPermissionsForUserType(userType);
        if (createUserDto.permissions && typeof createUserDto.permissions === 'object') {
            for (const key in createUserDto.permissions) {
                if (permissions[key] !== undefined) {
                    if (typeof createUserDto.permissions[key] !== 'boolean') {
                        this.logger.warn(`[UserService] create: 权限键 ${key} 的值无效，应为布尔值`);
                    }
                    else {
                        permissions[key] = createUserDto.permissions[key];
                    }
                }
                else {
                    this.logger.warn(`[UserService] create: 无效的权限键: ${key}`);
                }
            }
        }
        permissions.itemTagsSelected = reqItemTagsSelected || [];
        permissions.librariesAccessible = reqLibrariesAccessible || [];
        const newUser = {
            id: userId,
            type: userType,
            username: createUserDto.username,
            email: typeof createUserDto.email === 'string' ? createUserDto.email : null,
            pash,
            token,
            isActive: !!createUserDto.isActive,
            permissions,
            bookmarks: [],
            extraData: {
                seriesHideFromContinueListening: [],
            },
        };
        const user = await this.userModel.create(newUser);
        if (user) {
            this.socketGateway.adminEmitter('user_added', user.toJSONForBrowser());
            return { user: user.toJSONForBrowser() };
        }
        else {
            throw new Error('保存新用户失败');
        }
    }
    async update(userId, updateUserDto, currentUser, hashPassword, generateAccessToken, invalidateJwtSessions, req, res) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('用户未找到');
        }
        if (user.isRoot && !currentUser.isRoot) {
            this.logger.error(`[UserService] 管理员用户 "${currentUser.username}" 尝试更新 root 用户`);
            throw new common_1.ForbiddenException('无权限更新 root 用户');
        }
        else if (user.isRoot) {
            delete updateUserDto.type;
        }
        const keysThatCannotBeUpdated = ['id', 'pash', 'token', 'extraData', 'bookmarks'];
        for (const key of keysThatCannotBeUpdated) {
            if (updateUserDto[key] !== undefined) {
                throw new common_1.BadRequestException(`键 "${key}" 不能被更新`);
            }
        }
        if (updateUserDto.email && typeof updateUserDto.email !== 'string') {
            throw new common_1.BadRequestException('无效的邮箱');
        }
        if (updateUserDto.username && typeof updateUserDto.username !== 'string') {
            throw new common_1.BadRequestException('无效的用户名');
        }
        if (updateUserDto.type && !this.userModel.accountTypes.includes(updateUserDto.type)) {
            throw new common_1.BadRequestException('无效的账户类型');
        }
        if (updateUserDto.permissions && typeof updateUserDto.permissions !== 'object') {
            throw new common_1.BadRequestException('无效的权限');
        }
        let hasUpdates = false;
        let shouldUpdateToken = false;
        let shouldInvalidateJwtSessions = false;
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const usernameExists = await this.userModel.checkUserExistsWithUsername(updateUserDto.username);
            if (usernameExists) {
                throw new common_1.BadRequestException('用户名已被使用');
            }
            user.username = updateUserDto.username;
            shouldUpdateToken = true;
            shouldInvalidateJwtSessions = true;
            hasUpdates = true;
        }
        if (updateUserDto.password) {
            user.pash = await hashPassword(updateUserDto.password);
            hasUpdates = true;
        }
        let hasPermissionsUpdates = false;
        let updateLibrariesAccessible = updateUserDto.librariesAccessible || updateUserDto.permissions?.librariesAccessible;
        if (updateLibrariesAccessible && (!Array.isArray(updateLibrariesAccessible) || updateLibrariesAccessible.some((libId) => typeof libId !== 'string'))) {
            this.logger.warn(`[UserService] update: 无效的 librariesAccessible 值: ${updateLibrariesAccessible}`);
            updateLibrariesAccessible = null;
        }
        let updateItemTagsSelected = updateUserDto.itemTagsSelected || updateUserDto.permissions?.itemTagsSelected;
        if (updateItemTagsSelected && (!Array.isArray(updateItemTagsSelected) || updateItemTagsSelected.some((tagId) => typeof tagId !== 'string'))) {
            this.logger.warn(`[UserService] update: 无效的 itemTagsSelected 值: ${updateItemTagsSelected}`);
            updateItemTagsSelected = null;
        }
        if (updateUserDto.permissions && typeof updateUserDto.permissions === 'object') {
            const permissions = { ...user.permissions };
            const defaultPermissions = this.userModel.getDefaultPermissionsForUserType(updateUserDto.type || user.type || 'user');
            for (const key in updateUserDto.permissions) {
                if (permissions[key] !== undefined || defaultPermissions[key] !== undefined) {
                    if (typeof updateUserDto.permissions[key] !== 'boolean') {
                        this.logger.warn(`[UserService] update: 权限键 ${key} 的值无效，应为布尔值`);
                    }
                    else if (permissions[key] !== updateUserDto.permissions[key]) {
                        permissions[key] = updateUserDto.permissions[key];
                        hasPermissionsUpdates = true;
                    }
                }
                else {
                    this.logger.warn(`[UserService] update: 无效的权限键: ${key}`);
                }
            }
            if (updateItemTagsSelected && updateItemTagsSelected.join(',') !== user.permissions.itemTagsSelected.join(',')) {
                permissions.itemTagsSelected = updateItemTagsSelected;
                hasPermissionsUpdates = true;
            }
            if (updateLibrariesAccessible && updateLibrariesAccessible.join(',') !== user.permissions.librariesAccessible.join(',')) {
                permissions.librariesAccessible = updateLibrariesAccessible;
                hasPermissionsUpdates = true;
            }
            updateUserDto.permissions = permissions;
        }
        if (hasPermissionsUpdates) {
            user.permissions = updateUserDto.permissions;
            user.changed('permissions', true);
            hasUpdates = true;
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            user.email = updateUserDto.email;
            hasUpdates = true;
        }
        if (updateUserDto.type && updateUserDto.type !== user.type) {
            user.type = updateUserDto.type;
            hasUpdates = true;
        }
        if (updateUserDto.isActive !== undefined && !!updateUserDto.isActive !== user.isActive) {
            user.isActive = updateUserDto.isActive;
            hasUpdates = true;
        }
        if (updateUserDto.lastSeen && typeof updateUserDto.lastSeen === 'number') {
            user.lastSeen = updateUserDto.lastSeen;
            hasUpdates = true;
        }
        if (hasUpdates) {
            if (shouldUpdateToken) {
                user.token = generateAccessToken(user);
                this.logger.info(`[UserService] 用户 ${user.username} 生成了新的 API token`);
            }
            if (shouldInvalidateJwtSessions) {
                const newAccessToken = await invalidateJwtSessions(user, req, res);
                if (newAccessToken) {
                    user.accessToken = newAccessToken;
                    user.refreshToken = null;
                    this.logger.info(`[UserService] 已使用户 ${user.username} 的 JWT 会话失效并轮换当前会话的令牌`);
                }
                else {
                    this.logger.info(`[UserService] 已使用户 ${user.username} 的 JWT 会话失效`);
                }
            }
            await user.save();
            this.socketGateway.clientEmitter(currentUser.id, 'user_updated', user.toJSONForBrowser());
        }
        return {
            success: true,
            user: user.toJSONForBrowser(),
        };
    }
    async delete(userId, currentUser) {
        if (userId === 'root') {
            this.logger.error('[UserService] 尝试删除 root 用户。root 用户不能被删除');
            throw new common_1.BadRequestException('root 用户不能被删除');
        }
        if (currentUser.id === userId) {
            this.logger.error(`[UserService] 用户 ${currentUser.username} 尝试删除自己`);
            throw new common_1.BadRequestException('不能删除自己');
        }
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('用户未找到');
        }
        const userPlaylists = await this.playlistModel.findAll({
            where: { userId: user.id },
        });
        for (const playlist of userPlaylists) {
            await playlist.destroy();
        }
        const [sessionsUpdated] = await this.playbackSessionModel.update({ userId: null }, { where: { userId: user.id } });
        this.logger.info(`[UserService] 更新了 ${sessionsUpdated} 个播放会话以移除用户 ID`);
        const userJson = user.toJSONForBrowser();
        await user.destroy();
        this.socketGateway.adminEmitter('user_removed', userJson);
    }
    async unlinkFromOpenID(userId, currentUser) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('用户未找到');
        }
        this.logger.debug(`[UserService] 取消用户 "${user.username}" 与 OpenID (sub: "${user.authOpenIDSub}") 的关联`);
        if (!user.authOpenIDSub) {
            return;
        }
        user.extraData.authOpenIDSub = null;
        user.changed('extraData', true);
        await user.save();
        this.socketGateway.clientEmitter(currentUser.id, 'user_updated', user.toJSONForBrowser());
    }
    async getOnlineUsers() {
        return {
            usersOnline: this.socketGateway.getUsersOnline(),
            openSessions: [],
        };
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
    async getListeningStats(userId) {
        return {};
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(playlist_model_1.Playlist)),
    __param(2, (0, sequelize_1.InjectModel)(playback_session_model_1.PlaybackSession)),
    __param(3, (0, sequelize_1.InjectModel)(media_progress_model_1.MediaProgress)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway])
], UserService);
//# sourceMappingURL=user.service.js.map