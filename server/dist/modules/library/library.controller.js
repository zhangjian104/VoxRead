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
exports.LibraryController = void 0;
const common_1 = require("@nestjs/common");
const library_service_1 = require("./library.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const auth_guard_2 = require("../../auth/guards/auth.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let LibraryController = class LibraryController {
    constructor(libraryService) {
        this.libraryService = libraryService;
    }
    async create(createDto) {
        const library = await this.libraryService.create(createDto);
        return library.toOldJSON();
    }
    async findAll(user) {
        const libraries = await this.libraryService.findAll();
        const accessibleLibraries = libraries.filter((lib) => {
            if (!user)
                return false;
            if (user.type === 'root' || user.type === 'admin')
                return true;
            return user.checkCanAccessLibrary(lib.id);
        });
        return {
            libraries: accessibleLibraries.map((lib) => lib.toOldJSON()),
        };
    }
    async findOne(id, user) {
        const library = await this.libraryService.findOne(id);
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        return library.toOldJSON();
    }
    async update(id, updateDto) {
        const library = await this.libraryService.update(id, updateDto);
        return library.toOldJSON();
    }
    async delete(id) {
        await this.libraryService.delete(id);
    }
    async reorder(body) {
        const libraries = await this.libraryService.reorder(body.libraries);
        return {
            libraries: libraries.map((lib) => lib.toOldJSON()),
        };
    }
    async getLibraryItems(id, limit, page, sort, filter, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        return {
            results: [],
            total: 0,
            limit: limit || 0,
            page: page || 0,
        };
    }
    async getStats(id, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        return await this.libraryService.getStats(id);
    }
    async getAuthors(id, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        const authors = await this.libraryService.getAuthors(id);
        return { authors };
    }
    async getAllSeries(id, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        const series = await this.libraryService.getAllSeries(id);
        return { series };
    }
    async getCollections(id, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        const collections = await this.libraryService.getCollections(id);
        return { collections };
    }
    async scan(id, force) {
        return {
            message: '媒体库扫描已开始',
            libraryId: id,
        };
    }
    async search(id, query, limit, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        return {
            book: [],
            podcast: [],
            series: [],
            authors: [],
            tags: [],
        };
    }
    async getFilterData(id, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        return {
            authors: [],
            genres: [],
            tags: [],
            series: [],
            narrators: [],
            languages: [],
        };
    }
    async getPersonalizedShelves(id, limit = 10, include, user) {
        if (!user.checkCanAccessLibrary(id)) {
            throw new Error('没有权限访问该媒体库');
        }
        return {
            shelves: [],
        };
    }
};
exports.LibraryController = LibraryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_2.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_2.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_2.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('order'),
    (0, common_1.UseGuards)(auth_guard_2.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "reorder", null);
__decorate([
    (0, common_1.Get)(':id/items'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('sort')),
    __param(4, (0, common_1.Query)('filter')),
    __param(5, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getLibraryItems", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id/authors'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getAuthors", null);
__decorate([
    (0, common_1.Get)(':id/series'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getAllSeries", null);
__decorate([
    (0, common_1.Get)(':id/collections'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getCollections", null);
__decorate([
    (0, common_1.Post)(':id/scan'),
    (0, common_1.UseGuards)(auth_guard_2.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "scan", null);
__decorate([
    (0, common_1.Get)(':id/search'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id/filterdata'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getFilterData", null);
__decorate([
    (0, common_1.Get)(':id/personalized'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('include')),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getPersonalizedShelves", null);
exports.LibraryController = LibraryController = __decorate([
    (0, common_1.Controller)('api/libraries'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [library_service_1.LibraryService])
], LibraryController);
//# sourceMappingURL=library.controller.js.map