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
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../core/database/models");
const logger_service_1 = require("../../core/logger/logger.service");
let BookService = class BookService {
    constructor(bookModel, authorModel, seriesModel, bookAuthorModel, bookSeriesModel, logger) {
        this.bookModel = bookModel;
        this.authorModel = authorModel;
        this.seriesModel = seriesModel;
        this.bookAuthorModel = bookAuthorModel;
        this.bookSeriesModel = bookSeriesModel;
        this.logger = logger;
    }
    async findOne(id) {
        const book = await this.bookModel.findByPk(id, {
            include: [
                {
                    model: models_1.Author,
                    through: { attributes: [] },
                },
                {
                    model: models_1.Series,
                    through: { attributes: ['id', 'sequence'] },
                },
            ],
        });
        if (!book) {
            throw new common_1.NotFoundException(`图书 ${id} 未找到`);
        }
        return book;
    }
    async updateAuthors(bookId, authorNames, libraryId) {
        const book = await this.findOne(bookId);
        if (!book.authors) {
            throw new Error('图书作者信息未加载');
        }
        this.logger.info(`[BookService] 更新图书 ${bookId} 的作者`);
        const authorNamesCleaned = authorNames.map((name) => name.toLowerCase()).filter((name) => name);
        const authorsToRemove = book.authors.filter((author) => !authorNamesCleaned.includes(author.name.toLowerCase()));
        const newAuthorNames = authorNames.filter((name) => !book.authors.some((author) => author.name.toLowerCase() === name.toLowerCase()));
        for (const author of authorsToRemove) {
            await this.bookAuthorModel.removeByIds(author.id, bookId);
            this.logger.debug(`[BookService] 移除作者: ${author.name}`);
        }
        for (const authorName of newAuthorNames) {
            const author = await this.authorModel.findOrCreateByNameAndLibrary(authorName, libraryId);
            await this.bookAuthorModel.create({
                bookId,
                authorId: author.id,
            });
            this.logger.debug(`[BookService] 添加作者: ${author.name}`);
        }
    }
    async updateSeries(bookId, seriesObjects, libraryId) {
        const book = await this.findOne(bookId);
        if (!book.series) {
            throw new Error('图书系列信息未加载');
        }
        this.logger.info(`[BookService] 更新图书 ${bookId} 的系列`);
        const seriesNamesCleaned = seriesObjects.map((se) => se.name.toLowerCase());
        const seriesToRemove = book.series.filter((se) => !seriesNamesCleaned.includes(se.name.toLowerCase()));
        for (const series of seriesToRemove) {
            await this.bookSeriesModel.removeByIds(series.id, bookId);
            this.logger.debug(`[BookService] 移除系列: ${series.name}`);
        }
        for (const seriesObj of seriesObjects) {
            const seriesObjSequence = typeof seriesObj.sequence === 'string' ? seriesObj.sequence : null;
            const existingSeries = book.series.find((se) => se.name.toLowerCase() === seriesObj.name.toLowerCase());
            if (existingSeries) {
                if (existingSeries.bookSeries && existingSeries.bookSeries.sequence !== seriesObjSequence) {
                    existingSeries.bookSeries.sequence = seriesObjSequence;
                    await existingSeries.bookSeries.save();
                    this.logger.debug(`[BookService] 更新系列序列号: ${existingSeries.name} = ${seriesObjSequence}`);
                }
            }
            else {
                const series = await this.seriesModel.findOrCreateByNameAndLibrary(seriesObj.name, libraryId);
                await this.bookSeriesModel.create({
                    bookId,
                    seriesId: series.id,
                    sequence: seriesObjSequence,
                });
                this.logger.debug(`[BookService] 添加系列: ${series.name}`);
            }
        }
    }
    getTracklist(bookId, libraryItemId) {
        return [];
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Book)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Author)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.Series)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.BookAuthor)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.BookSeries)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, logger_service_1.LoggerService])
], BookService);
//# sourceMappingURL=book.service.js.map