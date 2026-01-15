import { BookService } from './book.service';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
    findOne(id: string): Promise<any>;
    updateAuthors(id: string, body: {
        authors: string[];
        libraryId: string;
    }): Promise<{
        success: boolean;
    }>;
    updateSeries(id: string, body: {
        series: Array<{
            name: string;
            sequence?: string;
        }>;
        libraryId: string;
    }): Promise<{
        success: boolean;
    }>;
}
