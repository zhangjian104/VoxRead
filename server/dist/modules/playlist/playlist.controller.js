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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const playlist_service_1 = require("./playlist.service");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let PlaylistController = class PlaylistController {
    constructor(playlistService) {
        this.playlistService = playlistService;
    }
    async create(createDto, user) {
        return this.playlistService.create(createDto, user);
    }
    async findAllForUser(user) {
        return this.playlistService.findAllForUser(user.id);
    }
    async findOne(id, user) {
        return this.playlistService.findOne(id, user.id);
    }
    async update(id, updateDto, user) {
        return this.playlistService.update(id, updateDto, user.id);
    }
    async delete(id, user) {
        await this.playlistService.delete(id, user.id);
        return { success: true };
    }
    async addItem(id, itemToAdd, user) {
        return this.playlistService.addItem(id, itemToAdd, user.id);
    }
    async removeItem(id, libraryItemId, episodeId) {
        return this.playlistService.removeItem(id, libraryItemId, episodeId || null, episodeId);
    }
    async addBatch(id, body, user) {
        return this.playlistService.addBatch(id, body.items, user.id);
    }
    async removeBatch(id, body, user) {
        return this.playlistService.removeBatch(id, body.items, user.id);
    }
    async createFromCollection(collectionId, user) {
        return this.playlistService.createFromCollection(collectionId, user);
    }
};
exports.PlaylistController = PlaylistController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof User !== "undefined" && User) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "findAllForUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof User !== "undefined" && User) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof User !== "undefined" && User) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof User !== "undefined" && User) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/item'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof User !== "undefined" && User) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':id/item/:libraryItemId/:episodeId?'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('libraryItemId')),
    __param(2, (0, common_1.Param)('episodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Post)(':id/batch/add'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof User !== "undefined" && User) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "addBatch", null);
__decorate([
    (0, common_1.Post)(':id/batch/remove'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_h = typeof User !== "undefined" && User) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "removeBatch", null);
__decorate([
    (0, common_1.Post)('collection/:collectionId'),
    __param(0, (0, common_1.Param)('collectionId')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_j = typeof User !== "undefined" && User) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "createFromCollection", null);
exports.PlaylistController = PlaylistController = __decorate([
    (0, common_1.Controller)('api/playlists'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [playlist_service_1.PlaylistService])
], PlaylistController);
//# sourceMappingURL=playlist.controller.js.map