import { Model } from 'sequelize-typescript';
import { Library } from './library.model';
import { User } from './user.model';
import { PlaylistMediaItem } from './playlist-media-item.model';
export declare class Playlist extends Model<Playlist> {
    id: string;
    name: string;
    description: string;
    libraryId: string;
    userId: string;
    library: Library;
    user: User;
    playlistMediaItems: PlaylistMediaItem[];
    static getNumPlaylistsForUserAndLibrary(userId: string, libraryId: string): Promise<number>;
    checkHasMediaItem(libraryItemId: string, episodeId?: string): boolean;
    toOldJSON(): any;
    toOldJSONExpanded(): any;
}
