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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../core/database/models");
const logger_service_1 = require("../../core/logger/logger.service");
let PodcastService = class PodcastService {
    constructor(podcastModel, podcastEpisodeModel, logger) {
        this.podcastModel = podcastModel;
        this.podcastEpisodeModel = podcastEpisodeModel;
        this.logger = logger;
    }
    async findOne(id) {
        const podcast = await this.podcastModel.findByPk(id, {
            include: [models_1.PodcastEpisode],
        });
        if (!podcast) {
            throw new common_1.NotFoundException(`播客 ${id} 未找到`);
        }
        return podcast;
    }
    async getEpisodes(podcastId) {
        const podcast = await this.findOne(podcastId);
        return podcast.podcastEpisodes || [];
    }
    async getEpisode(episodeId) {
        const episode = await this.podcastEpisodeModel.findByPk(episodeId);
        if (!episode) {
            throw new common_1.NotFoundException(`播客剧集 ${episodeId} 未找到`);
        }
        return episode;
    }
    async update(id, updateData) {
        const podcast = await this.findOne(id);
        this.logger.info(`[PodcastService] 更新播客: ${id}`);
        Object.assign(podcast, updateData);
        await podcast.save();
        return podcast;
    }
    getTracklist(podcastId, episodeId, libraryItemId) {
        return [];
    }
    async checkHasEpisode(podcastId, feedEpisode) {
        const podcast = await this.findOne(podcastId);
        return podcast.checkHasEpisodeByFeedEpisode(feedEpisode);
    }
};
exports.PodcastService = PodcastService;
exports.PodcastService = PodcastService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Podcast)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.PodcastEpisode)),
    __metadata("design:paramtypes", [Object, Object, logger_service_1.LoggerService])
], PodcastService);
//# sourceMappingURL=podcast.service.js.map