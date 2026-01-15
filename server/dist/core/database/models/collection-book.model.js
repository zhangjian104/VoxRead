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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionBook = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const collection_model_1 = require("./collection.model");
const book_model_1 = require("./book.model");
let CollectionBook = class CollectionBook extends sequelize_typescript_1.Model {
};
exports.CollectionBook = CollectionBook;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], CollectionBook.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], CollectionBook.prototype, "order", void 0);
__decorate([
    ForeignKey(() => book_model_1.Book),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], CollectionBook.prototype, "bookId", void 0);
__decorate([
    ForeignKey(() => collection_model_1.Collection),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], CollectionBook.prototype, "collectionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => book_model_1.Book, { onDelete: 'CASCADE' }),
    __metadata("design:type", book_model_1.Book)
], CollectionBook.prototype, "book", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => collection_model_1.Collection, { onDelete: 'CASCADE' }),
    __metadata("design:type", collection_model_1.Collection)
], CollectionBook.prototype, "collection", void 0);
exports.CollectionBook = CollectionBook = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'collectionBooks',
        timestamps: true,
        updatedAt: false,
    })
], CollectionBook);
//# sourceMappingURL=collection-book.model.js.map