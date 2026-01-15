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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const user_service_1 = require("./user.service");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const auth_service_1 = require("../../auth/auth.service");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async findAll(user, include) {
        const includes = include ? include.split(',').map((i) => i.trim()) : [];
        return this.userService.findAll(user, includes);
    }
    async getOnlineUsers(user) {
        return this.userService.getOnlineUsers();
    }
    async findOne(id, user) {
        return this.userService.findOne(id, user);
    }
    async create(createUserDto, user) {
        return this.userService.create(createUserDto, user, this.authService.hashPassword.bind(this.authService), this.authService.generateAccessToken.bind(this.authService));
    }
    async update(id, updateUserDto, user, req, res) {
        const result = await this.userService.update(id, updateUserDto, user, this.authService.hashPassword.bind(this.authService), this.authService.generateAccessToken.bind(this.authService), this.authService.invalidateJwtSessionsForUser.bind(this.authService), req, res);
        return res.json(result);
    }
    async delete(id, user) {
        await this.userService.delete(id, user);
        return { success: true };
    }
    async unlinkFromOpenID(id, user) {
        await this.userService.unlinkFromOpenID(id, user);
        return { success: true };
    }
    async getListeningSessions(id, page, itemsPerPage) {
        const pageNum = page || 0;
        const itemsNum = itemsPerPage || 10;
        return this.userService.getListeningSessions(id, pageNum, itemsNum);
    }
    async getListeningStats(id) {
        return this.userService.getListeningStats(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('include')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('online'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof User !== "undefined" && User) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOnlineUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof User !== "undefined" && User) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof User !== "undefined" && User) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof User !== "undefined" && User) === "function" ? _e : Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof User !== "undefined" && User) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/openid-unlink'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof User !== "undefined" && User) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unlinkFromOpenID", null);
__decorate([
    (0, common_1.Get)(':id/listening-sessions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('itemsPerPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getListeningSessions", null);
__decorate([
    (0, common_1.Get)(':id/listening-stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getListeningStats", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api/users'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=user.controller.js.map