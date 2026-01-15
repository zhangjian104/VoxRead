import { CollectionService } from './collection.service';
export declare class CollectionController {
    private readonly collectionService;
    constructor(collectionService: CollectionService);
    create(createDto: any, user: User): Promise<any>;
    findAll(user: User): Promise<any>;
    findOne(id: string, user: User, include?: string): Promise<any>;
    update(id: string, updateDto: any): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    addBook(id: string, body: {
        id: string;
    }): Promise<any>;
    removeBook(id: string, bookId: string): Promise<any>;
    addBatch(id: string, body: {
        books: string[];
    }): Promise<any>;
    removeBatch(id: string, body: {
        books: string[];
    }): Promise<any>;
}
