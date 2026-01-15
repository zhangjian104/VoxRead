import { Book, Author, Series, BookAuthor, BookSeries } from '../../core/database/models';
import { LoggerService } from '../../core/logger/logger.service';
export declare class BookService {
    private bookModel;
    private authorModel;
    private seriesModel;
    private bookAuthorModel;
    private bookSeriesModel;
    private logger;
    constructor(bookModel: typeof Book, authorModel: typeof Author, seriesModel: typeof Series, bookAuthorModel: typeof BookAuthor, bookSeriesModel: typeof BookSeries, logger: LoggerService);
    findOne(id: string): Promise<Book>;
    updateAuthors(bookId: string, authorNames: string[], libraryId: string): Promise<void>;
    updateSeries(bookId: string, seriesObjects: Array<{
        name: string;
        sequence?: string;
    }>, libraryId: string): Promise<void>;
    getTracklist(bookId: string, libraryItemId: string): any[];
}
