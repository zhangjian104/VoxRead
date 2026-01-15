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
var Collection_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const library_model_1 = require("./library.model");
const book_model_1 = require("./book.model");
const collection_book_model_1 = require("./collection-book.model");
let Collection = Collection_1 = class Collection extends sequelize_typescript_1.Model {
    static async getExpandedById(collectionId) {
        return Collection_1.findByPk(collectionId, {
            include: [
                {
                    model: book_model_1.Book,
                    include: [],
                },
            ],
        });
    }
    static async removeAllForLibrary(libraryId) {
        if (!libraryId)
            return 0;
        return Collection_1.destroy({
            where: { libraryId },
        });
    }
    toOldJSON(libraryItemIds = []) {
        return {
            id: this.id,
            libraryId: this.libraryId,
            name: this.name,
            description: this.description,
            books: [...libraryItemIds],
            lastUpdate: this.updatedAt.valueOf(),
            createdAt: this.createdAt.valueOf(),
        };
    }
    toOldJSONExpanded() {
        if (!this.books) {
            throw new Error('Books are required to expand Collection');
        }
        const json = this.toOldJSON();
        json.books = this.books.map((book) => {
            const libraryItem = book.libraryItem;
            delete book.libraryItem;
            libraryItem.media = book;
            return libraryItem.toOldJSONExpanded();
        });
        return json;
    }
};
exports.Collection = Collection;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Collection.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Collection.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Collection.prototype, "description", void 0);
__decorate([
    ForeignKey(() => library_model_1.Library),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Collection.prototype, "libraryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_model_1.Library),
    __metadata("design:type", library_model_1.Library)
], Collection.prototype, "library", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => book_model_1.Book, () => collection_book_model_1.CollectionBook),
    __metadata("design:type", Array)
], Collection.prototype, "books", void 0);
exports.Collection = Collection = Collection_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'collections',
        timestamps: true,
    })
], Collection);
//# sourceMappingURL=collection.model.js.map