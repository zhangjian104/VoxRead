"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Podcast_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Podcast = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const podcast_episode_model_1 = require("./podcast-episode.model");
let Podcast = Podcast_1 = class Podcast extends sequelize_typescript_1.Model {
    static getTitleIgnorePrefix(title) {
        if (!title)
            return '';
        const prefixes = ['the ', 'a ', 'an '];
        const lowerTitle = title.toLowerCase();
        for (const prefix of prefixes) {
            if (lowerTitle.startsWith(prefix)) {
                return title.substring(prefix.length);
            }
        }
        return title;
    }
    static getTitlePrefixAtEnd(title) {
        if (!title)
            return '';
        const prefixes = ['the', 'a', 'an'];
        const words = title.split(' ');
        if (words.length > 1 && prefixes.includes(words[0].toLowerCase())) {
            return `${words.slice(1).join(' ')}, ${words[0]}`;
        }
        return title;
    }
    get hasMediaFiles() {
        return !!this.podcastEpisodes?.length;
    }
    get hasAudioTracks() {
        return this.hasMediaFiles;
    }
    get size() {
        if (!this.podcastEpisodes?.length)
            return 0;
        return this.podcastEpisodes.reduce((total, episode) => total + episode.size, 0);
    }
    checkCanDirectPlay(supportedMimeTypes, episodeId) {
        if (!Array.isArray(supportedMimeTypes)) {
            return false;
        }
        const episode = this.podcastEpisodes?.find((ep) => ep.id === episodeId);
        if (!episode?.audioFile) {
            return false;
        }
        return supportedMimeTypes.includes(episode.audioFile.mimeType);
    }
    getTracklist(libraryItemId, episodeId) {
        const episode = this.podcastEpisodes?.find((ep) => ep.id === episodeId);
        if (!episode) {
            return [];
        }
        const audioTrack = episode.getAudioTrack(libraryItemId);
        return audioTrack ? [audioTrack] : [];
    }
    getChapters(episodeId) {
        const episode = this.podcastEpisodes?.find((ep) => ep.id === episodeId);
        if (!episode) {
            return [];
        }
        return structuredClone(episode.chapters) || [];
    }
    getPlaybackTitle(episodeId) {
        const episode = this.podcastEpisodes?.find((ep) => ep.id === episodeId);
        return episode?.title || '';
    }
    getPlaybackAuthor() {
        return this.author;
    }
    getPlaybackDuration(episodeId) {
        const episode = this.podcastEpisodes?.find((ep) => ep.id === episodeId);
        return episode?.duration || 0;
    }
    getLatestEpisodePublishedAt() {
        if (!this.podcastEpisodes?.length)
            return 0;
        return this.podcastEpisodes.reduce((latest, episode) => {
            const publishedAt = episode.publishedAt?.valueOf() || 0;
            return publishedAt > latest ? publishedAt : latest;
        }, 0);
    }
    checkHasEpisodeByFeedEpisode(feedEpisode) {
        const guid = feedEpisode.guid;
        const url = feedEpisode.enclosure?.url;
        return this.podcastEpisodes?.some((ep) => ep.checkMatchesGuidOrEnclosureUrl(guid, url)) || false;
    }
    toOldJSON(libraryItemId) {
        if (!libraryItemId) {
            throw new Error('[Podcast] Cannot convert to old JSON because libraryItemId is not provided');
        }
        if (!this.podcastEpisodes) {
            throw new Error('[Podcast] Cannot convert to old JSON because episodes are not provided');
        }
        return {
            id: this.id,
            libraryItemId,
            metadata: {
                title: this.title,
                author: this.author,
                description: this.description,
                releaseDate: this.releaseDate,
                genres: [...(this.genres || [])],
                feedUrl: this.feedURL,
                imageUrl: this.imageURL,
                itunesPageUrl: this.itunesPageURL,
                itunesId: this.itunesId,
                itunesArtistId: this.itunesArtistId,
                explicit: this.explicit,
                language: this.language,
                type: this.podcastType,
            },
            coverPath: this.coverPath,
            tags: [...(this.tags || [])],
            episodes: this.podcastEpisodes.map((episode) => episode.toOldJSON(libraryItemId)),
            autoDownloadEpisodes: this.autoDownloadEpisodes,
            autoDownloadSchedule: this.autoDownloadSchedule,
            lastEpisodeCheck: this.lastEpisodeCheck?.valueOf() || null,
            maxEpisodesToKeep: this.maxEpisodesToKeep,
            maxNewEpisodesToDownload: this.maxNewEpisodesToDownload,
        };
    }
    toOldJSONMinified() {
        return {
            id: this.id,
            metadata: {
                title: this.title,
                titleIgnorePrefix: Podcast_1.getTitlePrefixAtEnd(this.title),
                author: this.author,
                description: this.description,
                releaseDate: this.releaseDate,
                genres: [...(this.genres || [])],
                feedUrl: this.feedURL,
                imageUrl: this.imageURL,
                itunesPageUrl: this.itunesPageURL,
                itunesId: this.itunesId,
                itunesArtistId: this.itunesArtistId,
                explicit: this.explicit,
                language: this.language,
                type: this.podcastType,
            },
            coverPath: this.coverPath,
            tags: [...(this.tags || [])],
            numEpisodes: this.podcastEpisodes?.length || 0,
            autoDownloadEpisodes: this.autoDownloadEpisodes,
            autoDownloadSchedule: this.autoDownloadSchedule,
            lastEpisodeCheck: this.lastEpisodeCheck?.valueOf() || null,
            maxEpisodesToKeep: this.maxEpisodesToKeep,
            maxNewEpisodesToDownload: this.maxNewEpisodesToDownload,
            size: this.size,
        };
    }
    toOldJSONExpanded(libraryItemId) {
        if (!libraryItemId) {
            throw new Error('[Podcast] Cannot convert to old JSON because libraryItemId is not provided');
        }
        if (!this.podcastEpisodes) {
            throw new Error('[Podcast] Cannot convert to old JSON because episodes are not provided');
        }
        return {
            id: this.id,
            libraryItemId,
            metadata: {
                title: this.title,
                titleIgnorePrefix: Podcast_1.getTitlePrefixAtEnd(this.title),
                author: this.author,
                description: this.description,
                releaseDate: this.releaseDate,
                genres: [...(this.genres || [])],
                feedUrl: this.feedURL,
                imageUrl: this.imageURL,
                itunesPageUrl: this.itunesPageURL,
                itunesId: this.itunesId,
                itunesArtistId: this.itunesArtistId,
                explicit: this.explicit,
                language: this.language,
                type: this.podcastType,
            },
            coverPath: this.coverPath,
            tags: [...(this.tags || [])],
            episodes: this.podcastEpisodes.map((e) => e.toOldJSONExpanded(libraryItemId)),
            autoDownloadEpisodes: this.autoDownloadEpisodes,
            autoDownloadSchedule: this.autoDownloadSchedule,
            lastEpisodeCheck: this.lastEpisodeCheck?.valueOf() || null,
            maxEpisodesToKeep: this.maxEpisodesToKeep,
            maxNewEpisodesToDownload: this.maxNewEpisodesToDownload,
            size: this.size,
        };
    }
};
exports.Podcast = Podcast;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Podcast.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "titleIgnorePrefix", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "author", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "releaseDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "feedURL", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "imageURL", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Podcast.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "itunesPageURL", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "itunesId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "itunesArtistId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "language", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "podcastType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Podcast.prototype, "explicit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Podcast.prototype, "autoDownloadEpisodes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "autoDownloadSchedule", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Podcast.prototype, "lastEpisodeCheck", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Podcast.prototype, "maxEpisodesToKeep", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Podcast.prototype, "maxNewEpisodesToDownload", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Podcast.prototype, "coverPath", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Podcast.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Podcast.prototype, "genres", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Podcast.prototype, "numEpisodes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => podcast_episode_model_1.PodcastEpisode),
    __metadata("design:type", Array)
], Podcast.prototype, "podcastEpisodes", void 0);
exports.Podcast = Podcast = Podcast_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'podcasts',
        timestamps: true,
    })
], Podcast);
//# sourceMappingURL=podcast.model.js.map