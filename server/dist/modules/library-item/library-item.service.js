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
exports.LibraryItemService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../core/database/models");
const logger_service_1 = require("../../core/logger/logger.service");
const sequelize_2 = require("sequelize");
let LibraryItemService = class LibraryItemService {
    constructor(libraryItemModel, bookModel, podcastModel, libraryModel, logger) {
        this.libraryItemModel = libraryItemModel;
        this.bookModel = bookModel;
        this.podcastModel = podcastModel;
        this.libraryModel = libraryModel;
        this.logger = logger;
    }
    async findOne(id) {
        const libraryItem = await models_1.LibraryItem.getExpandedById(id);
        if (!libraryItem) {
            throw new common_1.NotFoundException(`媒体项 ${id} 未找到`);
        }
        return libraryItem;
    }
    async delete(id) {
        const libraryItem = await this.findOne(id);
        this.logger.info(`[LibraryItemService] 删除媒体项: ${libraryItem.id}`);
        await models_1.LibraryItem.removeById(id);
    }
    async batchDelete(ids) {
        this.logger.info(`[LibraryItemService] 批量删除 ${ids.length} 个媒体项`);
        let deletedCount = 0;
        for (const id of ids) {
            try {
                await this.delete(id);
                deletedCount++;
            }
            catch (error) {
                this.logger.error(`[LibraryItemService] 删除媒体项 ${id} 失败:`, error);
            }
        }
        return deletedCount;
    }
    async batchGet(ids) {
        const libraryItems = await this.libraryItemModel.findAll({
            where: {
                id: {
                    [sequelize_2.Op.in]: ids,
                },
            },
        });
        for (const item of libraryItems) {
            item.media = await item.getMedia();
        }
        return libraryItems;
    }
    async updateMedia(id, updateDto) {
        const libraryItem = await this.findOne(id);
        const media = libraryItem.media;
        if (!media) {
            throw new common_1.BadRequestException('媒体数据未找到');
        }
        this.logger.info(`[LibraryItemService] 更新媒体项 ${id} 的媒体数据`);
        if (libraryItem.isBook) {
            await this.updateBookMedia(media, updateDto);
        }
        else if (libraryItem.isPodcast) {
            await this.updatePodcastMedia(media, updateDto);
        }
        return await this.findOne(id);
    }
    async updateBookMedia(book, updateDto) {
        const metadata = updateDto.metadata;
        if (!metadata)
            return;
        if (metadata.title !== undefined)
            book.title = metadata.title;
        if (metadata.subtitle !== undefined)
            book.subtitle = metadata.subtitle;
        if (metadata.description !== undefined)
            book.description = metadata.description;
        if (metadata.publishedYear !== undefined)
            book.publishedYear = metadata.publishedYear;
        if (metadata.publishedDate !== undefined)
            book.publishedDate = metadata.publishedDate;
        if (metadata.publisher !== undefined)
            book.publisher = metadata.publisher;
        if (metadata.isbn !== undefined)
            book.isbn = metadata.isbn;
        if (metadata.asin !== undefined)
            book.asin = metadata.asin;
        if (metadata.language !== undefined)
            book.language = metadata.language;
        if (metadata.explicit !== undefined)
            book.explicit = metadata.explicit;
        if (metadata.abridged !== undefined)
            book.abridged = metadata.abridged;
        if (metadata.narrators !== undefined) {
            book.narrators = metadata.narrators;
            book.changed('narrators', true);
        }
        if (metadata.genres !== undefined) {
            book.genres = metadata.genres;
            book.changed('genres', true);
        }
        if (updateDto.tags !== undefined) {
            book.tags = updateDto.tags;
            book.changed('tags', true);
        }
        if (updateDto.coverPath !== undefined) {
            book.coverPath = updateDto.coverPath;
        }
        if (metadata.title) {
            book.titleIgnorePrefix = models_1.Book.getTitleIgnorePrefix(metadata.title);
        }
        await book.save();
        if (metadata.authors !== undefined && book.authors !== undefined) {
        }
        if (metadata.series !== undefined && book.series !== undefined) {
        }
    }
    async updatePodcastMedia(podcast, updateDto) {
        const metadata = updateDto.metadata;
        if (!metadata)
            return;
        if (metadata.title !== undefined)
            podcast.title = metadata.title;
        if (metadata.description !== undefined)
            podcast.description = metadata.description;
        if (metadata.language !== undefined)
            podcast.language = metadata.language;
        if (metadata.explicit !== undefined)
            podcast.explicit = metadata.explicit;
        if (metadata.genres !== undefined) {
            podcast.genres = metadata.genres;
            podcast.changed('genres', true);
        }
        if (updateDto.tags !== undefined) {
            podcast.tags = updateDto.tags;
            podcast.changed('tags', true);
        }
        if (updateDto.coverPath !== undefined) {
            podcast.coverPath = updateDto.coverPath;
        }
        if (metadata.title) {
            podcast.titleIgnorePrefix = models_1.Podcast.getTitleIgnorePrefix(metadata.title);
        }
        await podcast.save();
    }
    async getCoverPath(id) {
        return await models_1.LibraryItem.getCoverPath(id);
    }
    async getLibraryItems(libraryId, options = {}) {
        const { limit = 50, page = 0, sort = 'media.title', search } = options;
        const offset = page * limit;
        const where = { libraryId };
        if (search) {
            where.title = {
                [sequelize_2.Op.like]: `%${search}%`,
            };
        }
        const { rows, count } = await this.libraryItemModel.findAndCountAll({
            where,
            limit,
            offset,
            order: [[sort, 'ASC']],
        });
        for (const item of rows) {
            item.media = await item.getMedia();
        }
        return {
            items: rows,
            total: count,
        };
    }
    async exists(id) {
        return await models_1.LibraryItem.checkExistsById(id);
    }
    async scan(id) {
        const libraryItem = await this.findOne(id);
        this.logger.info(`[LibraryItemService] 扫描媒体项: ${libraryItem.id}`);
        return libraryItem;
    }
    async batchScan(ids) {
        this.logger.info(`[LibraryItemService] 批量扫描 ${ids.length} 个媒体项`);
        for (const id of ids) {
            try {
                await this.scan(id);
            }
            catch (error) {
                this.logger.error(`[LibraryItemService] 扫描媒体项 ${id} 失败:`, error);
            }
        }
    }
};
exports.LibraryItemService = LibraryItemService;
exports.LibraryItemService = LibraryItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.LibraryItem)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Book)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.Podcast)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.Library)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, logger_service_1.LoggerService])
], LibraryItemService);
//# sourceMappingURL=library-item.service.js.map