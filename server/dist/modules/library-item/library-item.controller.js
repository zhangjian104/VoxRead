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
exports.LibraryItemController = void 0;
const common_1 = require("@nestjs/common");
const library_item_service_1 = require("./library-item.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let LibraryItemController = class LibraryItemController {
    constructor(libraryItemService) {
        this.libraryItemService = libraryItemService;
    }
    async findOne(id, expanded, include, episode, user) {
        const libraryItem = await this.libraryItemService.findOne(id);
        if (!user.checkCanAccessLibrary(libraryItem.libraryId)) {
            throw new Error('没有权限访问该媒体项');
        }
        if (expanded === '1') {
            const item = libraryItem.toOldJSONExpanded();
            if (include?.includes('progress')) {
                const episodeId = episode || null;
                item.userMediaProgress = null;
            }
            if (include?.includes('rssfeed')) {
                item.rssFeed = null;
            }
            if (item.mediaType === 'book' && user.isAdminOrUp && include?.includes('share')) {
                item.mediaItemShare = null;
            }
            if (item.mediaType === 'podcast' && include?.includes('downloads')) {
                item.episodeDownloadsQueued = [];
                item.episodesDownloading = [];
            }
            return item;
        }
        return libraryItem.toOldJSON();
    }
    async delete(id, hard, user) {
        const libraryItem = await this.libraryItemService.findOne(id);
        if (!user.checkCanAccessLibrary(libraryItem.libraryId)) {
            throw new Error('没有权限删除该媒体项');
        }
        const hardDelete = hard === '1';
        if (hardDelete) {
        }
        await this.libraryItemService.delete(id);
        return { message: '媒体项已删除' };
    }
    async updateMedia(id, updateDto, user) {
        const libraryItem = await this.libraryItemService.findOne(id);
        if (!user.checkCanAccessLibrary(libraryItem.libraryId)) {
            throw new Error('没有权限更新该媒体项');
        }
        const updated = await this.libraryItemService.updateMedia(id, updateDto);
        return updated.toOldJSONExpanded();
    }
    async batchDelete(body) {
        const deletedCount = await this.libraryItemService.batchDelete(body.libraryItemIds);
        return { success: true, deletedCount };
    }
    async batchUpdate(body) {
        const { libraryItemIds, mediaPayload } = body;
        const updatedItems = [];
        for (const id of libraryItemIds) {
            try {
                const updated = await this.libraryItemService.updateMedia(id, mediaPayload);
                updatedItems.push(updated.toOldJSON());
            }
            catch (error) {
                console.error(`Failed to update library item ${id}:`, error);
            }
        }
        return { success: true, updates: updatedItems.length };
    }
    async batchGet(body) {
        const libraryItems = await this.libraryItemService.batchGet(body.libraryItemIds);
        return {
            libraryItems: libraryItems.map((item) => item.toOldJSON()),
        };
    }
    async scan(id) {
        const libraryItem = await this.libraryItemService.scan(id);
        return {
            result: libraryItem.toOldJSON(),
        };
    }
    async batchScan(body) {
        await this.libraryItemService.batchScan(body.libraryItemIds);
        return { success: true };
    }
    async getCover(id, res) {
        const coverPath = await this.libraryItemService.getCoverPath(id);
        if (!coverPath) {
            throw new Error('封面未找到');
        }
        return { coverPath };
    }
    async uploadCover(id, body) {
        return { success: true };
    }
    async updateCover(id, body) {
        return { success: true };
    }
    async removeCover(id) {
        return { success: true };
    }
    async match(id, body) {
        return { success: true, matches: [] };
    }
    async batchQuickMatch(body) {
        return { success: true };
    }
    async startPlaybackSession(id, body, user) {
        return { id: 'session-id' };
    }
    async startEpisodePlaybackSession(id, episodeId, body, user) {
        return { id: 'session-id' };
    }
    async download(id, res) {
        return { message: '下载功能待实现' };
    }
    async updateTracks(id, body) {
        return { success: true };
    }
    async updateMediaChapters(id, body) {
        return { success: true };
    }
    async getFFprobeData(id, fileid) {
        return { data: {} };
    }
    async getLibraryFile(id, fileid, res) {
        return { message: '文件流传输待实现' };
    }
    async deleteLibraryFile(id, fileid) {
        return { success: true };
    }
    async downloadLibraryFile(id, fileid, res) {
        return { message: '文件下载待实现' };
    }
    async getEBookFile(id, fileid) {
        return { message: '电子书获取待实现' };
    }
    async getMetadataObject(id, user) {
        const libraryItem = await this.libraryItemService.findOne(id);
        if (!user.checkCanAccessLibrary(libraryItem.libraryId)) {
            throw new Error('没有权限访问该媒体项');
        }
        return libraryItem.media;
    }
};
exports.LibraryItemController = LibraryItemController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('expanded')),
    __param(2, (0, common_1.Query)('include')),
    __param(3, (0, common_1.Query)('episode')),
    __param(4, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('hard')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/media'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "updateMedia", null);
__decorate([
    (0, common_1.Post)('batch/delete'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "batchDelete", null);
__decorate([
    (0, common_1.Post)('batch/update'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "batchUpdate", null);
__decorate([
    (0, common_1.Post)('batch/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "batchGet", null);
__decorate([
    (0, common_1.Post)(':id/scan'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "scan", null);
__decorate([
    (0, common_1.Post)('batch/scan'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "batchScan", null);
__decorate([
    (0, common_1.Get)(':id/cover'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "getCover", null);
__decorate([
    (0, common_1.Post)(':id/cover'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "uploadCover", null);
__decorate([
    (0, common_1.Patch)(':id/cover'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "updateCover", null);
__decorate([
    (0, common_1.Delete)(':id/cover'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "removeCover", null);
__decorate([
    (0, common_1.Post)(':id/match'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "match", null);
__decorate([
    (0, common_1.Post)('batch/quickmatch'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "batchQuickMatch", null);
__decorate([
    (0, common_1.Post)(':id/play'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "startPlaybackSession", null);
__decorate([
    (0, common_1.Post)(':id/play/:episodeId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('episodeId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "startEpisodePlaybackSession", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "download", null);
__decorate([
    (0, common_1.Patch)(':id/tracks'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "updateTracks", null);
__decorate([
    (0, common_1.Post)(':id/chapters'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "updateMediaChapters", null);
__decorate([
    (0, common_1.Get)(':id/ffprobe/:fileid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('fileid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "getFFprobeData", null);
__decorate([
    (0, common_1.Get)(':id/file/:fileid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('fileid')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "getLibraryFile", null);
__decorate([
    (0, common_1.Delete)(':id/file/:fileid'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('fileid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "deleteLibraryFile", null);
__decorate([
    (0, common_1.Get)(':id/file/:fileid/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('fileid')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "downloadLibraryFile", null);
__decorate([
    (0, common_1.Get)(':id/ebook/:fileid?'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('fileid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "getEBookFile", null);
__decorate([
    (0, common_1.Get)(':id/metadata-object'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryItemController.prototype, "getMetadataObject", null);
exports.LibraryItemController = LibraryItemController = __decorate([
    (0, common_1.Controller)('api/items'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [library_item_service_1.LibraryItemService])
], LibraryItemController);
//# sourceMappingURL=library-item.controller.js.map