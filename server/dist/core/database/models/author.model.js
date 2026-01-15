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
var Author_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const library_model_1 = require("./library.model");
const book_model_1 = require("./book.model");
const book_author_model_1 = require("./book-author.model");
let Author = Author_1 = class Author extends sequelize_typescript_1.Model {
    static getLastFirst(name) {
        if (!name)
            return null;
        const parts = name.split(' ');
        if (parts.length > 1) {
            return `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(' ')}`;
        }
        return name;
    }
    static async checkExistsById(authorId) {
        const count = await Author_1.count({ where: { id: authorId } });
        return count > 0;
    }
    static async getByNameAndLibrary(authorName, libraryId) {
        return Author_1.findOne({
            where: {
                [sequelize_1.Op.and]: [(0, sequelize_1.where)((0, sequelize_1.fn)('lower', (0, sequelize_1.col)('name')), authorName.toLowerCase()), { libraryId }],
            },
        });
    }
    static async findOrCreateByNameAndLibrary(name, libraryId) {
        const author = await Author_1.getByNameAndLibrary(name, libraryId);
        if (author)
            return author;
        return Author_1.create({
            name,
            lastFirst: Author_1.getLastFirst(name),
            libraryId,
        });
    }
    static async getAllLibraryItemsForAuthor(authorId) {
        const author = await Author_1.findByPk(authorId, {
            include: [
                {
                    model: book_model_1.Book,
                    include: [
                        {
                            model: Author_1,
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        });
        if (!author || !author.books) {
            return [];
        }
        return [];
    }
    toOldJSON() {
        return {
            id: this.id,
            asin: this.asin,
            name: this.name,
            description: this.description,
            imagePath: this.imagePath,
            libraryId: this.libraryId,
            addedAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
        };
    }
    toOldJSONExpanded(numBooks = 0) {
        const oldJson = this.toOldJSON();
        oldJson.numBooks = numBooks;
        return oldJson;
    }
    toJSONMinimal() {
        return {
            id: this.id,
            name: this.name,
        };
    }
};
exports.Author = Author;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Author.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Author.prototype, "lastFirst", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Author.prototype, "asin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Author.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Author.prototype, "imagePath", void 0);
__decorate([
    ForeignKey(() => library_model_1.Library),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Author.prototype, "libraryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_model_1.Library, { onDelete: 'CASCADE' }),
    __metadata("design:type", library_model_1.Library)
], Author.prototype, "library", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => book_model_1.Book, () => book_author_model_1.BookAuthor),
    __metadata("design:type", Array)
], Author.prototype, "books", void 0);
exports.Author = Author = Author_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'authors',
        timestamps: true,
        indexes: [
            {
                fields: [{ name: 'name', collate: 'NOCASE' }],
            },
            {
                fields: ['libraryId'],
            },
        ],
    })
], Author);
//# sourceMappingURL=author.model.js.map