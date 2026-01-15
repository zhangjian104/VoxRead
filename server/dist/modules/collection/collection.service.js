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
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const collection_model_1 = require("../../core/database/models/collection.model");
const collection_book_model_1 = require("../../core/database/models/collection-book.model");
const book_model_1 = require("../../core/database/models/book.model");
const library_item_model_1 = require("../../core/database/models/library-item.model");
const logger_service_1 = require("../../core/logger/logger.service");
const socket_gateway_1 = require("../../core/socket/socket.gateway");
const sequelize_2 = require("sequelize");
let CollectionService = class CollectionService {
    constructor(collectionModel, collectionBookModel, bookModel, libraryItemModel, logger, socketGateway) {
        this.collectionModel = collectionModel;
        this.collectionBookModel = collectionBookModel;
        this.bookModel = bookModel;
        this.libraryItemModel = libraryItemModel;
        this.logger = logger;
        this.socketGateway = socketGateway;
    }
    async loadCollectionWithBooks(collectionId) {
        return this.collectionModel.findByPk(collectionId, {
            include: [
                {
                    model: collection_book_model_1.CollectionBook,
                    as: 'collectionBooks',
                    include: [
                        {
                            model: book_model_1.Book,
                            as: 'book',
                            include: [{ model: library_item_model_1.LibraryItem, as: 'libraryItem' }],
                        },
                    ],
                },
            ],
        });
    }
    async create(libraryId, name, description, books, user) {
        if (!name?.trim()) {
            throw new common_1.BadRequestException('集合名称不能为空');
        }
        const existingCollection = await this.collectionModel.findOne({
            where: { libraryId, name },
        });
        if (existingCollection) {
            throw new common_1.BadRequestException('同名集合已存在');
        }
        const newCollection = await this.collectionModel.create({
            name: name.trim(),
            description: description?.trim() || null,
            libraryId,
            userId: user.id,
        });
        if (books && books.length > 0) {
            const collectionBooks = books.map((bookId, index) => ({
                collectionId: newCollection.id,
                bookId,
                order: index + 1,
            }));
            await this.collectionBookModel.bulkCreate(collectionBooks);
        }
        const collectionWithBooks = await this.loadCollectionWithBooks(newCollection.id);
        const jsonExpanded = collectionWithBooks?.toOldJSONExpanded() || newCollection.toOldJSON();
        this.socketGateway.emitter('collection_added', jsonExpanded);
        this.logger.info(`[CollectionService] 创建集合 "${name}"`);
        return jsonExpanded;
    }
    async findAll(user) {
        const collections = await this.collectionModel.findAll({
            where: user.permissions?.librariesAccessible?.length
                ? { libraryId: { [sequelize_2.Op.in]: user.permissions.librariesAccessible } }
                : {},
            include: [
                {
                    model: collection_book_model_1.CollectionBook,
                    as: 'collectionBooks',
                    include: [
                        {
                            model: book_model_1.Book,
                            as: 'book',
                            include: [{ model: library_item_model_1.LibraryItem, as: 'libraryItem' }],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return { collections: collections.map((c) => c.toOldJSONExpanded()) };
    }
    async findOne(collectionId, user, include) {
        const collection = await this.loadCollectionWithBooks(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        return collection.toOldJSONExpanded();
    }
    async update(collectionId, updateData, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        if (updateData.name !== undefined) {
            collection.name = updateData.name.trim();
        }
        if (updateData.description !== undefined) {
            collection.description = updateData.description?.trim() || null;
        }
        await collection.save();
        const collectionWithBooks = await this.loadCollectionWithBooks(collection.id);
        const jsonExpanded = collectionWithBooks?.toOldJSONExpanded() || collection.toOldJSON();
        this.socketGateway.emitter('collection_updated', jsonExpanded);
        this.logger.info(`[CollectionService] 更新集合 "${collection.name}"`);
        return jsonExpanded;
    }
    async remove(collectionId, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        const collectionJson = collection.toOldJSON();
        await collection.destroy();
        this.socketGateway.emitter('collection_removed', collectionJson);
        this.logger.info(`[CollectionService] 删除集合 "${collection.name}"`);
    }
    async addBook(collectionId, bookId, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        const existing = await this.collectionBookModel.findOne({
            where: { collectionId, bookId },
        });
        if (existing) {
            throw new common_1.BadRequestException('图书已在集合中');
        }
        const maxOrder = await this.collectionBookModel.max('order', {
            where: { collectionId },
        });
        await this.collectionBookModel.create({
            collectionId,
            bookId,
            order: (maxOrder || 0) + 1,
        });
        const collectionWithBooks = await this.loadCollectionWithBooks(collection.id);
        const jsonExpanded = collectionWithBooks?.toOldJSONExpanded() || collection.toOldJSON();
        this.socketGateway.emitter('collection_updated', jsonExpanded);
        this.logger.info(`[CollectionService] 添加图书到集合 "${collection.name}"`);
        return jsonExpanded;
    }
    async removeBook(collectionId, bookId, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        const collectionBook = await this.collectionBookModel.findOne({
            where: { collectionId, bookId },
        });
        if (!collectionBook) {
            throw new common_1.NotFoundException('图书不在集合中');
        }
        await collectionBook.destroy();
        const remainingBooks = await this.collectionBookModel.findAll({
            where: { collectionId },
            order: [['order', 'ASC']],
        });
        for (let i = 0; i < remainingBooks.length; i++) {
            if (remainingBooks[i].order !== i + 1) {
                remainingBooks[i].order = i + 1;
                await remainingBooks[i].save();
            }
        }
        const collectionWithBooks = await this.loadCollectionWithBooks(collection.id);
        const jsonExpanded = collectionWithBooks?.toOldJSONExpanded() || collection.toOldJSON();
        this.socketGateway.emitter('collection_updated', jsonExpanded);
        this.logger.info(`[CollectionService] 从集合 "${collection.name}" 移除图书`);
        return jsonExpanded;
    }
    async batchAdd(collectionId, bookIds, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        const existingBooks = await this.collectionBookModel.findAll({
            where: { collectionId },
            attributes: ['bookId'],
        });
        const existingBookIds = new Set(existingBooks.map((cb) => cb.bookId));
        const newBookIds = bookIds.filter((id) => !existingBookIds.has(id));
        if (newBookIds.length === 0) {
            throw new common_1.BadRequestException('所有图书已在集合中');
        }
        const maxOrder = await this.collectionBookModel.max('order', {
            where: { collectionId },
        });
        const collectionBooks = newBookIds.map((bookId, index) => ({
            collectionId,
            bookId,
            order: (maxOrder || 0) + index + 1,
        }));
        await this.collectionBookModel.bulkCreate(collectionBooks);
        const collectionWithBooks = await this.loadCollectionWithBooks(collection.id);
        const jsonExpanded = collectionWithBooks?.toOldJSONExpanded() || collection.toOldJSON();
        this.socketGateway.emitter('collection_updated', jsonExpanded);
        this.logger.info(`[CollectionService] 批量添加 ${newBookIds.length} 本图书到集合 "${collection.name}"`);
        return jsonExpanded;
    }
    async batchRemove(collectionId, bookIds, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        await this.collectionBookModel.destroy({
            where: {
                collectionId,
                bookId: { [sequelize_2.Op.in]: bookIds },
            },
        });
        const remainingBooks = await this.collectionBookModel.findAll({
            where: { collectionId },
            order: [['order', 'ASC']],
        });
        for (let i = 0; i < remainingBooks.length; i++) {
            if (remainingBooks[i].order !== i + 1) {
                remainingBooks[i].order = i + 1;
                await remainingBooks[i].save();
            }
        }
        const collectionWithBooks = await this.loadCollectionWithBooks(collection.id);
        const jsonExpanded = collectionWithBooks?.toOldJSONExpanded() || collection.toOldJSON();
        this.socketGateway.emitter('collection_updated', jsonExpanded);
        this.logger.info(`[CollectionService] 批量移除 ${bookIds.length} 本图书从集合 "${collection.name}"`);
        return jsonExpanded;
    }
    async reorder(collectionId, orderedBookIds, user) {
        const collection = await this.collectionModel.findByPk(collectionId);
        if (!collection) {
            throw new common_1.NotFoundException('集合未找到');
        }
        const transaction = await this.collectionModel.sequelize.transaction();
        try {
            for (let i = 0; i < orderedBookIds.length; i++) {
                await this.collectionBookModel.update({ order: i + 1 }, {
                    where: {
                        collectionId,
                        bookId: orderedBookIds[i],
                    },
                    transaction,
                });
            }
            await transaction.commit();
            const collectionWithBooks = await this.loadCollectionWithBooks(collection.id);
            const jsonExpanded = collectionWithBooks?.toOldJSONExpanded() || collection.toOldJSON();
            this.socketGateway.emitter('collection_updated', jsonExpanded);
            this.logger.info(`[CollectionService] 重新排序集合 "${collection.name}"`);
            return jsonExpanded;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('[CollectionService] 重新排序失败:', error);
            throw new common_1.BadRequestException('重新排序失败');
        }
    }
};
exports.CollectionService = CollectionService;
exports.CollectionService = CollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(collection_model_1.Collection)),
    __param(1, (0, sequelize_1.InjectModel)(collection_book_model_1.CollectionBook)),
    __param(2, (0, sequelize_1.InjectModel)(book_model_1.Book)),
    __param(3, (0, sequelize_1.InjectModel)(library_item_model_1.LibraryItem)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, logger_service_1.LoggerService,
        socket_gateway_1.SocketGateway])
], CollectionService);
//# sourceMappingURL=collection.service.js.map