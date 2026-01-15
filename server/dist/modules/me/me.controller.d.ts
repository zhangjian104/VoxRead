import { MeService } from './me.service';
import { AuthService } from '../../auth/auth.service';
export declare class MeController {
    private readonly meService;
    private readonly authService;
    constructor(meService: MeService, authService: AuthService);
    getCurrentUser(user: User): any;
    getListeningSessions(user: User, page?: number, itemsPerPage?: number): Promise<any>;
    getItemListeningSessions(user: User, libraryItemId: string, episodeId?: string, page?: number, itemsPerPage?: number): Promise<any>;
    getListeningStats(user: User): Promise<any>;
    getMediaProgress(user: User, id: string, episodeId?: string): Promise<any>;
    removeMediaProgress(user: User, id: string): Promise<{
        success: boolean;
    }>;
    createUpdateMediaProgress(user: User, libraryItemId: string, episodeId: string | undefined, progressData: any): Promise<{
        success: boolean;
    }>;
    batchUpdateMediaProgress(user: User, itemProgressPayloads: any[]): Promise<{
        success: boolean;
    }>;
    createBookmark(user: User, id: string, body: {
        time: number;
        title: string;
    }): Promise<any>;
    updateBookmark(user: User, id: string, body: {
        time: number;
        title: string;
    }): Promise<any>;
    removeBookmark(user: User, id: string, time: string): Promise<{
        success: boolean;
    }>;
    updatePassword(user: User, body: {
        password: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
    }>;
    getAllLibraryItemsInProgress(user: User, limit?: number): Promise<any>;
    removeSeriesFromContinueListening(user: User, id: string): Promise<any>;
    readdSeriesFromContinueListening(user: User, id: string): Promise<any>;
    removeItemFromContinueListening(user: User, id: string): Promise<any>;
    updateUserEReaderDevices(user: User, body: {
        ereaderDevices: any[];
    }): Promise<any>;
    getStatsForYear(user: User, year: string): Promise<any>;
}
