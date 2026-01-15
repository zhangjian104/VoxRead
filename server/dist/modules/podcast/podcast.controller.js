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
exports.PodcastController = void 0;
const common_1 = require("@nestjs/common");
const podcast_service_1 = require("./podcast.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let PodcastController = class PodcastController {
    constructor(podcastService) {
        this.podcastService = podcastService;
    }
    async findOne(id) {
        const podcast = await this.podcastService.findOne(id);
        return podcast.toOldJSON('library-item-id');
    }
    async getEpisodes(id) {
        const episodes = await this.podcastService.getEpisodes(id);
        return {
            episodes: episodes.map((ep) => ep.toOldJSON('library-item-id')),
        };
    }
    async getEpisode(id, episodeId) {
        const episode = await this.podcastService.getEpisode(episodeId);
        return episode.toOldJSON('library-item-id');
    }
    async update(id, updateData) {
        const podcast = await this.podcastService.update(id, updateData);
        return podcast.toOldJSON('library-item-id');
    }
};
exports.PodcastController = PodcastController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/episodes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "getEpisodes", null);
__decorate([
    (0, common_1.Get)(':id/episode/:episodeId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('episodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "getEpisode", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "update", null);
exports.PodcastController = PodcastController = __decorate([
    (0, common_1.Controller)('api/podcasts'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [podcast_service_1.PodcastService])
], PodcastController);
//# sourceMappingURL=podcast.controller.js.map