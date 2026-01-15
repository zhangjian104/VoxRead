import { Model } from 'sequelize-typescript';
import { Book } from './book.model';
import { Series } from './series.model';
export declare class BookSeries extends Model<BookSeries> {
    id: string;
    sequence: string;
    bookId: string;
    seriesId: string;
    book: Book;
    series: Series;
    static removeByIds(seriesId: string, bookId: string): Promise<number>;
}
