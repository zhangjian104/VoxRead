import { Model } from 'sequelize-typescript';
import { LibraryFolder } from './library-folder.model';
import { LibraryItem } from './library-item.model';
import { Author } from './author.model';
import { Series } from './series.model';
import { LoggerService } from '../../logger/logger.service';
export interface LibrarySettingsObject {
    coverAspectRatio?: number;
    disableWatcher?: boolean;
    skipMatchingMediaWithAsin?: boolean;
    skipMatchingMediaWithIsbn?: boolean;
    autoScanCronExpression?: string;
    audiobooksOnly?: boolean;
    epubsAllowScriptedContent?: boolean;
    hideSingleBookSeries?: boolean;
    onlyShowLaterBooksInContinueSeries?: boolean;
    metadataPrecedence?: string[];
    markAsFinishedTimeRemaining?: number;
    markAsFinishedPercentComplete?: number;
    podcastSearchRegion?: string;
}
export declare class Library extends Model<Library> {
    id: string;
    name: string;
    displayOrder: number;
    icon: string;
    mediaType: 'book' | 'podcast';
    provider: string;
    lastScan: Date;
    lastScanVersion: string;
    settings: LibrarySettingsObject;
    extraData: Record<string, any>;
    libraryFolders: LibraryFolder[];
    libraryItems: LibraryItem[];
    authors: Author[];
    series: Series[];
    static get defaultMetadataPrecedence(): string[];
    static getDefaultLibrarySettingsForMediaType(mediaType: 'book' | 'podcast'): LibrarySettingsObject;
    static getAllWithFolders(): Promise<Library[]>;
    static findByIdWithFolders(libraryId: string): Promise<Library>;
    static getAllLibraryIds(): Promise<string[]>;
    static getMaxDisplayOrder(): Promise<number>;
    static resetDisplayOrder(logger?: LoggerService): Promise<void>;
    get isPodcast(): boolean;
    get isBook(): boolean;
    get lastScanMetadataPrecedence(): string[];
    get librarySettings(): LibrarySettingsObject;
    toOldJSON(): any;
}
