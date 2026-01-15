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
var PlaybackSession_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybackSession = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const device_model_1 = require("./device.model");
const library_model_1 = require("./library.model");
let PlaybackSession = PlaybackSession_1 = class PlaybackSession extends sequelize_typescript_1.Model {
    static async removeById(sessionId) {
        return PlaybackSession_1.destroy({
            where: { id: sessionId },
        });
    }
    static async getById(sessionId) {
        return PlaybackSession_1.findByPk(sessionId, {
            include: [device_model_1.Device],
        });
    }
    toOldJSON() {
        const isPodcastEpisode = this.mediaItemType === 'podcastEpisode';
        return {
            id: this.id,
            userId: this.userId,
            libraryId: this.libraryId,
            libraryItemId: this.extraData?.libraryItemId || null,
            bookId: isPodcastEpisode ? null : this.mediaItemId,
            episodeId: isPodcastEpisode ? this.mediaItemId : null,
            mediaType: isPodcastEpisode ? 'podcast' : 'book',
            mediaMetadata: this.mediaMetadata,
            chapters: null,
            displayTitle: this.displayTitle,
            displayAuthor: this.displayAuthor,
            coverPath: this.coverPath,
            duration: this.duration,
            playMethod: this.playMethod,
            mediaPlayer: this.mediaPlayer,
            deviceInfo: this.device?.toOldJSON() || null,
            serverVersion: this.serverVersion,
            date: this.date,
            dayOfWeek: this.dayOfWeek,
            timeListening: this.timeListening,
            startTime: this.startTime,
            currentTime: this.currentTime,
            startedAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
        };
    }
};
exports.PlaybackSession = PlaybackSession;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaybackSession.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaybackSession.prototype, "mediaItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "mediaItemType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "displayTitle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "displayAuthor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], PlaybackSession.prototype, "duration", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PlaybackSession.prototype, "playMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "mediaPlayer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], PlaybackSession.prototype, "startTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], PlaybackSession.prototype, "currentTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "serverVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "coverPath", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], PlaybackSession.prototype, "timeListening", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], PlaybackSession.prototype, "mediaMetadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PlaybackSession.prototype, "dayOfWeek", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], PlaybackSession.prototype, "extraData", void 0);
__decorate([
    ForeignKey(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaybackSession.prototype, "userId", void 0);
__decorate([
    ForeignKey(() => device_model_1.Device),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaybackSession.prototype, "deviceId", void 0);
__decorate([
    ForeignKey(() => library_model_1.Library),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PlaybackSession.prototype, "libraryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], PlaybackSession.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => device_model_1.Device),
    __metadata("design:type", device_model_1.Device)
], PlaybackSession.prototype, "device", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_model_1.Library),
    __metadata("design:type", library_model_1.Library)
], PlaybackSession.prototype, "library", void 0);
exports.PlaybackSession = PlaybackSession = PlaybackSession_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'playbackSessions',
        timestamps: true,
    })
], PlaybackSession);
//# sourceMappingURL=playback-session.model.js.map