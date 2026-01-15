import { User } from '../../core/database/models/user.model';
import { Playlist } from '../../core/database/models/playlist.model';
import { PlaybackSession } from '../../core/database/models/playback-session.model';
import { MediaProgress } from '../../core/database/models/media-progress.model';
import { LoggerService } from '../../core/logger/logger.service';
import { SocketGateway } from '../../core/socket/socket.gateway';
export declare class UserService {
    private readonly userModel;
    private readonly playlistModel;
    private readonly playbackSessionModel;
    private readonly mediaProgressModel;
    private readonly logger;
    private readonly socketGateway;
    constructor(userModel: typeof User, playlistModel: typeof Playlist, playbackSessionModel: typeof PlaybackSession, mediaProgressModel: typeof MediaProgress, logger: LoggerService, socketGateway: SocketGateway);
    findAll(currentUser: User, include?: string[]): Promise<any>;
    findOne(userId: string, currentUser: User): Promise<any>;
    create(createUserDto: any, currentUser: User, hashPassword: (password: string) => Promise<string>, generateAccessToken: (payload: any) => string): Promise<any>;
    update(userId: string, updateUserDto: any, currentUser: User, hashPassword: (password: string) => Promise<string>, generateAccessToken: (payload: any) => string, invalidateJwtSessions: (user: User, req: any, res: any) => Promise<string | null>, req: any, res: any): Promise<any>;
    delete(userId: string, currentUser: User): Promise<void>;
    unlinkFromOpenID(userId: string, currentUser: User): Promise<void>;
    getOnlineUsers(): Promise<any>;
    getListeningSessions(userId: string, page: number, itemsPerPage: number): Promise<any>;
    getListeningStats(userId: string): Promise<any>;
}
