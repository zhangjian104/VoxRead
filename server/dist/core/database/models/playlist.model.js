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
var Playlist_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const library_model_1 = require("./library.model");
const user_model_1 = require("./user.model");
const playlist_media_item_model_1 = require("./playlist-media-item.model");
let Playlist = Playlist_1 = class Playlist extends sequelize_typescript_1.Model {
    static async getNumPlaylistsForUserAndLibrary(userId, libraryId) {
        return Playlist_1.count({
            where: { userId, libraryId },
        });
    }
    checkHasMediaItem(libraryItemId, episodeId) {
        if (!this.playlistMediaItems) {
            throw new Error('playlistMediaItems are required to check Playlist');
        }
        if (episodeId) {
            return this.playlistMediaItems.some((pmi) => pmi.mediaItemId === episodeId);
        }
        return this.playlistMediaItems.some((pmi) => pmi.mediaItem?.libraryItem?.id === libraryItemId);
    }
    toOldJSON() {
        return {
            id: this.id,
            name: this.name,
            libraryId: this.libraryId,
            userId: this.userId,
            description: this.description,
            lastUpdate: this.updatedAt.valueOf(),
            createdAt: this.createdAt.valueOf(),
        };
    }
    toOldJSONExpanded() {
        if (!this.playlistMediaItems) {
            throw new Error('playlistMediaItems are required to expand Playlist');
        }
        const json = this.toOldJSON();
        json.items = this.playlistMediaItems.map((pmi) => {
            if (pmi.mediaItemType === 'book') {
                const libraryItem = pmi.mediaItem.libraryItem;
                delete pmi.mediaItem.libraryItem;
                libraryItem.media = pmi.mediaItem;
                return {
                    libraryItemId: libraryItem.id,
                    libraryItem: libraryItem.toOldJSONExpanded(),
                };
            }
            const libraryItem = pmi.mediaItem.podcast.libraryItem;
            delete pmi.mediaItem.podcast.libraryItem;
            libraryItem.media = pmi.mediaItem.podcast;
            return {
                episodeId: pmi.mediaItemId,
                episode: pmi.mediaItem.toOldJSONExpanded(libraryItem.id),
                libraryItemId: libraryItem.id,
                libraryItem: libraryItem.toOldJSONMinified(),
            };
        });
        return json;
    }
};
exports.Playlist = Playlist;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Playlist.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Playlist.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Playlist.prototype, "description", void 0);
__decorate([
    ForeignKey(() => library_model_1.Library),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Playlist.prototype, "libraryId", void 0);
__decorate([
    ForeignKey(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Playlist.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_model_1.Library),
    __metadata("design:type", library_model_1.Library)
], Playlist.prototype, "library", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_1.User)
], Playlist.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => playlist_media_item_model_1.PlaylistMediaItem, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Playlist.prototype, "playlistMediaItems", void 0);
exports.Playlist = Playlist = Playlist_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'playlists',
        timestamps: true,
    })
], Playlist);
//# sourceMappingURL=playlist.model.js.map