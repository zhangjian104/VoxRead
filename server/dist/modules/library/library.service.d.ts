import { Library, LibraryFolder, LibraryItem } from '../../core/database/models';
import { LoggerService } from '../../core/logger/logger.service';
export interface CreateLibraryDto {
    name: string;
    folders: string[];
    icon?: string;
    mediaType: 'book' | 'podcast';
    provider?: string;
    settings?: any;
}
export interface UpdateLibraryDto {
    name?: string;
    icon?: string;
    provider?: string;
    settings?: any;
    displayOrder?: number;
}
export declare class LibraryService {
    private libraryModel;
    private libraryFolderModel;
    private libraryItemModel;
    private logger;
    constructor(libraryModel: typeof Library, libraryFolderModel: typeof LibraryFolder, libraryItemModel: typeof LibraryItem, logger: LoggerService);
    create(createDto: CreateLibraryDto): Promise<Library>;
    findAll(): Promise<Library[]>;
    findOne(id: string): Promise<Library>;
    update(id: string, updateDto: UpdateLibraryDto): Promise<Library>;
    delete(id: string): Promise<void>;
    reorder(libraryIds: string[]): Promise<Library[]>;
    getStats(id: string): Promise<any>;
    getAuthors(id: string): Promise<any[]>;
    getAllSeries(id: string): Promise<any[]>;
    getCollections(id: string): Promise<any[]>;
    addFolder(id: string, folderPath: string): Promise<Library>;
    removeFolder(id: string, folderId: string): Promise<Library>;
}
