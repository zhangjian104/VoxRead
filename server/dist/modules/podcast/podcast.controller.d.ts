import { PodcastService } from './podcast.service';
export declare class PodcastController {
    private readonly podcastService;
    constructor(podcastService: PodcastService);
    findOne(id: string): Promise<any>;
    getEpisodes(id: string): Promise<{
        episodes: any[];
    }>;
    getEpisode(id: string, episodeId: string): Promise<any>;
    update(id: string, updateData: any): Promise<any>;
}
