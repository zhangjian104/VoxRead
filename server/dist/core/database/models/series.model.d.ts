import { Model } from 'sequelize-typescript';
import { Library } from './library.model';
import { Book } from './book.model';
export declare class Series extends Model<Series> {
    id: string;
    name: string;
    nameIgnorePrefix: string;
    description: string;
    libraryId: string;
    library: Library;
    books: Book[];
    static getTitlePrefixAtEnd(title: string): string;
    static getTitleIgnorePrefix(title: string): string;
    static checkExistsById(seriesId: string): Promise<boolean>;
    static getByNameAndLibrary(seriesName: string, libraryId: string): Promise<Series>;
    static getExpandedById(seriesId: string): Promise<Series>;
    static findOrCreateByNameAndLibrary(seriesName: string, libraryId: string): Promise<Series>;
    toOldJSON(): any;
    toJSONMinimal(sequence?: string): any;
}
