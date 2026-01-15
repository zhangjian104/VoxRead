import { Model } from 'sequelize-typescript';
import { Collection } from './collection.model';
import { Book } from './book.model';
export declare class CollectionBook extends Model<CollectionBook> {
    id: string;
    order: number;
    bookId: string;
    collectionId: string;
    book: Book;
    collection: Collection;
}
