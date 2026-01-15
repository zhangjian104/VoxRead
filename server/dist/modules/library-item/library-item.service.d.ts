import { LibraryItem, Book, Podcast, Library } from '../../core/database/models';
import { LoggerService } from '../../core/logger/logger.service';
export interface UpdateMediaDto {
    metadata?: {
        title?: string;
        subtitle?: string;
        description?: string;
        publishedYear?: string;
        publishedDate?: string;
        publisher?: string;
        isbn?: string;
        asin?: string;
        language?: string;
        explicit?: boolean;
        abridged?: boolean;
        narrators?: string[];
        authors?: string[];
        series?: Array<{
            name: string;
            sequence?: string;
        }>;
        genres?: string[];
    };
    tags?: string[];
    coverPath?: string;
}
export declare class LibraryItemService {
    private libraryItemModel;
    private bookModel;
    private podcastModel;
    private libraryModel;
    private logger;
    constructor(libraryItemModel: typeof LibraryItem, bookModel: typeof Book, podcastModel: typeof Podcast, libraryModel: typeof Library, logger: LoggerService);
    findOne(id: string): Promise<LibraryItem>;
    delete(id: string): Promise<void>;
    batchDelete(ids: string[]): Promise<number>;
    batchGet(ids: string[]): Promise<LibraryItem[]>;
    updateMedia(id: string, updateDto: UpdateMediaDto): Promise<LibraryItem>;
    private updateBookMedia;
    private updatePodcastMedia;
    getCoverPath(id: string): Promise<string | null>;
    getLibraryItems(libraryId: string, options?: {
        limit?: number;
        page?: number;
        sort?: string;
        filter?: string;
        search?: string;
    }): Promise<{
        items: any[];
        total: number;
    }>;
    exists(id: string): Promise<boolean>;
    scan(id: string): Promise<LibraryItem>;
    batchScan(ids: string[]): Promise<void>;
}
