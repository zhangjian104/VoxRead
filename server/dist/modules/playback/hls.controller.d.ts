import { Response } from 'express';
import { PlaybackSessionManagerService } from './playback-session-manager.service';
import { LoggerService } from '../../core/logger/logger.service';
import { SocketGateway } from '../../core/socket/socket.gateway';
export declare class HlsController {
    private readonly playbackSessionManager;
    private readonly logger;
    private readonly socketGateway;
    constructor(playbackSessionManager: PlaybackSessionManagerService, logger: LoggerService, socketGateway: SocketGateway);
    private parseSegmentFilename;
    private validateStreamFilePath;
    streamFileRequest(streamId: string, filename: string, res: Response): Promise<void>;
}
