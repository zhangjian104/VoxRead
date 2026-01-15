import { Model } from 'sequelize-typescript';
import { Library } from './library.model';
export declare class LibraryFolder extends Model<LibraryFolder> {
    id: string;
    path: string;
    libraryId: string;
    library: Library;
    toOldJSON(): any;
}
