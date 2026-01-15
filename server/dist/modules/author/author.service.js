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
exports.AuthorService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../core/database/models");
const logger_service_1 = require("../../core/logger/logger.service");
let AuthorService = class AuthorService {
    constructor(authorModel, logger) {
        this.authorModel = authorModel;
        this.logger = logger;
    }
    async findOne(id) {
        const author = await this.authorModel.findByPk(id, {
            include: [
                {
                    model: models_1.Book,
                    through: { attributes: [] },
                },
            ],
        });
        if (!author) {
            throw new common_1.NotFoundException(`作者 ${id} 未找到`);
        }
        return author;
    }
    async findAllByLibrary(libraryId) {
        return await this.authorModel.findAll({
            where: { libraryId },
            order: [['name', 'ASC']],
        });
    }
    async update(id, updateData) {
        const author = await this.findOne(id);
        this.logger.info(`[AuthorService] 更新作者: ${author.name}`);
        Object.assign(author, updateData);
        await author.save();
        return author;
    }
    async merge(fromAuthorId, toAuthorId) {
        const fromAuthor = await this.findOne(fromAuthorId);
        const toAuthor = await this.findOne(toAuthorId);
        this.logger.info(`[AuthorService] 合并作者: ${fromAuthor.name} -> ${toAuthor.name}`);
        await fromAuthor.destroy();
        return toAuthor;
    }
    async exists(id) {
        return await models_1.Author.checkExistsById(id);
    }
};
exports.AuthorService = AuthorService;
exports.AuthorService = AuthorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Author)),
    __metadata("design:paramtypes", [Object, logger_service_1.LoggerService])
], AuthorService);
//# sourceMappingURL=author.service.js.map