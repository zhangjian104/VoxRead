import { AuthorService } from './author.service';
export declare class AuthorController {
    private readonly authorService;
    constructor(authorService: AuthorService);
    findOne(id: string): Promise<any>;
    update(id: string, updateData: Partial<any>): Promise<any>;
    merge(id: string, body: {
        authorId: string;
    }): Promise<any>;
}
