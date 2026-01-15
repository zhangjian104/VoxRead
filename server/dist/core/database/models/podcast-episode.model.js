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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastEpisode = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const podcast_model_1 = require("./podcast.model");
let PodcastEpisode = class PodcastEpisode extends sequelize_typescript_1.Model {
    get size() {
        return this.audioFile?.metadata?.size || 0;
    }
    get duration() {
        return this.audioFile?.duration || 0;
    }
    checkMatchesGuidOrEnclosureUrl(guid, enclosureUrl) {
        if (guid && this.extraData?.guid === guid) {
            return true;
        }
        if (enclosureUrl && this.enclosureURL === enclosureUrl) {
            return true;
        }
        return false;
    }
    getAudioTrack(libraryItemId) {
        if (!this.audioFile) {
            return null;
        }
        return {
            ...this.audioFile,
            title: this.title,
            contentUrl: `/api/items/${libraryItemId}/file/${this.audioFile.ino}`,
            startOffset: 0,
        };
    }
    toOldJSON(libraryItemId) {
        return {
            id: this.id,
            index: this.index,
            season: this.season,
            episode: this.episode,
            episodeType: this.episodeType,
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
            enclosure: this.enclosureURL
                ? {
                    url: this.enclosureURL,
                    type: this.enclosureType,
                    length: this.enclosureSize,
                }
                : null,
            guid: this.extraData?.guid || null,
            pubDate: this.pubDate,
            audioFile: this.audioFile ? { ...this.audioFile } : null,
            publishedAt: this.publishedAt?.valueOf() || null,
            addedAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
            duration: this.duration,
            size: this.size,
        };
    }
    toOldJSONExpanded(libraryItemId) {
        const json = this.toOldJSON(libraryItemId);
        json.audioTrack = this.getAudioTrack(libraryItemId);
        return json;
    }
};
exports.PodcastEpisode = PodcastEpisode;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PodcastEpisode.prototype, "index", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "season", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "episode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "episodeType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "subtitle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "pubDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "enclosureURL", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "enclosureSize", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "enclosureType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PodcastEpisode.prototype, "publishedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], PodcastEpisode.prototype, "audioFile", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], PodcastEpisode.prototype, "chapters", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], PodcastEpisode.prototype, "extraData", void 0);
__decorate([
    ForeignKey(() => podcast_model_1.Podcast),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PodcastEpisode.prototype, "podcastId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => podcast_model_1.Podcast),
    __metadata("design:type", podcast_model_1.Podcast)
], PodcastEpisode.prototype, "podcast", void 0);
exports.PodcastEpisode = PodcastEpisode = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'podcastEpisodes',
        timestamps: true,
        indexes: [
            {
                fields: ['createdAt'],
            },
            {
                fields: ['publishedAt'],
            },
        ],
    })
], PodcastEpisode);
//# sourceMappingURL=podcast-episode.model.js.map