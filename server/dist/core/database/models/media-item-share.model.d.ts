import { Model } from 'sequelize-typescript';
import { User } from './user.model';
import { Book } from './book.model';
import { PodcastEpisode } from './podcast-episode.model';
export declare class MediaItemShare extends Model<MediaItemShare> {
    id: string;
    mediaItemId: string;
    mediaItemType: 'book' | 'podcastEpisode';
    slug: string;
    pash: string;
    expiresAt: Date;
    isDownloadable: boolean;
    extraData: Record<string, any>;
    userId: string;
    user: User;
    mediaItem: Book | PodcastEpisode;
    static findBySlug(slug: string): Promise<MediaItemShare>;
    getMediaItem(): Promise<Book | PodcastEpisode>;
    toJSONForClient(): any;
}
