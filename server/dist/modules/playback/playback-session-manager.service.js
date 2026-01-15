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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybackSessionManagerService = exports.PlaybackSession = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const playback_session_model_1 = require("../../core/database/models/playback-session.model");
const device_model_1 = require("../../core/database/models/device.model");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
const global_config_service_1 = require("../../core/config/global-config.service");
const stream_service_1 = require("./stream.service");
const uuid_1 = require("uuid");
const Path = __importStar(require("path"));
class PlaybackSession {
    constructor() {
        this.id = (0, uuid_1.v4)();
        this.userId = '';
        this.libraryItemId = '';
        this.episodeId = null;
        this.mediaType = '';
        this.mediaMetadata = {};
        this.displayTitle = '';
        this.displaySubtitle = null;
        this.playMethod = 'directplay';
        this.mediaPlayer = 'unknown';
        this.deviceInfo = {};
        this.deviceId = '';
        this.deviceDescription = '';
        this.startTime = 0;
        this.currentTime = 0;
        this.startedAt = Date.now();
        this.updatedAt = Date.now();
        this.audioTracks = [];
        this.stream = null;
    }
    setData(libraryItem, userId, mediaPlayer, deviceInfo, startTime, episodeId = null) {
        this.userId = userId;
        this.libraryItemId = libraryItem.id;
        this.episodeId = episodeId;
        this.mediaType = libraryItem.mediaType;
        this.mediaPlayer = mediaPlayer;
        this.deviceInfo = deviceInfo;
        this.deviceId = deviceInfo.id;
        this.deviceDescription = deviceInfo.deviceDescription || 'Unknown Device';
        this.startTime = startTime;
        this.currentTime = startTime;
        if (episodeId && libraryItem.isPodcast) {
            const episode = libraryItem.media.podcastEpisodes.find((ep) => ep.id === episodeId);
            if (episode) {
                this.displayTitle = episode.title;
                this.displaySubtitle = libraryItem.media.title;
                this.mediaMetadata = episode.toJSON();
            }
        }
        else {
            this.displayTitle = libraryItem.media.title;
            this.mediaMetadata = libraryItem.media.toJSON();
        }
    }
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            libraryItemId: this.libraryItemId,
            episodeId: this.episodeId,
            mediaType: this.mediaType,
            mediaMetadata: this.mediaMetadata,
            displayTitle: this.displayTitle,
            displaySubtitle: this.displaySubtitle,
            playMethod: this.playMethod,
            mediaPlayer: this.mediaPlayer,
            deviceInfo: this.deviceInfo,
            deviceId: this.deviceId,
            deviceDescription: this.deviceDescription,
            startTime: this.startTime,
            currentTime: this.currentTime,
            startedAt: this.startedAt,
            updatedAt: this.updatedAt,
            audioTracks: this.audioTracks,
        };
    }
}
exports.PlaybackSession = PlaybackSession;
let PlaybackSessionManagerService = class PlaybackSessionManagerService {
    constructor(playbackSessionModel, deviceModel, logger, socketGateway, configService, streamFactory) {
        this.playbackSessionModel = playbackSessionModel;
        this.deviceModel = deviceModel;
        this.logger = logger;
        this.socketGateway = socketGateway;
        this.configService = configService;
        this.streamFactory = streamFactory;
        this.sessions = [];
        const metadataPath = this.configService.get('METADATA_PATH') || Path.join(process.cwd(), 'metadata');
        this.streamsPath = Path.join(metadataPath, 'streams');
    }
    getStream(sessionId) {
        const session = this.getSession(sessionId);
        return session?.stream || null;
    }
    getSessions() {
        return this.sessions;
    }
    getSession(sessionId) {
        return this.sessions.find((s) => s.id === sessionId) || null;
    }
    getUserSessions(userId) {
        return this.sessions.filter((s) => s.userId === userId);
    }
    async startSession(user, deviceInfo, libraryItem, episodeId, options) {
        const userSessions = this.sessions.filter((s) => s.userId === user.id && s.deviceId === deviceInfo.id);
        for (const session of userSessions) {
            this.logger.info(`[PlaybackSessionManager] 关闭用户 "${user.username}" 的打开会话 "${session.displayTitle}" (设备: ${session.deviceDescription})`);
            await this.closeSession(user, session, null);
        }
        const shouldDirectPlay = options.forceDirectPlay || (!options.forceTranscode && this.checkCanDirectPlay(libraryItem, episodeId, options.supportedMimeTypes));
        const mediaPlayer = options.mediaPlayer || 'unknown';
        const mediaItemId = episodeId || libraryItem.media.id;
        const userProgress = user.getMediaProgress(mediaItemId);
        let userStartTime = 0;
        if (userProgress) {
            if (userProgress.isFinished) {
                this.logger.info(`[PlaybackSessionManager] 为用户 "${user.username}" 启动会话并重置已完成项目 "${libraryItem.media.title}" 的进度`);
            }
            else {
                userStartTime = Number.parseFloat(userProgress.currentTime) || 0;
            }
        }
        const newPlaybackSession = new PlaybackSession();
        newPlaybackSession.setData(libraryItem, user.id, mediaPlayer, deviceInfo, userStartTime, episodeId);
        let audioTracks = [];
        if (shouldDirectPlay) {
            this.logger.debug(`[PlaybackSessionManager] "${user.username}" 启动直接播放会话，项目 "${libraryItem.id}" (设备: ${newPlaybackSession.deviceDescription})`);
            audioTracks = this.getTrackList(libraryItem, episodeId);
            newPlaybackSession.playMethod = 'directplay';
        }
        else {
            this.logger.debug(`[PlaybackSessionManager] "${user.username}" 启动流媒体会话，项目 "${libraryItem.id}" (设备: ${newPlaybackSession.deviceDescription})`);
            const stream = this.streamFactory.createStream(newPlaybackSession.id, this.streamsPath, user, libraryItem, episodeId, userStartTime, this.transcodeOptions || {});
            await stream.generatePlaylist();
            stream.start();
            stream.on('closed', () => {
                this.logger.debug(`[PlaybackSessionManager] 流已关闭，会话 "${newPlaybackSession.id}" (设备: ${newPlaybackSession.deviceDescription})`);
                newPlaybackSession.stream = null;
            });
            audioTracks = [stream.getAudioTrack()];
            newPlaybackSession.stream = stream;
            newPlaybackSession.playMethod = 'transcode';
        }
        newPlaybackSession.audioTracks = audioTracks;
        this.sessions.push(newPlaybackSession);
        this.socketGateway.adminEmitter('user_stream_update', {
            userId: user.id,
            username: user.username,
            sessions: this.sessions.filter((s) => s.userId === user.id).map((s) => s.toJSON()),
        });
        await this.saveSession(newPlaybackSession);
        return newPlaybackSession;
    }
    async syncSession(user, session, syncData) {
        if (syncData.currentTime !== undefined) {
            session.currentTime = syncData.currentTime;
        }
        if (syncData.timeListened !== undefined) {
        }
        session.updatedAt = Date.now();
        const mediaItemId = session.episodeId || session.libraryItemId;
        await user.createUpdateMediaProgressFromPayload({
            libraryItemId: session.libraryItemId,
            episodeId: session.episodeId,
            currentTime: session.currentTime,
            duration: syncData.duration,
            progress: syncData.progress,
        });
        await this.updateSession(session);
        return true;
    }
    async closeSession(user, session, syncData) {
        if (syncData) {
            await this.syncSession(user, session, syncData);
        }
        if (session.stream) {
            await session.stream.close();
            session.stream = null;
        }
        this.sessions = this.sessions.filter((s) => s.id !== session.id);
        await this.updateSession(session);
        this.socketGateway.adminEmitter('user_stream_update', {
            userId: user.id,
            username: user.username,
            sessions: this.sessions.filter((s) => s.userId === user.id).map((s) => s.toJSON()),
        });
        this.logger.info(`[PlaybackSessionManager] 关闭会话 "${session.displayTitle}" (${session.id})`);
    }
    async removeSession(sessionId) {
        const session = this.getSession(sessionId);
        if (!session)
            return;
        if (session.stream) {
            await session.stream.close();
            session.stream = null;
        }
        this.sessions = this.sessions.filter((s) => s.id !== sessionId);
        this.logger.info(`[PlaybackSessionManager] 移除会话 ${sessionId}`);
    }
    checkCanDirectPlay(libraryItem, episodeId, supportedMimeTypes) {
        return true;
    }
    getTrackList(libraryItem, episodeId) {
        const tracks = [];
        if (episodeId && libraryItem.isPodcast) {
            const episode = libraryItem.media.podcastEpisodes.find((ep) => ep.id === episodeId);
            if (episode && episode.audioFile) {
                tracks.push({
                    index: 1,
                    startOffset: 0,
                    duration: episode.duration || 0,
                    title: episode.title,
                    contentUrl: `/api/items/${libraryItem.id}/file/${episode.audioFile.ino}`,
                    mimeType: episode.audioFile.mimeType,
                    metadata: episode.audioFile.toJSON(),
                });
            }
        }
        else if (libraryItem.isBook) {
            const audioFiles = libraryItem.media.audioFiles || [];
            audioFiles.forEach((audioFile, index) => {
                tracks.push({
                    index: index + 1,
                    startOffset: 0,
                    duration: audioFile.duration || 0,
                    title: audioFile.metadata?.title || `Track ${index + 1}`,
                    contentUrl: `/api/items/${libraryItem.id}/file/${audioFile.ino}`,
                    mimeType: audioFile.mimeType,
                    metadata: audioFile.toJSON(),
                });
            });
        }
        return tracks;
    }
    async saveSession(session) {
        try {
            await this.playbackSessionModel.create({
                id: session.id,
                userId: session.userId,
                libraryItemId: session.libraryItemId,
                episodeId: session.episodeId,
                mediaType: session.mediaType,
                mediaMetadata: session.mediaMetadata,
                displayTitle: session.displayTitle,
                displaySubtitle: session.displaySubtitle,
                playMethod: session.playMethod,
                mediaPlayer: session.mediaPlayer,
                deviceId: session.deviceId,
                startTime: session.startTime,
                currentTime: session.currentTime,
                startedAt: session.startedAt,
                updatedAt: session.updatedAt,
            });
        }
        catch (error) {
            this.logger.error('[PlaybackSessionManager] 保存会话失败:', error);
        }
    }
    async updateSession(session) {
        try {
            await this.playbackSessionModel.update({
                currentTime: session.currentTime,
                updatedAt: session.updatedAt,
            }, {
                where: { id: session.id },
            });
        }
        catch (error) {
            this.logger.error('[PlaybackSessionManager] 更新会话失败:', error);
        }
    }
    async closeStaleOpenSessions() {
        const updatedAtTimeCutoff = Date.now() - 1000 * 60 * 60 * 36;
        const staleSessions = this.sessions.filter((session) => session.updatedAt < updatedAtTimeCutoff);
        for (const session of staleSessions) {
            const sessionLastUpdate = new Date(session.updatedAt);
            this.logger.info(`[PlaybackSessionManager] 关闭过期会话 "${session.displayTitle}" (${session.id}) 最后更新于 ${sessionLastUpdate}`);
            await this.removeSession(session.id);
        }
    }
};
exports.PlaybackSessionManagerService = PlaybackSessionManagerService;
exports.PlaybackSessionManagerService = PlaybackSessionManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(playback_session_model_1.PlaybackSession)),
    __param(1, (0, sequelize_1.InjectModel)(device_model_1.Device)),
    __metadata("design:paramtypes", [Object, Object, logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway,
        global_config_service_1.GlobalConfigService,
        stream_service_1.StreamFactoryService])
], PlaybackSessionManagerService);
//# sourceMappingURL=playback-session-manager.service.js.map