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
exports.LibraryFolder = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const library_model_1 = require("./library.model");
let LibraryFolder = class LibraryFolder extends sequelize_typescript_1.Model {
    toOldJSON() {
        return {
            id: this.id,
            fullPath: this.path,
            libraryId: this.libraryId,
            addedAt: this.createdAt.valueOf(),
        };
    }
};
exports.LibraryFolder = LibraryFolder;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], LibraryFolder.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryFolder.prototype, "path", void 0);
__decorate([
    ForeignKey(() => library_model_1.Library),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], LibraryFolder.prototype, "libraryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_model_1.Library, { onDelete: 'CASCADE' }),
    __metadata("design:type", library_model_1.Library)
], LibraryFolder.prototype, "library", void 0);
exports.LibraryFolder = LibraryFolder = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'libraryFolders',
        timestamps: true,
    })
], LibraryFolder);
//# sourceMappingURL=library-folder.model.js.map