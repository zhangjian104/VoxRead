import { Model } from 'sequelize-typescript';
import { Library } from './library.model';
import { Book } from './book.model';
export declare class Author extends Model<Author> {
    id: string;
    name: string;
    lastFirst: string;
    asin: string;
    description: string;
    imagePath: string;
    libraryId: string;
    library: Library;
    books: Book[];
    static getLastFirst(name: string): string;
    static checkExistsById(authorId: string): Promise<boolean>;
    static getByNameAndLibrary(authorName: string, libraryId: string): Promise<Author>;
    static findOrCreateByNameAndLibrary(name: string, libraryId: string): Promise<Author>;
    static getAllLibraryItemsForAuthor(authorId: string): Promise<any[]>;
    toOldJSON(): any;
    toOldJSONExpanded(numBooks?: number): any;
    toJSONMinimal(): any;
}
