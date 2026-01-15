import { Model } from 'sequelize-typescript';
import { Library } from './library.model';
import { Book } from './book.model';
export declare class Collection extends Model<Collection> {
    id: string;
    name: string;
    description: string;
    libraryId: string;
    library: Library;
    books: Book[];
    static getExpandedById(collectionId: string): Promise<Collection>;
    static removeAllForLibrary(libraryId: string): Promise<number>;
    toOldJSON(libraryItemIds?: string[]): any;
    toOldJSONExpanded(): any;
}
