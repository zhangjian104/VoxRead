import { EventEmitter } from 'events';
import { LoggerService } from '../../core/logger/logger.service';
import { SocketGateway } from '../../core/socket/socket.gateway';
export declare class AudioTrack {
    index: number;
    startOffset: number;
    duration: number;
    title: string;
    contentUrl: string;
    mimeType: string;
    codec?: string;
    metadata: any;
    constructor();
    setFromStream(title: string, duration: number, contentUrl: string): void;
    toJSON(): {
        index: number;
        startOffset: number;
        duration: number;
        title: string;
        contentUrl: string;
        mimeType: string;
        codec: string;
        metadata: any;
    };
}
export declare class StreamService extends EventEmitter {
    id: string;
    user: any;
    libraryItem: any;
    episodeId: string | null;
    transcodeOptions: any;
    segmentLength: number;
    maxSeekBackTime: number;
    streamPath: string;
    concatFilesPath: string;
    playlistPath: string;
    finalPlaylistPath: string;
    startTime: number;
    ffmpeg: any;
    loop: any;
    isResetting: boolean;
    isClientInitialized: boolean;
    isTranscodeComplete: boolean;
    segmentsCreated: Set<number>;
    furthestSegmentCreated: number;
    private logger;
    private socketGateway;
    constructor(sessionId: string, streamPath: string, user: any, libraryItem: any, episodeId: string | null, startTime: number, transcodeOptions: any, logger: LoggerService, socketGateway: SocketGateway);
    get episode(): any;
    get mediaTitle(): any;
    get totalDuration(): any;
    get tracks(): any;
    get segmentStartNumber(): number;
    get numSegments(): number;
    get clientPlaylistUri(): string;
    get hlsSegmentType(): string;
    get segmentBasename(): string;
    toJSON(): {
        id: string;
        userId: any;
        libraryItem: any;
        episode: any;
        segmentLength: number;
        playlistPath: string;
        clientPlaylistUri: string;
        startTime: number;
        segmentStartNumber: number;
        isTranscodeComplete: boolean;
    };
    checkSegmentNumberRequest(segNum: number): Promise<number | false>;
    generatePlaylist(): Promise<string>;
    private generateHlsPlaylist;
    checkFiles(): Promise<void>;
    start(): Promise<void>;
    private startLoop;
    reset(startTime: number): Promise<void>;
    close(errorMessage?: string): Promise<void>;
    getAudioTrack(): AudioTrack;
    private clientEmit;
}
export declare class StreamFactoryService {
    private readonly logger;
    private readonly socketGateway;
    constructor(logger: LoggerService, socketGateway: SocketGateway);
    createStream(sessionId: string, streamPath: string, user: any, libraryItem: any, episodeId: string | null, startTime: number, transcodeOptions?: any): StreamService;
}
