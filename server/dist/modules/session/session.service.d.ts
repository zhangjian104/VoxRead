import { PlaybackSession } from '../../core/database/models/playback-session.model';
import { User } from '../../core/database/models/user.model';
import { LoggerService } from '../../core/logger/logger.service';
import { SocketGateway } from '../../core/socket/socket.gateway';
export declare class SessionService {
    private readonly playbackSessionModel;
    private readonly logger;
    private readonly socketGateway;
    constructor(playbackSessionModel: typeof PlaybackSession, logger: LoggerService, socketGateway: SocketGateway);
    getAllWithUserData(user: User): Promise<any>;
    getLibrarySessions(user: User, libraryId: string): Promise<any>;
    delete(sessionId: string, user: User): Promise<void>;
    batchDelete(sessionIds: string[], user: User): Promise<void>;
    getOpenSession(sessionId: string): Promise<any>;
    syncOpenSession(sessionId: string, syncData: any, user: User): Promise<any>;
    closeSession(sessionId: string, syncData: any, user: User): Promise<void>;
}
