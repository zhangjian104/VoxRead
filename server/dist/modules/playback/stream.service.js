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
exports.StreamFactoryService = exports.StreamService = exports.AudioTrack = void 0;
const events_1 = require("events");
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
const Path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
class AudioTrack {
    constructor() {
        this.index = 1;
        this.startOffset = 0;
        this.duration = 0;
        this.title = '';
        this.contentUrl = '';
        this.mimeType = '';
        this.metadata = {};
    }
    setFromStream(title, duration, contentUrl) {
        this.index = 1;
        this.startOffset = 0;
        this.duration = duration;
        this.title = title;
        this.contentUrl = contentUrl;
        this.mimeType = 'application/vnd.apple.mpegurl';
    }
    toJSON() {
        return {
            index: this.index,
            startOffset: this.startOffset,
            duration: this.duration,
            title: this.title,
            contentUrl: this.contentUrl,
            mimeType: this.mimeType,
            codec: this.codec,
            metadata: this.metadata,
        };
    }
}
exports.AudioTrack = AudioTrack;
class StreamService extends events_1.EventEmitter {
    constructor(sessionId, streamPath, user, libraryItem, episodeId, startTime, transcodeOptions = {}, logger, socketGateway) {
        super();
        this.segmentLength = 6;
        this.maxSeekBackTime = 30;
        this.ffmpeg = null;
        this.loop = null;
        this.isResetting = false;
        this.isClientInitialized = false;
        this.isTranscodeComplete = false;
        this.segmentsCreated = new Set();
        this.furthestSegmentCreated = 0;
        this.id = sessionId;
        this.user = user;
        this.libraryItem = libraryItem;
        this.episodeId = episodeId;
        this.transcodeOptions = transcodeOptions;
        this.startTime = startTime;
        this.logger = logger;
        this.socketGateway = socketGateway;
        this.streamPath = Path.join(streamPath, this.id);
        this.concatFilesPath = Path.join(this.streamPath, 'files.txt');
        this.playlistPath = Path.join(this.streamPath, 'output.m3u8');
        this.finalPlaylistPath = Path.join(this.streamPath, 'final-output.m3u8');
    }
    get episode() {
        if (!this.libraryItem.isPodcast)
            return null;
        return this.libraryItem.media.podcastEpisodes.find((ep) => ep.id === this.episodeId);
    }
    get mediaTitle() {
        return this.libraryItem.media.getPlaybackTitle ? this.libraryItem.media.getPlaybackTitle(this.episodeId) : this.libraryItem.media.title;
    }
    get totalDuration() {
        if (this.episodeId && this.episode) {
            return this.episode.duration || 0;
        }
        return this.libraryItem.media.duration || 0;
    }
    get tracks() {
        return this.libraryItem.getTrackList ? this.libraryItem.getTrackList(this.episodeId) : [];
    }
    get segmentStartNumber() {
        if (!this.startTime)
            return 0;
        return Math.floor(Math.max(this.startTime - this.maxSeekBackTime, 0) / this.segmentLength);
    }
    get numSegments() {
        let numSegs = Math.floor(this.totalDuration / this.segmentLength);
        if (this.totalDuration - numSegs * this.segmentLength > 0) {
            numSegs++;
        }
        return numSegs;
    }
    get clientPlaylistUri() {
        return `/hls/${this.id}/output.m3u8`;
    }
    get hlsSegmentType() {
        return 'mpegts';
    }
    get segmentBasename() {
        return 'output-%d.ts';
    }
    toJSON() {
        return {
            id: this.id,
            userId: this.user.id,
            libraryItem: this.libraryItem.toOldJSONExpanded ? this.libraryItem.toOldJSONExpanded() : this.libraryItem,
            episode: this.episode ? (this.episode.toOldJSONExpanded ? this.episode.toOldJSONExpanded(this.libraryItem.id) : this.episode) : null,
            segmentLength: this.segmentLength,
            playlistPath: this.playlistPath,
            clientPlaylistUri: this.clientPlaylistUri,
            startTime: this.startTime,
            segmentStartNumber: this.segmentStartNumber,
            isTranscodeComplete: this.isTranscodeComplete,
        };
    }
    async checkSegmentNumberRequest(segNum) {
        const segStartTime = segNum * this.segmentLength;
        if (this.segmentStartNumber > segNum) {
            this.logger.warn(`[Stream] 分段 #${segNum} 请求在起始分段 #${this.segmentStartNumber} 之前 - 重置转码`);
            await this.reset(segStartTime - this.segmentLength * 5);
            return segStartTime;
        }
        else if (this.isTranscodeComplete) {
            return false;
        }
        if (this.furthestSegmentCreated) {
            const distanceFromFurthestSegment = segNum - this.furthestSegmentCreated;
            if (distanceFromFurthestSegment > 10) {
                this.logger.info(`分段 #${segNum} 请求距离最新分段 ${distanceFromFurthestSegment} 个分段 - 重置转码`);
                await this.reset(segStartTime - this.segmentLength * 5);
                return segStartTime;
            }
        }
        return false;
    }
    async generatePlaylist() {
        await fs.ensureDir(this.streamPath);
        await this.generateHlsPlaylist();
        return this.clientPlaylistUri;
    }
    async generateHlsPlaylist() {
        const numSegments = this.numSegments;
        let playlistContent = '#EXTM3U\n';
        playlistContent += '#EXT-X-VERSION:3\n';
        playlistContent += `#EXT-X-TARGETDURATION:${this.segmentLength}\n`;
        playlistContent += '#EXT-X-MEDIA-SEQUENCE:0\n';
        playlistContent += '#EXT-X-PLAYLIST-TYPE:VOD\n';
        for (let i = 0; i < numSegments; i++) {
            playlistContent += `#EXTINF:${this.segmentLength}.0,\n`;
            playlistContent += `${this.segmentBasename.replace('%d', i.toString())}\n`;
        }
        playlistContent += '#EXT-X-ENDLIST\n';
        await fs.writeFile(this.playlistPath, playlistContent);
        this.logger.info(`[Stream] 生成HLS播放列表: ${this.playlistPath}`);
    }
    async checkFiles() {
        try {
            const files = await fs.readdir(this.streamPath);
            files.forEach((file) => {
                const extname = Path.extname(file);
                if (extname === '.ts') {
                    const basename = Path.basename(file, extname);
                    const numPart = basename.split('-')[1];
                    const partNum = Number(numPart);
                    this.segmentsCreated.add(partNum);
                }
            });
            if (!this.segmentsCreated.size) {
                this.logger.warn('[Stream] 没有分段文件');
                return;
            }
            if (this.segmentsCreated.size > 6 && !this.isClientInitialized) {
                this.isClientInitialized = true;
                this.logger.info(`[Stream] ${this.id} 通知客户端流已准备好`);
                this.clientEmit('stream_open', this.toJSON());
            }
            const segments = Array.from(this.segmentsCreated).sort((a, b) => a - b);
            const lastSegment = segments[segments.length - 1];
            if (lastSegment > this.furthestSegmentCreated) {
                this.furthestSegmentCreated = lastSegment;
            }
            const perc = ((this.segmentsCreated.size * 100) / this.numSegments).toFixed(2) + '%';
            this.logger.info(`[Stream] 进度: ${this.segmentsCreated.size}/${this.numSegments} ${perc}`);
            this.clientEmit('stream_progress', {
                stream: this.id,
                percent: perc,
                numSegments: this.numSegments,
            });
        }
        catch (error) {
            this.logger.error('[Stream] 检查文件失败', error);
        }
    }
    async start() {
        this.logger.info(`[Stream] 启动流 - 分段数: ${this.numSegments}`);
        this.logger.warn('[Stream] FFmpeg转码功能待完整实现');
        this.startLoop();
    }
    startLoop() {
        this.clientEmit('stream_progress', { stream: this.id, numSegments: 0, percent: '0%' });
        clearInterval(this.loop);
        const intervalId = setInterval(() => {
            if (!this.isTranscodeComplete) {
                this.checkFiles();
            }
            else {
                this.logger.info(`[Stream] ${this.mediaTitle} 发送 stream_ready`);
                this.clientEmit('stream_ready');
                clearInterval(intervalId);
            }
        }, 2000);
        this.loop = intervalId;
    }
    async reset(startTime) {
        this.logger.info(`[Stream] 重置流到时间: ${startTime}s`);
        this.isResetting = true;
        if (this.ffmpeg) {
        }
        this.segmentsCreated.clear();
        this.furthestSegmentCreated = 0;
        this.isTranscodeComplete = false;
        this.startTime = Math.max(startTime, 0);
        setTimeout(() => {
            this.isResetting = false;
        }, 1000);
    }
    async close(errorMessage) {
        this.logger.info(`[Stream] 关闭流 ${this.id}` + (errorMessage ? `: ${errorMessage}` : ''));
        clearInterval(this.loop);
        this.loop = null;
        if (this.ffmpeg) {
            this.ffmpeg = null;
        }
        try {
            if (await fs.pathExists(this.streamPath)) {
                await fs.remove(this.streamPath);
                this.logger.info(`[Stream] 清理流目录: ${this.streamPath}`);
            }
        }
        catch (error) {
            this.logger.error(`[Stream] 清理流目录失败:`, error);
        }
        this.emit('closed');
    }
    getAudioTrack() {
        const track = new AudioTrack();
        track.setFromStream(this.mediaTitle, this.totalDuration, this.clientPlaylistUri);
        return track;
    }
    clientEmit(event, data) {
        this.socketGateway.clientEmitter(this.user.id, event, data);
    }
}
exports.StreamService = StreamService;
let StreamFactoryService = class StreamFactoryService {
    constructor(logger, socketGateway) {
        this.logger = logger;
        this.socketGateway = socketGateway;
    }
    createStream(sessionId, streamPath, user, libraryItem, episodeId, startTime, transcodeOptions = {}) {
        return new StreamService(sessionId, streamPath, user, libraryItem, episodeId, startTime, transcodeOptions, this.logger, this.socketGateway);
    }
};
exports.StreamFactoryService = StreamFactoryService;
exports.StreamFactoryService = StreamFactoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway])
], StreamFactoryService);
//# sourceMappingURL=stream.service.js.map