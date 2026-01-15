import { Collection } from '../../core/database/models/collection.model';
import { CollectionBook } from '../../core/database/models/collection-book.model';
import { Book } from '../../core/database/models/book.model';
import { LibraryItem } from '../../core/database/models/library-item.model';
import { User } from '../../core/database/models/user.model';
import { LoggerService } from '../../core/logger/logger.service';
import { SocketGateway } from '../../core/socket/socket.gateway';
export declare class CollectionService {
    private readonly collectionModel;
    private readonly collectionBookModel;
    private readonly bookModel;
    private readonly libraryItemModel;
    private readonly logger;
    private readonly socketGateway;
    constructor(collectionModel: typeof Collection, collectionBookModel: typeof CollectionBook, bookModel: typeof Book, libraryItemModel: typeof LibraryItem, logger: LoggerService, socketGateway: SocketGateway);
    private loadCollectionWithBooks;
    create(libraryId: string, name: string, description: string, books: string[], user: User): Promise<any>;
    findAll(user: User): Promise<any>;
    findOne(collectionId: string, user: User, include?: string[]): Promise<any>;
    update(collectionId: string, updateData: {
        name?: string;
        description?: string;
    }, user: User): Promise<any>;
    remove(collectionId: string, user: User): Promise<void>;
    addBook(collectionId: string, bookId: string, user: User): Promise<any>;
    removeBook(collectionId: string, bookId: string, user: User): Promise<any>;
    batchAdd(collectionId: string, bookIds: string[], user: User): Promise<any>;
    batchRemove(collectionId: string, bookIds: string[], user: User): Promise<any>;
    reorder(collectionId: string, orderedBookIds: string[], user: User): Promise<any>;
}
