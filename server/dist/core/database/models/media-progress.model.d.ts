import { Model } from 'sequelize-typescript';
import { User } from './user.model';
import { Book } from './book.model';
import { PodcastEpisode } from './podcast-episode.model';
import { LoggerService } from '../../logger/logger.service';
export interface ProgressUpdatePayload {
    duration?: number;
    currentTime?: number;
    isFinished?: boolean;
    hideFromContinueListening?: boolean;
    ebookLocation?: string;
    ebookProgress?: number;
    finishedAt?: number;
    progress?: number;
    markAsFinishedTimeRemaining?: number;
    markAsFinishedPercentComplete?: number;
    lastUpdate?: number;
}
export declare class MediaProgress extends Model<MediaProgress> {
    id: string;
    mediaItemId: string;
    mediaItemType: 'book' | 'podcastEpisode';
    duration: number;
    currentTime: number;
    isFinished: boolean;
    hideFromContinueListening: boolean;
    ebookLocation: string;
    ebookProgress: number;
    finishedAt: Date;
    extraData: Record<string, any>;
    podcastId: string;
    userId: string;
    user: User;
    mediaItem: Book | PodcastEpisode;
    static removeById(mediaProgressId: string): Promise<number>;
    get progress(): number;
    getMediaItem(): Promise<Book | PodcastEpisode>;
    getOldMediaProgress(): any;
    applyProgressUpdate(progressPayload: ProgressUpdatePayload, logger?: LoggerService): Promise<MediaProgress>;
    static beforeBulkDestroyHook(options: any): Promise<void>;
    static afterDestroyHook(instance: MediaProgress): Promise<void>;
}
