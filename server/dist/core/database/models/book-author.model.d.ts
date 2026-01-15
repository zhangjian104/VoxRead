import { Model } from 'sequelize-typescript';
import { Book } from './book.model';
import { Author } from './author.model';
export declare class BookAuthor extends Model<BookAuthor> {
    bookId: string;
    authorId: string;
    book: Book;
    author: Author;
    static removeByIds(authorId: string, bookId: string): Promise<number>;
}
