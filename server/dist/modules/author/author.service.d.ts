import { Author } from '../../core/database/models';
import { LoggerService } from '../../core/logger/logger.service';
export declare class AuthorService {
    private authorModel;
    private logger;
    constructor(authorModel: typeof Author, logger: LoggerService);
    findOne(id: string): Promise<Author>;
    findAllByLibrary(libraryId: string): Promise<Author[]>;
    update(id: string, updateData: Partial<Author>): Promise<Author>;
    merge(fromAuthorId: string, toAuthorId: string): Promise<Author>;
    exists(id: string): Promise<boolean>;
}
