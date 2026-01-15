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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async findBooks(provider, title, author, id) {
        return this.searchService.findBooks(provider || 'google', title || '', author || '', id);
    }
    async findCovers(provider, title, author, podcast) {
        const isPodcast = podcast === '1' || podcast === 'true';
        return this.searchService.findCovers(provider || 'google', title || '', author, isPodcast);
    }
    async findPodcasts(term, country) {
        return this.searchService.findPodcasts(term || '', country || 'us');
    }
    async findAuthor(query) {
        return this.searchService.findAuthor(query || '');
    }
    async findChapters(asin, region) {
        return this.searchService.findChapters(asin || '', region || 'us');
    }
    async getAllProviders() {
        return this.searchService.getAllProviders();
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)('books'),
    __param(0, (0, common_1.Query)('provider')),
    __param(1, (0, common_1.Query)('title')),
    __param(2, (0, common_1.Query)('author')),
    __param(3, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "findBooks", null);
__decorate([
    (0, common_1.Get)('covers'),
    __param(0, (0, common_1.Query)('provider')),
    __param(1, (0, common_1.Query)('title')),
    __param(2, (0, common_1.Query)('author')),
    __param(3, (0, common_1.Query)('podcast')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "findCovers", null);
__decorate([
    (0, common_1.Get)('podcasts'),
    __param(0, (0, common_1.Query)('term')),
    __param(1, (0, common_1.Query)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "findPodcasts", null);
__decorate([
    (0, common_1.Get)('authors'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "findAuthor", null);
__decorate([
    (0, common_1.Get)('chapters'),
    __param(0, (0, common_1.Query)('asin')),
    __param(1, (0, common_1.Query)('region')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "findChapters", null);
__decorate([
    (0, common_1.Get)('providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getAllProviders", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('api/search'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map