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
var MediaProgress_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaProgress = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const book_model_1 = require("./book.model");
const podcast_episode_model_1 = require("./podcast-episode.model");
let MediaProgress = MediaProgress_1 = class MediaProgress extends sequelize_typescript_1.Model {
    static async removeById(mediaProgressId) {
        return MediaProgress_1.destroy({
            where: { id: mediaProgressId },
        });
    }
    get progress() {
        if (!this.duration)
            return 0;
        return Math.max(0, Math.min(this.currentTime / this.duration, 1));
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
    getOldMediaProgress() {
        const isPodcastEpisode = this.mediaItemType === 'podcastEpisode';
        return {
            id: this.id,
            userId: this.userId,
            libraryItemId: this.extraData?.libraryItemId || null,
            episodeId: isPodcastEpisode ? this.mediaItemId : null,
            mediaItemId: this.mediaItemId,
            mediaItemType: this.mediaItemType,
            duration: this.duration,
            progress: this.extraData?.progress || 0,
            currentTime: this.currentTime,
            isFinished: !!this.isFinished,
            hideFromContinueListening: !!this.hideFromContinueListening,
            ebookLocation: this.ebookLocation,
            ebookProgress: this.ebookProgress,
            lastUpdate: this.updatedAt.valueOf(),
            startedAt: this.createdAt.valueOf(),
            finishedAt: this.finishedAt?.valueOf() || null,
        };
    }
    async applyProgressUpdate(progressPayload, logger) {
        if (!this.extraData) {
            this.extraData = {};
        }
        if (progressPayload.isFinished !== undefined) {
            if (progressPayload.isFinished && !this.isFinished) {
                this.finishedAt = new Date(progressPayload.finishedAt || Date.now());
                this.extraData.progress = 1;
                this.changed('extraData', true);
                delete progressPayload.finishedAt;
            }
            else if (!progressPayload.isFinished && this.isFinished) {
                this.finishedAt = null;
                this.extraData.progress = 0;
                this.currentTime = 0;
                this.changed('extraData', true);
                delete progressPayload.finishedAt;
                delete progressPayload.currentTime;
            }
        }
        else if (progressPayload.progress !== undefined && !isNaN(progressPayload.progress)) {
            if (progressPayload.progress !== this.progress) {
                this.extraData.progress = Math.min(1, Math.max(0, progressPayload.progress));
                this.changed('extraData', true);
            }
        }
        Object.assign(this, progressPayload);
        if (this.changed('currentTime') && !progressPayload.hideFromContinueListening) {
            this.hideFromContinueListening = false;
        }
        const timeRemaining = this.duration - this.currentTime;
        let shouldMarkAsFinished = false;
        if (this.duration) {
            if (progressPayload.markAsFinishedPercentComplete !== undefined &&
                progressPayload.markAsFinishedPercentComplete !== null &&
                !isNaN(progressPayload.markAsFinishedPercentComplete) &&
                progressPayload.markAsFinishedPercentComplete > 0) {
                const markAsFinishedPercentComplete = Number(progressPayload.markAsFinishedPercentComplete) / 100;
                shouldMarkAsFinished = markAsFinishedPercentComplete < this.progress;
                if (shouldMarkAsFinished) {
                    logger?.info(`[MediaProgress] Marking media progress as finished because progress (${this.progress}) is greater than ${markAsFinishedPercentComplete} (media item ${this.mediaItemId})`);
                }
            }
            else {
                const markAsFinishedTimeRemaining = progressPayload.markAsFinishedTimeRemaining !== undefined &&
                    !isNaN(progressPayload.markAsFinishedTimeRemaining)
                    ? Number(progressPayload.markAsFinishedTimeRemaining)
                    : 10;
                shouldMarkAsFinished = timeRemaining < markAsFinishedTimeRemaining;
                if (shouldMarkAsFinished) {
                    logger?.info(`[MediaProgress] Marking media progress as finished because time remaining (${timeRemaining}) is less than ${markAsFinishedTimeRemaining} seconds (media item ${this.mediaItemId})`);
                }
            }
        }
        if (!this.isFinished && shouldMarkAsFinished) {
            this.isFinished = true;
            this.finishedAt = this.finishedAt || new Date();
            this.extraData.progress = 1;
            this.changed('extraData', true);
        }
        else if (this.isFinished && this.changed('currentTime') && !shouldMarkAsFinished) {
            this.isFinished = false;
            this.finishedAt = null;
        }
        await this.save();
        if (progressPayload.lastUpdate) {
            const lastUpdateDate = new Date(progressPayload.lastUpdate);
            if (isNaN(lastUpdateDate.getTime())) {
                logger?.warn(`[MediaProgress] Invalid date provided for lastUpdate: ${progressPayload.lastUpdate} (media item ${this.mediaItemId})`);
            }
            else {
                logger?.info(`[MediaProgress] Manually setting updatedAt to ${lastUpdateDate.toISOString()} (media item ${this.mediaItemId})`);
                await this.sequelize.query(`UPDATE "mediaProgresses" SET "updatedAt" = ? WHERE "id" = ?`, {
                    replacements: [lastUpdateDate, this.id],
                });
                await this.reload();
            }
        }
        return this;
    }
    static async beforeBulkDestroyHook(options) {
        options.individualHooks = true;
    }
    static async afterDestroyHook(instance) {
        if (instance.user) {
        }
    }
};
exports.MediaProgress = MediaProgress;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MediaProgress.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MediaProgress.prototype, "mediaItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MediaProgress.prototype, "mediaItemType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], MediaProgress.prototype, "duration", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], MediaProgress.prototype, "currentTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MediaProgress.prototype, "isFinished", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MediaProgress.prototype, "hideFromContinueListening", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MediaProgress.prototype, "ebookLocation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], MediaProgress.prototype, "ebookProgress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MediaProgress.prototype, "finishedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], MediaProgress.prototype, "extraData", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MediaProgress.prototype, "podcastId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MediaProgress.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_1.User)
], MediaProgress.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.BeforeBulkDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaProgress, "beforeBulkDestroyHook", null);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MediaProgress]),
    __metadata("design:returntype", Promise)
], MediaProgress, "afterDestroyHook", null);
exports.MediaProgress = MediaProgress = MediaProgress_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'mediaProgresses',
        timestamps: true,
        indexes: [
            {
                fields: ['updatedAt'],
            },
        ],
    })
], MediaProgress);
//# sourceMappingURL=media-progress.model.js.map