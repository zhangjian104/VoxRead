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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const collection_service_1 = require("./collection.service");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let CollectionController = class CollectionController {
    constructor(collectionService) {
        this.collectionService = collectionService;
    }
    async create(createDto, user) {
        return this.collectionService.create(createDto, user);
    }
    async findAll(user) {
        return this.collectionService.findAll(user);
    }
    async findOne(id, user, include) {
        const includes = include ? include.split(',') : [];
        return this.collectionService.findOne(id, user, includes);
    }
    async update(id, updateDto) {
        return this.collectionService.update(id, updateDto);
    }
    async delete(id) {
        await this.collectionService.delete(id);
        return { success: true };
    }
    async addBook(id, body) {
        return this.collectionService.addBook(id, body.id);
    }
    async removeBook(id, bookId) {
        return this.collectionService.removeBook(id, bookId);
    }
    async addBatch(id, body) {
        return this.collectionService.addBatch(id, body.books);
    }
    async removeBatch(id, body) {
        return this.collectionService.removeBatch(id, body.books);
    }
};
exports.CollectionController = CollectionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof User !== "undefined" && User) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('include')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof User !== "undefined" && User) === "function" ? _c : Object, String]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/book'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "addBook", null);
__decorate([
    (0, common_1.Delete)(':id/book/:bookId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "removeBook", null);
__decorate([
    (0, common_1.Post)(':id/batch/add'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "addBatch", null);
__decorate([
    (0, common_1.Post)(':id/batch/remove'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "removeBatch", null);
exports.CollectionController = CollectionController = __decorate([
    (0, common_1.Controller)('api/collections'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [collection_service_1.CollectionService])
], CollectionController);
//# sourceMappingURL=collection.controller.js.map