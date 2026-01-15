import { Series } from '../../core/database/models';
import { LoggerService } from '../../core/logger/logger.service';
export declare class SeriesService {
    private seriesModel;
    private logger;
    constructor(seriesModel: typeof Series, logger: LoggerService);
    findOne(id: string): Promise<Series>;
    findAllByLibrary(libraryId: string): Promise<Series[]>;
    update(id: string, updateData: Partial<Series>): Promise<Series>;
    exists(id: string): Promise<boolean>;
}
