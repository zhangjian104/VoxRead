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
var MediaItemShare_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaItemShare = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const book_model_1 = require("./book.model");
const podcast_episode_model_1 = require("./podcast-episode.model");
let MediaItemShare = MediaItemShare_1 = class MediaItemShare extends sequelize_typescript_1.Model {
    static async findBySlug(slug) {
        return MediaItemShare_1.findOne({
            where: { slug },
        });
    }
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
    toJSONForClient() {
        return {
            id: this.id,
            mediaItemId: this.mediaItemId,
            mediaItemType: this.mediaItemType,
            slug: this.slug,
            expiresAt: this.expiresAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isDownloadable: this.isDownloadable,
        };
    }
};
exports.MediaItemShare = MediaItemShare;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MediaItemShare.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MediaItemShare.prototype, "mediaItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MediaItemShare.prototype, "mediaItemType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MediaItemShare.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MediaItemShare.prototype, "pash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MediaItemShare.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MediaItemShare.prototype, "isDownloadable", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], MediaItemShare.prototype, "extraData", void 0);
__decorate([
    ForeignKey(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MediaItemShare.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], MediaItemShare.prototype, "user", void 0);
exports.MediaItemShare = MediaItemShare = MediaItemShare_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'mediaItemShares',
        timestamps: true,
    })
], MediaItemShare);
//# sourceMappingURL=media-item-share.model.js.map