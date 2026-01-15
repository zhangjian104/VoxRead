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
exports.PlaylistMediaItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const playlist_model_1 = require("./playlist.model");
const book_model_1 = require("./book.model");
const podcast_episode_model_1 = require("./podcast-episode.model");
let PlaylistMediaItem = class PlaylistMediaItem extends sequelize_typescript_1.Model {
    async getMediaItem() {
        if (!this.mediaItemType || !this.mediaItemId)
            return null;
        if (this.mediaItemType === 'book') {
            return await book_model_1.Book.findByPk(this.mediaItemId);
        }
        else {
            return await podcast_episode_model_1.PodcastEpisode.findByPk(this.mediaItemId);
        }
    }
};
exports.PlaylistMediaItem = PlaylistMediaItem;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaylistMediaItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaylistMediaItem.prototype, "mediaItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaylistMediaItem.prototype, "mediaItemType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PlaylistMediaItem.prototype, "order", void 0);
__decorate([
    ForeignKey(() => playlist_model_1.Playlist),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaylistMediaItem.prototype, "playlistId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => playlist_model_1.Playlist, { onDelete: 'CASCADE' }),
    __metadata("design:type", playlist_model_1.Playlist)
], PlaylistMediaItem.prototype, "playlist", void 0);
exports.PlaylistMediaItem = PlaylistMediaItem = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'playlistMediaItems',
        timestamps: true,
        updatedAt: false,
    })
], PlaylistMediaItem);
//# sourceMappingURL=playlist-media-item.model.js.map