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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const session_service_1 = require("./session.service");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let SessionController = class SessionController {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async getAllWithUserData(user) {
        return this.sessionService.getAllWithUserData(user);
    }
    async getLibrarySessions(user, libraryId) {
        return this.sessionService.getLibrarySessions(user, libraryId);
    }
    async delete(id, user) {
        await this.sessionService.delete(id, user);
        return { success: true };
    }
    async batchDelete(body, user) {
        await this.sessionService.batchDelete(body.sessions, user);
        return { success: true };
    }
    async getOpenSession(id) {
        return this.sessionService.getOpenSession(id);
    }
    async syncOpenSession(id, syncData, user) {
        return this.sessionService.syncOpenSession(id, syncData, user);
    }
    async closeSession(id, syncData, user) {
        await this.sessionService.closeSession(id, syncData, user);
        return { success: true };
    }
};
exports.SessionController = SessionController;
__decorate([
    (0, common_1.Get)('api/sessions'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getAllWithUserData", null);
__decorate([
    (0, common_1.Get)('api/libraries/:libraryId/sessions'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('libraryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof User !== "undefined" && User) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getLibrarySessions", null);
__decorate([
    (0, common_1.Delete)('api/session/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof User !== "undefined" && User) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('api/sessions/batch/delete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof User !== "undefined" && User) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "batchDelete", null);
__decorate([
    (0, common_1.Get)('api/session/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getOpenSession", null);
__decorate([
    (0, common_1.Post)('api/session/:id/sync'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof User !== "undefined" && User) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "syncOpenSession", null);
__decorate([
    (0, common_1.Post)('api/session/:id/close'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof User !== "undefined" && User) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "closeSession", null);
exports.SessionController = SessionController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionController);
//# sourceMappingURL=session.controller.js.map