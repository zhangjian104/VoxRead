import { Response } from 'express';
import { LibraryItemService, UpdateMediaDto } from './library-item.service';
export declare class LibraryItemController {
    private readonly libraryItemService;
    constructor(libraryItemService: LibraryItemService);
    findOne(id: string, expanded?: string, include?: string, episode?: string, user?: any): Promise<any>;
    delete(id: string, hard?: string, user?: any): Promise<{
        message: string;
    }>;
    updateMedia(id: string, updateDto: UpdateMediaDto, user?: any): Promise<any>;
    batchDelete(body: {
        libraryItemIds: string[];
    }): Promise<{
        success: boolean;
        deletedCount: number;
    }>;
    batchUpdate(body: {
        libraryItemIds: string[];
        mediaPayload: UpdateMediaDto;
    }): Promise<{
        success: boolean;
        updates: number;
    }>;
    batchGet(body: {
        libraryItemIds: string[];
    }): Promise<{
        libraryItems: any[];
    }>;
    scan(id: string): Promise<{
        result: any;
    }>;
    batchScan(body: {
        libraryItemIds: string[];
    }): Promise<{
        success: boolean;
    }>;
    getCover(id: string, res: Response): Promise<{
        coverPath: string;
    }>;
    uploadCover(id: string, body: {
        cover: string;
    }): Promise<{
        success: boolean;
    }>;
    updateCover(id: string, body: {
        url?: string;
        path?: string;
    }): Promise<{
        success: boolean;
    }>;
    removeCover(id: string): Promise<{
        success: boolean;
    }>;
    match(id: string, body: {
        provider?: string;
        title?: string;
        author?: string;
    }): Promise<{
        success: boolean;
        matches: any[];
    }>;
    batchQuickMatch(body: {
        libraryItemIds: string[];
    }): Promise<{
        success: boolean;
    }>;
    startPlaybackSession(id: string, body: {
        deviceInfo?: any;
        supportedMimeTypes?: string[];
    }, user?: any): Promise<{
        id: string;
    }>;
    startEpisodePlaybackSession(id: string, episodeId: string, body: {
        deviceInfo?: any;
        supportedMimeTypes?: string[];
    }, user?: any): Promise<{
        id: string;
    }>;
    download(id: string, res: Response): Promise<{
        message: string;
    }>;
    updateTracks(id: string, body: {
        orderedFileData: any[];
    }): Promise<{
        success: boolean;
    }>;
    updateMediaChapters(id: string, body: {
        chapters: any[];
    }): Promise<{
        success: boolean;
    }>;
    getFFprobeData(id: string, fileid: string): Promise<{
        data: {};
    }>;
    getLibraryFile(id: string, fileid: string, res: Response): Promise<{
        message: string;
    }>;
    deleteLibraryFile(id: string, fileid: string): Promise<{
        success: boolean;
    }>;
    downloadLibraryFile(id: string, fileid: string, res: Response): Promise<{
        message: string;
    }>;
    getEBookFile(id: string, fileid?: string): Promise<{
        message: string;
    }>;
    getMetadataObject(id: string, user?: any): Promise<import("../../core/database/models").Book | import("../../core/database/models").Podcast>;
}
