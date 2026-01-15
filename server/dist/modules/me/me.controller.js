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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const me_service_1 = require("./me.service");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const auth_service_1 = require("../../auth/auth.service");
let MeController = class MeController {
    constructor(meService, authService) {
        this.meService = meService;
        this.authService = authService;
    }
    getCurrentUser(user) {
        return this.meService.getCurrentUser(user);
    }
    async getListeningSessions(user, page, itemsPerPage) {
        const pageNum = page || 0;
        const itemsNum = itemsPerPage || 10;
        return this.meService.getListeningSessions(user.id, pageNum, itemsNum);
    }
    async getItemListeningSessions(user, libraryItemId, episodeId, page, itemsPerPage) {
        const pageNum = page || 0;
        const itemsNum = itemsPerPage || 10;
        return this.meService.getItemListeningSessions(user.id, libraryItemId, episodeId || null, pageNum, itemsNum);
    }
    async getListeningStats(user) {
        return this.meService.getListeningStats(user.id);
    }
    async getMediaProgress(user, id, episodeId) {
        return this.meService.getMediaProgress(user, id, episodeId || null);
    }
    async removeMediaProgress(user, id) {
        await this.meService.removeMediaProgress(user, id);
        return { success: true };
    }
    async createUpdateMediaProgress(user, libraryItemId, episodeId, progressData) {
        await this.meService.createUpdateMediaProgress(user, libraryItemId, episodeId || null, progressData);
        return { success: true };
    }
    async batchUpdateMediaProgress(user, itemProgressPayloads) {
        await this.meService.batchUpdateMediaProgress(user, itemProgressPayloads);
        return { success: true };
    }
    async createBookmark(user, id, body) {
        return this.meService.createBookmark(user, id, body.time, body.title);
    }
    async updateBookmark(user, id, body) {
        return this.meService.updateBookmark(user, id, body.time, body.title);
    }
    async removeBookmark(user, id, time) {
        await this.meService.removeBookmark(user, id, Number(time));
        return { success: true };
    }
    async updatePassword(user, body) {
        await this.meService.updatePassword(user, body.password, body.newPassword, this.authService.changePassword.bind(this.authService));
        return { success: true };
    }
    async getAllLibraryItemsInProgress(user, limit) {
        const limitNum = limit || 25;
        return this.meService.getAllLibraryItemsInProgress(user, limitNum);
    }
    async removeSeriesFromContinueListening(user, id) {
        return this.meService.removeSeriesFromContinueListening(user, id);
    }
    async readdSeriesFromContinueListening(user, id) {
        return this.meService.readdSeriesFromContinueListening(user, id);
    }
    async removeItemFromContinueListening(user, id) {
        return this.meService.removeItemFromContinueListening(user, id);
    }
    async updateUserEReaderDevices(user, body) {
        return this.meService.updateUserEReaderDevices(user, body.ereaderDevices);
    }
    async getStatsForYear(user, year) {
        return this.meService.getStatsForYear(user.id, Number(year));
    }
};
exports.MeController = MeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], MeController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('listening-sessions'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('itemsPerPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof User !== "undefined" && User) === "function" ? _b : Object, Number, Number]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getListeningSessions", null);
__decorate([
    (0, common_1.Get)('item/listening-sessions/:libraryItemId/:episodeId?'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('libraryItemId')),
    __param(2, (0, common_1.Param)('episodeId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('itemsPerPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof User !== "undefined" && User) === "function" ? _c : Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getItemListeningSessions", null);
__decorate([
    (0, common_1.Get)('listening-stats'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof User !== "undefined" && User) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getListeningStats", null);
__decorate([
    (0, common_1.Get)('progress/:id/:episodeId?'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('episodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof User !== "undefined" && User) === "function" ? _e : Object, String, String]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getMediaProgress", null);
__decorate([
    (0, common_1.Delete)('progress/:id'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof User !== "undefined" && User) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "removeMediaProgress", null);
__decorate([
    (0, common_1.Patch)('progress/:libraryItemId/:episodeId?'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('libraryItemId')),
    __param(2, (0, common_1.Param)('episodeId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof User !== "undefined" && User) === "function" ? _g : Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "createUpdateMediaProgress", null);
__decorate([
    (0, common_1.Patch)('progress/batch/update'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof User !== "undefined" && User) === "function" ? _h : Object, Array]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "batchUpdateMediaProgress", null);
__decorate([
    (0, common_1.Post)('item/:id/bookmark'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof User !== "undefined" && User) === "function" ? _j : Object, String, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "createBookmark", null);
__decorate([
    (0, common_1.Patch)('item/:id/bookmark'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof User !== "undefined" && User) === "function" ? _k : Object, String, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "updateBookmark", null);
__decorate([
    (0, common_1.Delete)('item/:id/bookmark/:time'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('time')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof User !== "undefined" && User) === "function" ? _l : Object, String, String]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "removeBookmark", null);
__decorate([
    (0, common_1.Patch)('password'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof User !== "undefined" && User) === "function" ? _m : Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)('items-in-progress'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof User !== "undefined" && User) === "function" ? _o : Object, Number]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getAllLibraryItemsInProgress", null);
__decorate([
    (0, common_1.Get)('series/:id/remove-from-continue-listening'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof User !== "undefined" && User) === "function" ? _p : Object, String]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "removeSeriesFromContinueListening", null);
__decorate([
    (0, common_1.Get)('series/:id/readd-to-continue-listening'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof User !== "undefined" && User) === "function" ? _q : Object, String]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "readdSeriesFromContinueListening", null);
__decorate([
    (0, common_1.Get)('progress/:id/remove-from-continue-listening'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof User !== "undefined" && User) === "function" ? _r : Object, String]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "removeItemFromContinueListening", null);
__decorate([
    (0, common_1.Post)('ereader-devices'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof User !== "undefined" && User) === "function" ? _s : Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "updateUserEReaderDevices", null);
__decorate([
    (0, common_1.Get)('stats/year/:year'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof User !== "undefined" && User) === "function" ? _t : Object, String]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getStatsForYear", null);
exports.MeController = MeController = __decorate([
    (0, common_1.Controller)('api/me'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [me_service_1.MeService,
        auth_service_1.AuthService])
], MeController);
//# sourceMappingURL=me.controller.js.map