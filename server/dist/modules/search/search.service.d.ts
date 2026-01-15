import { LibraryItem } from '../../core/database/models/library-item.model';
import { LoggerService } from '../../core/logger/logger.service';
export declare class SearchService {
    private readonly libraryItemModel;
    private readonly logger;
    constructor(libraryItemModel: typeof LibraryItem, logger: LoggerService);
    fetchLibraryItem(id: string): Promise<any>;
    findBooks(provider: string, title: string, author: string, libraryItemId?: string): Promise<any>;
    findCovers(provider: string, title: string, author?: string, podcast?: boolean): Promise<any>;
    findPodcasts(term: string, country?: string): Promise<any>;
    findAuthor(query: string): Promise<any>;
    findChapters(asin: string, region?: string): Promise<any>;
    getAllProviders(): Promise<any>;
    searchLibrary(libraryId: string, query: string, limit?: number): Promise<any>;
    private isValidASIN;
}
