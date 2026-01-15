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
var Library_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const library_folder_model_1 = require("./library-folder.model");
const library_item_model_1 = require("./library-item.model");
const author_model_1 = require("./author.model");
const series_model_1 = require("./series.model");
let Library = Library_1 = class Library extends sequelize_typescript_1.Model {
    static get defaultMetadataPrecedence() {
        return ['folderStructure', 'audioMetatags', 'nfoFile', 'txtFiles', 'opfFile', 'absMetadata'];
    }
    static getDefaultLibrarySettingsForMediaType(mediaType) {
        if (mediaType === 'podcast') {
            return {
                coverAspectRatio: 1,
                disableWatcher: false,
                autoScanCronExpression: null,
                podcastSearchRegion: 'us',
                markAsFinishedPercentComplete: null,
                markAsFinishedTimeRemaining: 10,
            };
        }
        else {
            return {
                coverAspectRatio: 1,
                disableWatcher: false,
                autoScanCronExpression: null,
                skipMatchingMediaWithAsin: false,
                skipMatchingMediaWithIsbn: false,
                audiobooksOnly: false,
                epubsAllowScriptedContent: false,
                hideSingleBookSeries: false,
                onlyShowLaterBooksInContinueSeries: false,
                metadataPrecedence: Library_1.defaultMetadataPrecedence,
                markAsFinishedPercentComplete: null,
                markAsFinishedTimeRemaining: 10,
            };
        }
    }
    static async getAllWithFolders() {
        return Library_1.findAll({
            include: [library_folder_model_1.LibraryFolder],
            order: [['displayOrder', 'ASC']],
        });
    }
    static async findByIdWithFolders(libraryId) {
        return Library_1.findByPk(libraryId, {
            include: [library_folder_model_1.LibraryFolder],
        });
    }
    static async getAllLibraryIds() {
        const libraries = await Library_1.findAll({
            attributes: ['id', 'displayOrder'],
            order: [['displayOrder', 'ASC']],
        });
        return libraries.map((l) => l.id);
    }
    static async getMaxDisplayOrder() {
        const result = await Library_1.max('displayOrder');
        return result || 0;
    }
    static async resetDisplayOrder(logger) {
        const libraries = await Library_1.findAll({
            order: [['displayOrder', 'ASC']],
        });
        for (let i = 0; i < libraries.length; i++) {
            const library = libraries[i];
            if (library.displayOrder !== i + 1) {
                logger?.debug(`[Library] Updating display order of library from ${library.displayOrder} to ${i + 1}`);
                try {
                    await library.update({ displayOrder: i + 1 });
                }
                catch (error) {
                    logger?.error(`[Library] Failed to update library display order to ${i + 1}`, error);
                }
            }
        }
    }
    get isPodcast() {
        return this.mediaType === 'podcast';
    }
    get isBook() {
        return this.mediaType === 'book';
    }
    get lastScanMetadataPrecedence() {
        return this.extraData?.lastScanMetadataPrecedence || [];
    }
    get librarySettings() {
        return this.settings || Library_1.getDefaultLibrarySettingsForMediaType(this.mediaType);
    }
    toOldJSON() {
        return {
            id: this.id,
            name: this.name,
            folders: (this.libraryFolders || []).map((f) => f.toOldJSON()),
            displayOrder: this.displayOrder,
            icon: this.icon,
            mediaType: this.mediaType,
            provider: this.provider,
            settings: {
                ...this.settings,
            },
            lastScan: this.lastScan?.valueOf() || null,
            lastScanVersion: this.lastScanVersion,
            createdAt: this.createdAt.valueOf(),
            lastUpdate: this.updatedAt.valueOf(),
        };
    }
};
exports.Library = Library;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Library.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Library.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Library.prototype, "displayOrder", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Library.prototype, "icon", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Library.prototype, "mediaType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Library.prototype, "provider", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Library.prototype, "lastScan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Library.prototype, "lastScanVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], Library.prototype, "settings", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], Library.prototype, "extraData", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => library_folder_model_1.LibraryFolder),
    __metadata("design:type", Array)
], Library.prototype, "libraryFolders", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => library_item_model_1.LibraryItem),
    __metadata("design:type", Array)
], Library.prototype, "libraryItems", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => author_model_1.Author, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Library.prototype, "authors", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => series_model_1.Series, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Library.prototype, "series", void 0);
exports.Library = Library = Library_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'libraries',
        timestamps: true,
    })
], Library);
//# sourceMappingURL=library.model.js.map