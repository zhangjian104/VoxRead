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
var Series_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Series = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const library_model_1 = require("./library.model");
const book_model_1 = require("./book.model");
const book_series_model_1 = require("./book-series.model");
let Series = Series_1 = class Series extends sequelize_typescript_1.Model {
    static getTitlePrefixAtEnd(title) {
        if (!title)
            return '';
        const prefixes = ['the', 'a', 'an'];
        const words = title.split(' ');
        if (words.length > 1 && prefixes.includes(words[0].toLowerCase())) {
            return `${words.slice(1).join(' ')}, ${words[0]}`;
        }
        return title;
    }
    static getTitleIgnorePrefix(title) {
        if (!title)
            return '';
        const prefixes = ['the ', 'a ', 'an '];
        const lowerTitle = title.toLowerCase();
        for (const prefix of prefixes) {
            if (lowerTitle.startsWith(prefix)) {
                return title.substring(prefix.length);
            }
        }
        return title;
    }
    static async checkExistsById(seriesId) {
        const count = await Series_1.count({ where: { id: seriesId } });
        return count > 0;
    }
    static async getByNameAndLibrary(seriesName, libraryId) {
        return Series_1.findOne({
            where: {
                [sequelize_1.Op.and]: [(0, sequelize_1.where)((0, sequelize_1.fn)('lower', (0, sequelize_1.col)('name')), seriesName.toLowerCase()), { libraryId }],
            },
        });
    }
    static async getExpandedById(seriesId) {
        const series = await Series_1.findByPk(seriesId);
        if (!series)
            return null;
        return series;
    }
    static async findOrCreateByNameAndLibrary(seriesName, libraryId) {
        const series = await Series_1.getByNameAndLibrary(seriesName, libraryId);
        if (series)
            return series;
        return Series_1.create({
            name: seriesName,
            nameIgnorePrefix: Series_1.getTitleIgnorePrefix(seriesName),
            libraryId,
        });
    }
    toOldJSON() {
        return {
            id: this.id,
            name: this.name,
            nameIgnorePrefix: Series_1.getTitlePrefixAtEnd(this.name),
            description: this.description,
            addedAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
            libraryId: this.libraryId,
        };
    }
    toJSONMinimal(sequence) {
        return {
            id: this.id,
            name: this.name,
            sequence,
        };
    }
};
exports.Series = Series;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Series.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Series.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Series.prototype, "nameIgnorePrefix", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Series.prototype, "description", void 0);
__decorate([
    ForeignKey(() => library_model_1.Library),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Series.prototype, "libraryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_model_1.Library, { onDelete: 'CASCADE' }),
    __metadata("design:type", library_model_1.Library)
], Series.prototype, "library", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => book_model_1.Book, () => book_series_model_1.BookSeries),
    __metadata("design:type", Array)
], Series.prototype, "books", void 0);
exports.Series = Series = Series_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'series',
        timestamps: true,
        indexes: [
            {
                fields: [{ name: 'name', collate: 'NOCASE' }],
            },
            {
                fields: ['name', 'libraryId'],
                unique: true,
                name: 'unique_series_name_per_library',
            },
            {
                fields: ['libraryId'],
            },
        ],
    })
], Series);
//# sourceMappingURL=series.model.js.map