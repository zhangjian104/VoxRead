import { LibraryService, CreateLibraryDto, UpdateLibraryDto } from './library.service';
export declare class LibraryController {
    private readonly libraryService;
    constructor(libraryService: LibraryService);
    create(createDto: CreateLibraryDto): Promise<any>;
    findAll(user: any): Promise<{
        libraries: any[];
    }>;
    findOne(id: string, user: any): Promise<any>;
    update(id: string, updateDto: UpdateLibraryDto): Promise<any>;
    delete(id: string): Promise<void>;
    reorder(body: {
        libraries: string[];
    }): Promise<{
        libraries: any[];
    }>;
    getLibraryItems(id: string, limit?: number, page?: number, sort?: string, filter?: string, user?: any): Promise<{
        results: any[];
        total: number;
        limit: number;
        page: number;
    }>;
    getStats(id: string, user: any): Promise<any>;
    getAuthors(id: string, user: any): Promise<{
        authors: any[];
    }>;
    getAllSeries(id: string, user: any): Promise<{
        series: any[];
    }>;
    getCollections(id: string, user: any): Promise<{
        collections: any[];
    }>;
    scan(id: string, force?: boolean): Promise<{
        message: string;
        libraryId: string;
    }>;
    search(id: string, query: string, limit?: number, user?: any): Promise<{
        book: any[];
        podcast: any[];
        series: any[];
        authors: any[];
        tags: any[];
    }>;
    getFilterData(id: string, user: any): Promise<{
        authors: any[];
        genres: any[];
        tags: any[];
        series: any[];
        narrators: any[];
        languages: any[];
    }>;
    getPersonalizedShelves(id: string, limit?: number, include?: string, user?: any): Promise<{
        shelves: any[];
    }>;
}
