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
var BookSeries_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSeries = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const book_model_1 = require("./book.model");
const series_model_1 = require("./series.model");
let BookSeries = BookSeries_1 = class BookSeries extends sequelize_typescript_1.Model {
    static async removeByIds(seriesId, bookId) {
        return BookSeries_1.destroy({
            where: {
                seriesId,
                bookId,
            },
        });
    }
};
exports.BookSeries = BookSeries;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], BookSeries.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BookSeries.prototype, "sequence", void 0);
__decorate([
    ForeignKey(() => book_model_1.Book),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], BookSeries.prototype, "bookId", void 0);
__decorate([
    ForeignKey(() => series_model_1.Series),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], BookSeries.prototype, "seriesId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => book_model_1.Book),
    __metadata("design:type", book_model_1.Book)
], BookSeries.prototype, "book", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => series_model_1.Series),
    __metadata("design:type", series_model_1.Series)
], BookSeries.prototype, "series", void 0);
exports.BookSeries = BookSeries = BookSeries_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'bookSeries',
        timestamps: true,
    })
], BookSeries);
//# sourceMappingURL=book-series.model.js.map