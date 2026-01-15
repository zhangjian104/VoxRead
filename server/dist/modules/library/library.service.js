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
exports.LibraryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../core/database/models");
const logger_service_1 = require("../../core/logger/logger.service");
let LibraryService = class LibraryService {
    constructor(libraryModel, libraryFolderModel, libraryItemModel, logger) {
        this.libraryModel = libraryModel;
        this.libraryFolderModel = libraryFolderModel;
        this.libraryItemModel = libraryItemModel;
        this.logger = logger;
    }
    async create(createDto) {
        this.logger.info(`[LibraryService] 创建新媒体库: ${createDto.name}`);
        const maxDisplayOrder = await this.libraryModel.getMaxDisplayOrder();
        const library = await this.libraryModel.create({
            name: createDto.name,
            displayOrder: maxDisplayOrder + 1,
            icon: createDto.icon || 'database',
            mediaType: createDto.mediaType,
            provider: createDto.provider || 'google',
            settings: createDto.settings || models_1.Library.getDefaultLibrarySettingsForMediaType(createDto.mediaType),
            extraData: {},
        });
        if (createDto.folders && createDto.folders.length > 0) {
            for (const folderPath of createDto.folders) {
                await this.libraryFolderModel.create({
                    libraryId: library.id,
                    path: folderPath,
                });
            }
        }
        return await models_1.Library.findByIdWithFolders(library.id);
    }
    async findAll() {
        return await models_1.Library.getAllWithFolders();
    }
    async findOne(id) {
        const library = await models_1.Library.findByIdWithFolders(id);
        if (!library) {
            throw new common_1.NotFoundException(`媒体库 ${id} 未找到`);
        }
        return library;
    }
    async update(id, updateDto) {
        const library = await this.findOne(id);
        if (updateDto.name !== undefined)
            library.name = updateDto.name;
        if (updateDto.icon !== undefined)
            library.icon = updateDto.icon;
        if (updateDto.provider !== undefined)
            library.provider = updateDto.provider;
        if (updateDto.settings !== undefined) {
            library.settings = { ...library.settings, ...updateDto.settings };
            library.changed('settings', true);
        }
        if (updateDto.displayOrder !== undefined)
            library.displayOrder = updateDto.displayOrder;
        await library.save();
        this.logger.info(`[LibraryService] 更新媒体库: ${library.name}`);
        return await models_1.Library.findByIdWithFolders(id);
    }
    async delete(id) {
        const library = await this.findOne(id);
        this.logger.info(`[LibraryService] 删除媒体库: ${library.name}`);
        await library.destroy();
        await models_1.Library.resetDisplayOrder(this.logger);
    }
    async reorder(libraryIds) {
        this.logger.info('[LibraryService] 重新排序媒体库');
        for (let i = 0; i < libraryIds.length; i++) {
            const library = await this.libraryModel.findByPk(libraryIds[i]);
            if (library && library.displayOrder !== i + 1) {
                library.displayOrder = i + 1;
                await library.save();
            }
        }
        return await this.findAll();
    }
    async getStats(id) {
        const library = await this.findOne(id);
        const totalItems = await this.libraryItemModel.count({
            where: { libraryId: id },
        });
        const result = await this.libraryItemModel.sum('size', {
            where: { libraryId: id },
        });
        const totalSize = result || 0;
        let totalDuration = 0;
        if (library.mediaType === 'book' || library.mediaType === 'podcast') {
        }
        return {
            totalItems,
            totalSize,
            totalDuration,
            largestItems: [],
            numAudioTracks: 0,
            totalAuthors: 0,
            totalSeries: 0,
            totalPodcasts: 0,
            totalEpisodes: 0,
        };
    }
    async getAuthors(id) {
        const library = await this.findOne(id);
        if (library.mediaType !== 'book') {
            throw new Error('只有图书库才有作者');
        }
        return [];
    }
    async getAllSeries(id) {
        const library = await this.findOne(id);
        if (library.mediaType !== 'book') {
            throw new Error('只有图书库才有系列');
        }
        return [];
    }
    async getCollections(id) {
        await this.findOne(id);
        return [];
    }
    async addFolder(id, folderPath) {
        const library = await this.findOne(id);
        const existingFolder = await this.libraryFolderModel.findOne({
            where: {
                libraryId: id,
                path: folderPath,
            },
        });
        if (existingFolder) {
            throw new Error(`文件夹 ${folderPath} 已存在于该媒体库中`);
        }
        await this.libraryFolderModel.create({
            libraryId: id,
            path: folderPath,
        });
        this.logger.info(`[LibraryService] 添加文件夹到媒体库 ${library.name}: ${folderPath}`);
        return await models_1.Library.findByIdWithFolders(id);
    }
    async removeFolder(id, folderId) {
        const library = await this.findOne(id);
        const folder = await this.libraryFolderModel.findByPk(folderId);
        if (!folder || folder.libraryId !== id) {
            throw new common_1.NotFoundException(`文件夹 ${folderId} 未找到`);
        }
        this.logger.info(`[LibraryService] 从媒体库 ${library.name} 移除文件夹: ${folder.path}`);
        await folder.destroy();
        return await models_1.Library.findByIdWithFolders(id);
    }
};
exports.LibraryService = LibraryService;
exports.LibraryService = LibraryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Library)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.LibraryFolder)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.LibraryItem)),
    __metadata("design:paramtypes", [Object, Object, Object, logger_service_1.LoggerService])
], LibraryService);
//# sourceMappingURL=library.service.js.map