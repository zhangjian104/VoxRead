import { SeriesService } from './series.service';
export declare class SeriesController {
    private readonly seriesService;
    constructor(seriesService: SeriesService);
    findOne(id: string): Promise<any>;
    update(id: string, updateData: Partial<any>): Promise<any>;
}
