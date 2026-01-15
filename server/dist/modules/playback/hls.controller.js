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
exports.HlsController = void 0;
const common_1 = require("@nestjs/common");
const playback_session_manager_service_1 = require("./playback-session-manager.service");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
const Path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
let HlsController = class HlsController {
    constructor(playbackSessionManager, logger, socketGateway) {
        this.playbackSessionManager = playbackSessionManager;
        this.logger = logger;
        this.socketGateway = socketGateway;
    }
    parseSegmentFilename(filename) {
        const basename = Path.basename(filename, Path.extname(filename));
        const numPart = basename.split('-')[1];
        return Number(numPart);
    }
    validateStreamFilePath(streamDir, filepath) {
        const relative = Path.relative(streamDir, filepath);
        return relative && !relative.startsWith('..') && !Path.isAbsolute(relative);
    }
    async streamFileRequest(streamId, filename, res) {
        const session = this.playbackSessionManager.getSession(streamId);
        if (!session) {
            this.logger.error(`[HlsController] 流 "${streamId}" 不存在`);
            throw new common_1.NotFoundException('流不存在');
        }
        const stream = session.stream;
        if (!stream) {
            this.logger.error(`[HlsController] 会话 "${streamId}" 没有关联的流`);
            throw new common_1.NotFoundException('流未启动');
        }
        const streamDir = stream.streamPath;
        const fullFilePath = Path.join(streamDir, filename);
        if (!this.validateStreamFilePath(streamDir, fullFilePath)) {
            this.logger.error(`[HlsController] 无效的文件参数 "${filename}"`);
            throw new common_1.BadRequestException('无效的文件路径');
        }
        const fileExt = Path.extname(filename);
        if (fileExt !== '.ts' && fileExt !== '.m3u8') {
            this.logger.error(`[HlsController] 无效的文件扩展名 "${filename}"，必须是 .ts 或 .m3u8`);
            throw new common_1.BadRequestException('文件类型必须是 .ts 或 .m3u8');
        }
        const fileExists = await fs.pathExists(fullFilePath);
        if (!fileExists) {
            this.logger.warn(`[HlsController] 文件不存在: ${fullFilePath}`);
            if (fileExt === '.ts') {
                const segNum = this.parseSegmentFilename(filename);
                if (stream.isResetting) {
                    this.logger.info(`[HlsController] 流 ${streamId} 正在重置中`);
                }
                else {
                    const startTimeForReset = await stream.checkSegmentNumberRequest(segNum);
                    if (startTimeForReset !== false) {
                        this.logger.info(`[HlsController] 重置流 - 通知客户端 @${startTimeForReset}s`);
                        this.socketGateway.emitter('stream_reset', {
                            startTime: startTimeForReset,
                            streamId: stream.id,
                        });
                    }
                }
            }
            throw new common_1.NotFoundException('文件未找到');
        }
        this.logger.debug(`[HlsController] 提供文件: ${filename}`);
        return res.sendFile(fullFilePath);
    }
};
exports.HlsController = HlsController;
__decorate([
    (0, common_1.Get)(':stream/:file'),
    __param(0, (0, common_1.Param)('stream')),
    __param(1, (0, common_1.Param)('file')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], HlsController.prototype, "streamFileRequest", null);
exports.HlsController = HlsController = __decorate([
    (0, common_1.Controller)('hls'),
    __metadata("design:paramtypes", [playback_session_manager_service_1.PlaybackSessionManagerService,
        logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway])
], HlsController);
//# sourceMappingURL=hls.controller.js.map