import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    findBooks(provider?: string, title?: string, author?: string, id?: string): Promise<any>;
    findCovers(provider?: string, title?: string, author?: string, podcast?: string): Promise<any>;
    findPodcasts(term?: string, country?: string): Promise<any>;
    findAuthor(query?: string): Promise<any>;
    findChapters(asin?: string, region?: string): Promise<any>;
    getAllProviders(): Promise<any>;
}
