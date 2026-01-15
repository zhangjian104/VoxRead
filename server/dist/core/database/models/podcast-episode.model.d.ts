import { Model } from 'sequelize-typescript';
import { Podcast } from './podcast.model';
import { AudioFileObject, ChapterObject } from './book.model';
export declare class PodcastEpisode extends Model<PodcastEpisode> {
    id: string;
    index: number;
    season: string;
    episode: string;
    episodeType: string;
    title: string;
    subtitle: string;
    description: string;
    pubDate: string;
    enclosureURL: string;
    enclosureSize: string;
    enclosureType: string;
    publishedAt: Date;
    audioFile: AudioFileObject;
    chapters: ChapterObject[];
    extraData: Record<string, any>;
    podcastId: string;
    podcast: Podcast;
    get size(): number;
    get duration(): number;
    checkMatchesGuidOrEnclosureUrl(guid: string, enclosureUrl: string): boolean;
    getAudioTrack(libraryItemId: string): any;
    toOldJSON(libraryItemId: string): any;
    toOldJSONExpanded(libraryItemId: string): any;
}
