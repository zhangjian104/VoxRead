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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const library_item_model_1 = require("../../core/database/models/library-item.model");
const logger_service_1 = require("../../core/logger/logger.service");
let SearchService = class SearchService {
    constructor(libraryItemModel, logger) {
        this.libraryItemModel = libraryItemModel;
        this.logger = logger;
    }
    async fetchLibraryItem(id) {
        const libraryItem = await this.libraryItemModel.getExpandedById(id);
        if (!libraryItem) {
            throw new common_1.NotFoundException(`媒体项 "${id}" 未找到`);
        }
        return libraryItem;
    }
    async findBooks(provider, title, author, libraryItemId) {
        this.logger.info(`[SearchService] 搜索图书: provider=${provider}, title=${title}, author=${author}`);
        const libraryItem = libraryItemId ? await this.fetchLibraryItem(libraryItemId) : null;
        return {
            results: [],
            provider,
        };
    }
    async findCovers(provider, title, author, podcast) {
        this.logger.info(`[SearchService] 搜索封面: provider=${provider}, title=${title}, podcast=${podcast}`);
        return {
            results: [],
        };
    }
    async findPodcasts(term, country = 'us') {
        this.logger.info(`[SearchService] 搜索播客: term=${term}, country=${country}`);
        return {
            results: [],
        };
    }
    async findAuthor(query) {
        this.logger.info(`[SearchService] 搜索作者: query=${query}`);
        return {
            author: null,
        };
    }
    async findChapters(asin, region = 'us') {
        this.logger.info(`[SearchService] 搜索章节: asin=${asin}, region=${region}`);
        if (!this.isValidASIN(asin.toUpperCase())) {
            throw new common_1.BadRequestException('无效的 ASIN');
        }
        return {
            chapters: [],
        };
    }
    async getAllProviders() {
        const providerMap = {
            all: 'All',
            best: 'Best',
            google: 'Google Books',
            itunes: 'iTunes',
            openlibrary: 'Open Library',
            fantlab: 'FantLab.ru',
            audiobookcovers: 'AudiobookCovers.com',
            audible: 'Audible.com',
            'audible.ca': 'Audible.ca',
            'audible.uk': 'Audible.co.uk',
            'audible.au': 'Audible.com.au',
            'audible.fr': 'Audible.fr',
            'audible.de': 'Audible.de',
            'audible.jp': 'Audible.co.jp',
            'audible.it': 'Audible.it',
            'audible.in': 'Audible.in',
            'audible.es': 'Audible.es',
            audnexus: 'Audnexus',
        };
        const formatProvider = (value) => ({
            value,
            text: providerMap[value] || value,
        });
        const bookProviders = ['google', 'openlibrary', 'itunes', 'audible', 'fantlab', 'audnexus'];
        return {
            providers: {
                books: bookProviders.map(formatProvider),
                booksCovers: [formatProvider('best'), ...bookProviders.map(formatProvider), formatProvider('audiobookcovers'), formatProvider('all')],
                podcasts: [formatProvider('itunes')],
            },
        };
    }
    async searchLibrary(libraryId, query, limit = 12) {
        this.logger.info(`[SearchService] 媒体库内搜索: libraryId=${libraryId}, query=${query}, limit=${limit}`);
        return {
            book: [],
            tags: [],
            series: [],
            authors: [],
            narrators: [],
            podcast: [],
        };
    }
    isValidASIN(asin) {
        return /^[A-Z0-9]{10}$/.test(asin);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(library_item_model_1.LibraryItem)),
    __metadata("design:paramtypes", [Object, logger_service_1.LoggerService])
], SearchService);
//# sourceMappingURL=search.service.js.map