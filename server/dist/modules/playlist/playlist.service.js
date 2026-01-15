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
exports.PlaylistService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const playlist_model_1 = require("../../core/database/models/playlist.model");
const playlist_media_item_model_1 = require("../../core/database/models/playlist-media-item.model");
const library_item_model_1 = require("../../core/database/models/library-item.model");
const podcast_episode_model_1 = require("../../core/database/models/podcast-episode.model");
const collection_model_1 = require("../../core/database/models/collection.model");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
const sequelize_typescript_1 = require("sequelize-typescript");
let PlaylistService = class PlaylistService {
    constructor(playlistModel, playlistMediaItemModel, libraryItemModel, podcastEpisodeModel, collectionModel, sequelize, logger, socketGateway) {
        this.playlistModel = playlistModel;
        this.playlistMediaItemModel = playlistMediaItemModel;
        this.libraryItemModel = libraryItemModel;
        this.podcastEpisodeModel = podcastEpisodeModel;
        this.collectionModel = collectionModel;
        this.sequelize = sequelize;
        this.logger = logger;
        this.socketGateway = socketGateway;
    }
    async create(createDto, user) {
        if (!createDto.name || !createDto.libraryId) {
            throw new common_1.BadRequestException('播放列表数据无效');
        }
        if (createDto.description && typeof createDto.description !== 'string') {
            throw new common_1.BadRequestException('播放列表描述无效');
        }
        const items = createDto.items || [];
        const isPodcast = items.some((i) => i.episodeId);
        const libraryItemIds = new Set();
        for (const item of items) {
            if (!item.libraryItemId || typeof item.libraryItemId !== 'string') {
                throw new common_1.BadRequestException('无效的播放列表项');
            }
            if (isPodcast && (!item.episodeId || typeof item.episodeId !== 'string')) {
                throw new common_1.BadRequestException('无效的播放列表项 episodeId');
            }
            else if (!isPodcast && item.episodeId) {
                throw new common_1.BadRequestException('无效的播放列表项 episodeId');
            }
            libraryItemIds.add(item.libraryItemId);
        }
        const libraryItems = await this.libraryItemModel.findAll({
            attributes: ['id', 'mediaId', 'mediaType', 'libraryId'],
            where: {
                id: Array.from(libraryItemIds),
                libraryId: createDto.libraryId,
                mediaType: isPodcast ? 'podcast' : 'book',
            },
        });
        if (libraryItems.length !== libraryItemIds.size) {
            throw new common_1.BadRequestException('播放列表数据无效。无效的项目');
        }
        if (isPodcast) {
            const podcastEpisodeIds = items.map((i) => i.episodeId);
            const podcastEpisodes = await this.podcastEpisodeModel.findAll({
                attributes: ['id'],
                where: {
                    id: podcastEpisodeIds,
                },
            });
            if (podcastEpisodes.length !== podcastEpisodeIds.length) {
                throw new common_1.BadRequestException('播放列表数据无效。无效的播客剧集');
            }
        }
        const transaction = await this.sequelize.transaction();
        try {
            const newPlaylist = await this.playlistModel.create({
                libraryId: createDto.libraryId,
                userId: user.id,
                name: createDto.name,
                description: createDto.description || null,
            }, { transaction });
            const playlistItemPayloads = [];
            for (const [index, item] of items.entries()) {
                const libraryItem = libraryItems.find((li) => li.id === item.libraryItemId);
                playlistItemPayloads.push({
                    playlistId: newPlaylist.id,
                    mediaItemId: item.episodeId || libraryItem.mediaId,
                    mediaItemType: item.episodeId ? 'podcastEpisode' : 'book',
                    order: index + 1,
                });
            }
            await this.playlistMediaItemModel.bulkCreate(playlistItemPayloads, { transaction });
            await transaction.commit();
            newPlaylist.playlistMediaItems = await newPlaylist.getMediaItemsExpandedWithLibraryItem();
            const jsonExpanded = newPlaylist.toOldJSONExpanded();
            this.socketGateway.clientEmitter(newPlaylist.userId, 'playlist_added', jsonExpanded);
            return jsonExpanded;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('[PlaylistService] create:', error);
            throw new Error('创建播放列表失败');
        }
    }
    async findAllForUser(userId) {
        const playlistsForUser = await this.playlistModel.getOldPlaylistsForUserAndLibrary(userId);
        return { playlists: playlistsForUser };
    }
    async findOne(playlistId, userId) {
        const playlist = await this.playlistModel.findByPk(playlistId);
        if (!playlist) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (playlist.userId !== userId) {
            this.logger.warn(`[PlaylistService] 播放列表 ${playlistId} 被非所有者用户 ${userId} 请求`);
            throw new common_1.NotFoundException('播放列表未找到');
        }
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        return playlist.toOldJSONExpanded();
    }
    async update(playlistId, updateDto, userId) {
        const playlist = await this.playlistModel.findByPk(playlistId);
        if (!playlist) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (playlist.userId !== userId) {
            this.logger.warn(`[PlaylistService] 播放列表 ${playlistId} 被非所有者用户 ${userId} 尝试更新`);
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (updateDto.libraryId || updateDto.userId) {
            throw new common_1.BadRequestException('播放列表数据无效。不能更新 libraryId 或 userId');
        }
        if (updateDto.name && typeof updateDto.name !== 'string') {
            throw new common_1.BadRequestException('无效的播放列表名称');
        }
        if (updateDto.description && typeof updateDto.description !== 'string') {
            throw new common_1.BadRequestException('无效的播放列表描述');
        }
        if (updateDto.items && (!Array.isArray(updateDto.items) || updateDto.items.some((i) => !i.libraryItemId || typeof i.libraryItemId !== 'string' || (i.episodeId && typeof i.episodeId !== 'string')))) {
            throw new common_1.BadRequestException('无效的播放列表项目');
        }
        const playlistUpdatePayload = {};
        if (updateDto.name)
            playlistUpdatePayload.name = updateDto.name;
        if (updateDto.description)
            playlistUpdatePayload.description = updateDto.description;
        let wasUpdated = false;
        if (Object.keys(playlistUpdatePayload).length) {
            playlist.set(playlistUpdatePayload);
            const changed = playlist.changed();
            if (changed?.length) {
                await playlist.save();
                this.logger.debug(`[PlaylistService] 更新播放列表 ${playlist.id}，键 [${changed.join(',')}]`);
                wasUpdated = true;
            }
        }
        if (updateDto.items?.length) {
            const libraryItemIds = Array.from(new Set(updateDto.items.map((i) => i.libraryItemId)));
            const libraryItems = await this.libraryItemModel.findAll({
                attributes: ['id', 'mediaId', 'mediaType'],
                where: {
                    id: libraryItemIds,
                },
            });
            if (libraryItems.length !== libraryItemIds.length) {
                throw new common_1.BadRequestException('无效的播放列表项目。项目未找到');
            }
            const existingPlaylistMediaItems = await playlist.getPlaylistMediaItems({
                order: [['order', 'ASC']],
            });
            if (existingPlaylistMediaItems.length !== updateDto.items.length) {
                throw new common_1.BadRequestException('无效的播放列表项目。长度不匹配');
            }
            const newMediaItemIdOrder = [];
            for (const item of updateDto.items) {
                const libraryItem = libraryItems.find((li) => li.id === item.libraryItemId);
                const mediaItemId = item.episodeId || libraryItem.mediaId;
                newMediaItemIdOrder.push(mediaItemId);
            }
            existingPlaylistMediaItems.sort((a, b) => {
                const aIndex = newMediaItemIdOrder.findIndex((i) => i === a.mediaItemId);
                const bIndex = newMediaItemIdOrder.findIndex((i) => i === b.mediaItemId);
                return aIndex - bIndex;
            });
            for (const [index, playlistMediaItem] of existingPlaylistMediaItems.entries()) {
                if (playlistMediaItem.order !== index + 1) {
                    await playlistMediaItem.update({
                        order: index + 1,
                    });
                    wasUpdated = true;
                }
            }
        }
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        const jsonExpanded = playlist.toOldJSONExpanded();
        if (wasUpdated) {
            this.socketGateway.clientEmitter(playlist.userId, 'playlist_updated', jsonExpanded);
        }
        return jsonExpanded;
    }
    async delete(playlistId, userId) {
        const playlist = await this.playlistModel.findByPk(playlistId);
        if (!playlist) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (playlist.userId !== userId) {
            this.logger.warn(`[PlaylistService] 播放列表 ${playlistId} 被非所有者用户 ${userId} 尝试删除`);
            throw new common_1.NotFoundException('播放列表未找到');
        }
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        const jsonExpanded = playlist.toOldJSONExpanded();
        await playlist.destroy();
        this.socketGateway.clientEmitter(jsonExpanded.userId, 'playlist_removed', jsonExpanded);
    }
    async addItem(playlistId, itemToAdd, userId) {
        const playlist = await this.playlistModel.findByPk(playlistId);
        if (!playlist) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (playlist.userId !== userId) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (!itemToAdd.libraryItemId) {
            throw new common_1.BadRequestException('请求体没有 libraryItemId');
        }
        const libraryItem = await this.libraryItemModel.getExpandedById(itemToAdd.libraryItemId);
        if (!libraryItem) {
            throw new common_1.BadRequestException('媒体项未找到');
        }
        if (libraryItem.libraryId !== playlist.libraryId) {
            throw new common_1.BadRequestException('媒体项在不同的媒体库中');
        }
        if ((itemToAdd.episodeId && !libraryItem.isPodcast) || (libraryItem.isPodcast && !itemToAdd.episodeId)) {
            throw new common_1.BadRequestException('此媒体库类型的无效添加项');
        }
        if (itemToAdd.episodeId && !libraryItem.media.podcastEpisodes.some((pe) => pe.id === itemToAdd.episodeId)) {
            throw new common_1.BadRequestException('媒体项中未找到剧集');
        }
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        if (playlist.checkHasMediaItem(itemToAdd.libraryItemId, itemToAdd.episodeId)) {
            throw new common_1.BadRequestException('项目已在播放列表中');
        }
        const playlistMediaItem = {
            playlistId: playlist.id,
            mediaItemId: itemToAdd.episodeId || libraryItem.media.id,
            mediaItemType: itemToAdd.episodeId ? 'podcastEpisode' : 'book',
            order: playlist.playlistMediaItems.length + 1,
        };
        await this.playlistMediaItemModel.create(playlistMediaItem);
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        const jsonExpanded = playlist.toOldJSONExpanded();
        this.socketGateway.clientEmitter(jsonExpanded.userId, 'playlist_updated', jsonExpanded);
        return jsonExpanded;
    }
    async removeItem(playlistId, libraryItemId, episodeId, userId) {
        const playlist = await this.playlistModel.findByPk(playlistId);
        if (!playlist) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (playlist.userId !== userId) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        let playlistMediaItem = null;
        if (episodeId) {
            playlistMediaItem = playlist.playlistMediaItems.find((pmi) => pmi.mediaItemId === episodeId);
        }
        else {
            playlistMediaItem = playlist.playlistMediaItems.find((pmi) => pmi.mediaItem.libraryItem?.id === libraryItemId);
        }
        if (!playlistMediaItem) {
            throw new common_1.NotFoundException('播放列表中未找到媒体项');
        }
        await playlistMediaItem.destroy();
        playlist.playlistMediaItems = playlist.playlistMediaItems.filter((pmi) => pmi.id !== playlistMediaItem.id);
        for (const [index, mediaItem] of playlist.playlistMediaItems.entries()) {
            if (mediaItem.order !== index + 1) {
                await mediaItem.update({
                    order: index + 1,
                });
            }
        }
        const jsonExpanded = playlist.toOldJSONExpanded();
        if (!jsonExpanded.items.length) {
            this.logger.info(`[PlaylistService] 播放列表 "${jsonExpanded.name}" 没有更多项目 - 删除它`);
            await playlist.destroy();
            this.socketGateway.clientEmitter(jsonExpanded.userId, 'playlist_removed', jsonExpanded);
        }
        else {
            this.socketGateway.clientEmitter(jsonExpanded.userId, 'playlist_updated', jsonExpanded);
        }
        return jsonExpanded;
    }
    async addBatch(playlistId, items, userId) {
        const playlist = await this.playlistModel.findByPk(playlistId);
        if (!playlist) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (playlist.userId !== userId) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (!items?.length || !Array.isArray(items) || items.some((i) => !i?.libraryItemId || typeof i.libraryItemId !== 'string' || (i.episodeId && typeof i.episodeId !== 'string'))) {
            throw new common_1.BadRequestException('无效的请求体项目');
        }
        const libraryItemIds = new Set(items.map((i) => i.libraryItemId).filter((i) => i));
        const libraryItems = await this.libraryItemModel.findAllExpandedWhere({ id: Array.from(libraryItemIds) });
        if (libraryItems.length !== libraryItemIds.size) {
            throw new common_1.BadRequestException('无效的请求体项目');
        }
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        const mediaItemsToAdd = [];
        let order = playlist.playlistMediaItems.length + 1;
        for (const item of items) {
            const libraryItem = libraryItems.find((li) => li.id === item.libraryItemId);
            const mediaItemId = item.episodeId || libraryItem.media.id;
            if (playlist.playlistMediaItems.some((pmi) => pmi.mediaItemId === mediaItemId)) {
                continue;
            }
            else {
                mediaItemsToAdd.push({
                    playlistId: playlist.id,
                    mediaItemId,
                    mediaItemType: item.episodeId ? 'podcastEpisode' : 'book',
                    order: order++,
                });
            }
        }
        if (mediaItemsToAdd.length) {
            await this.playlistMediaItemModel.bulkCreate(mediaItemsToAdd);
            playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
            const jsonExpanded = playlist.toOldJSONExpanded();
            this.socketGateway.clientEmitter(playlist.userId, 'playlist_updated', jsonExpanded);
            return jsonExpanded;
        }
        return playlist.toOldJSONExpanded();
    }
    async removeBatch(playlistId, items, userId) {
        const playlist = await this.playlistModel.findByPk(playlistId);
        if (!playlist) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (playlist.userId !== userId) {
            throw new common_1.NotFoundException('播放列表未找到');
        }
        if (!items?.length || !Array.isArray(items) || items.some((i) => !i?.libraryItemId || typeof i.libraryItemId !== 'string' || (i.episodeId && typeof i.episodeId !== 'string'))) {
            throw new common_1.BadRequestException('无效的请求体项目');
        }
        playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
        let hasUpdated = false;
        for (const item of items) {
            let playlistMediaItem = null;
            if (item.episodeId) {
                playlistMediaItem = playlist.playlistMediaItems.find((pmi) => pmi.mediaItemId === item.episodeId);
            }
            else {
                playlistMediaItem = playlist.playlistMediaItems.find((pmi) => pmi.mediaItem.libraryItem?.id === item.libraryItemId);
            }
            if (!playlistMediaItem) {
                this.logger.warn(`[PlaylistService] 播放列表 ${playlist.id} 中未找到播放列表项`, item);
                continue;
            }
            await playlistMediaItem.destroy();
            playlist.playlistMediaItems = playlist.playlistMediaItems.filter((pmi) => pmi.id !== playlistMediaItem.id);
            hasUpdated = true;
        }
        const jsonExpanded = playlist.toOldJSONExpanded();
        if (hasUpdated) {
            if (!playlist.playlistMediaItems.length) {
                this.logger.info(`[PlaylistService] 播放列表 "${playlist.name}" 没有更多项目 - 删除它`);
                await playlist.destroy();
                this.socketGateway.clientEmitter(jsonExpanded.userId, 'playlist_removed', jsonExpanded);
            }
            else {
                this.socketGateway.clientEmitter(jsonExpanded.userId, 'playlist_updated', jsonExpanded);
            }
        }
        return jsonExpanded;
    }
    async createFromCollection(collectionId, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        const collectionExpanded = await collection.getOldJsonExpanded(user);
        if (!collectionExpanded) {
            throw new common_1.NotFoundException('集合未找到');
        }
        if (!collectionExpanded.books.length) {
            throw new common_1.BadRequestException('集合没有图书');
        }
        const transaction = await this.sequelize.transaction();
        try {
            const playlist = await this.playlistModel.create({
                userId: user.id,
                libraryId: collection.libraryId,
                name: collection.name,
                description: collection.description || null,
            }, { transaction });
            const mediaItemsToAdd = [];
            for (const [index, libraryItem] of collectionExpanded.books.entries()) {
                mediaItemsToAdd.push({
                    playlistId: playlist.id,
                    mediaItemId: libraryItem.media.id,
                    mediaItemType: 'book',
                    order: index + 1,
                });
            }
            await this.playlistMediaItemModel.bulkCreate(mediaItemsToAdd, { transaction });
            await transaction.commit();
            playlist.playlistMediaItems = await playlist.getMediaItemsExpandedWithLibraryItem();
            const jsonExpanded = playlist.toOldJSONExpanded();
            this.socketGateway.clientEmitter(playlist.userId, 'playlist_added', jsonExpanded);
            return jsonExpanded;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('[PlaylistService] createFromCollection:', error);
            throw new Error('从集合创建播放列表失败');
        }
    }
};
exports.PlaylistService = PlaylistService;
exports.PlaylistService = PlaylistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(playlist_model_1.Playlist)),
    __param(1, (0, sequelize_1.InjectModel)(playlist_media_item_model_1.PlaylistMediaItem)),
    __param(2, (0, sequelize_1.InjectModel)(library_item_model_1.LibraryItem)),
    __param(3, (0, sequelize_1.InjectModel)(podcast_episode_model_1.PodcastEpisode)),
    __param(4, (0, sequelize_1.InjectModel)(collection_model_1.Collection)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, sequelize_typescript_1.Sequelize,
        logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway])
], PlaylistService);
//# sourceMappingURL=playlist.service.js.map