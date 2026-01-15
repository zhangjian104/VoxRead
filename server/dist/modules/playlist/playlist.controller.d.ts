import { PlaylistService } from './playlist.service';
export declare class PlaylistController {
    private readonly playlistService;
    constructor(playlistService: PlaylistService);
    create(createDto: any, user: User): Promise<any>;
    findAllForUser(user: User): Promise<any>;
    findOne(id: string, user: User): Promise<any>;
    update(id: string, updateDto: any, user: User): Promise<any>;
    delete(id: string, user: User): Promise<{
        success: boolean;
    }>;
    addItem(id: string, itemToAdd: any, user: User): Promise<any>;
    removeItem(id: string, libraryItemId: string, episodeId?: string): Promise<any>;
    addBatch(id: string, body: {
        items: any[];
    }, user: User): Promise<any>;
    removeBatch(id: string, body: {
        items: any[];
    }, user: User): Promise<any>;
    createFromCollection(collectionId: string, user: User): Promise<any>;
}
