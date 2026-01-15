import { Model } from 'sequelize-typescript';
import { Playlist } from './playlist.model';
import { Book } from './book.model';
import { PodcastEpisode } from './podcast-episode.model';
export declare class PlaylistMediaItem extends Model<PlaylistMediaItem> {
    id: string;
    mediaItemId: string;
    mediaItemType: 'book' | 'podcastEpisode';
    order: number;
    playlistId: string;
    playlist: Playlist;
    mediaItem: Book | PodcastEpisode;
    getMediaItem(): Promise<Book | PodcastEpisode>;
}
