import { Podcast, PodcastEpisode } from '../../core/database/models';
import { LoggerService } from '../../core/logger/logger.service';
export declare class PodcastService {
    private podcastModel;
    private podcastEpisodeModel;
    private logger;
    constructor(podcastModel: typeof Podcast, podcastEpisodeModel: typeof PodcastEpisode, logger: LoggerService);
    findOne(id: string): Promise<Podcast>;
    getEpisodes(podcastId: string): Promise<PodcastEpisode[]>;
    getEpisode(episodeId: string): Promise<PodcastEpisode>;
    update(id: string, updateData: Partial<Podcast>): Promise<Podcast>;
    getTracklist(podcastId: string, episodeId: string, libraryItemId: string): any[];
    checkHasEpisode(podcastId: string, feedEpisode: any): Promise<boolean>;
}
