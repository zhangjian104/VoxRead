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
var LibraryItem_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const library_model_1 = require("./library.model");
const library_folder_model_1 = require("./library-folder.model");
const book_model_1 = require("./book.model");
const podcast_model_1 = require("./podcast.model");
let LibraryItem = LibraryItem_1 = class LibraryItem extends sequelize_typescript_1.Model {
    static async removeById(libraryItemId) {
        return LibraryItem_1.destroy({
            where: { id: libraryItemId },
            individualHooks: true,
        });
    }
    static async getExpandedById(libraryItemId) {
        if (!libraryItemId)
            return null;
        const libraryItem = await LibraryItem_1.findByPk(libraryItemId);
        if (!libraryItem) {
            return null;
        }
        return libraryItem;
    }
    static async checkExistsById(libraryItemId) {
        const count = await LibraryItem_1.count({ where: { id: libraryItemId } });
        return count > 0;
    }
    get isBook() {
        return this.mediaType === 'book';
    }
    get isPodcast() {
        return this.mediaType === 'podcast';
    }
    get hasAudioTracks() {
        if (!this.media) {
            return false;
        }
        if (this.isBook) {
            return this.media.hasAudioTracks;
        }
        else {
            return this.media.hasAudioTracks;
        }
    }
    async getMedia() {
        if (!this.mediaType || !this.mediaId)
            return null;
        if (this.mediaType === 'book') {
            return await book_model_1.Book.findByPk(this.mediaId);
        }
        else {
            return await podcast_model_1.Podcast.findByPk(this.mediaId);
        }
    }
    getTrackList(episodeId) {
        if (!this.media) {
            return [];
        }
        if (this.isBook) {
            return this.media.getTracklist(this.id);
        }
        else {
            return this.media.getTracklist(this.id, episodeId);
        }
    }
    getAudioFileWithIno(ino) {
        if (!this.media) {
            return null;
        }
        if (this.isBook) {
            const book = this.media;
            return book.audioFiles.find((af) => af.ino === ino);
        }
        else {
            const podcast = this.media;
            return podcast.podcastEpisodes?.find((pe) => pe.audioFile?.ino === ino)?.audioFile;
        }
    }
    getLibraryFileWithIno(ino) {
        return this.libraryFiles.find((lf) => lf.ino === ino);
    }
    toOldJSON() {
        if (!this.media) {
            throw new Error(`[LibraryItem] Cannot convert to old JSON without media for library item "${this.id}"`);
        }
        return {
            id: this.id,
            ino: this.ino,
            oldLibraryItemId: this.extraData?.oldLibraryItemId || null,
            libraryId: this.libraryId,
            folderId: this.libraryFolderId,
            path: this.path,
            relPath: this.relPath,
            isFile: this.isFile,
            mtimeMs: this.mtime?.valueOf(),
            ctimeMs: this.ctime?.valueOf(),
            birthtimeMs: this.birthtime?.valueOf(),
            addedAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
            lastScan: this.lastScan?.valueOf(),
            scanVersion: this.lastScanVersion,
            isMissing: !!this.isMissing,
            isInvalid: !!this.isInvalid,
            mediaType: this.mediaType,
            media: this.mediaType === 'book'
                ? this.media.toOldJSON(this.id)
                : this.media.toOldJSON(this.id),
            libraryFiles: this.libraryFiles,
        };
    }
    toOldJSONMinified() {
        if (!this.media) {
            throw new Error(`[LibraryItem] Cannot convert to old JSON without media for library item "${this.id}"`);
        }
        return {
            id: this.id,
            ino: this.ino,
            oldLibraryItemId: this.extraData?.oldLibraryItemId || null,
            libraryId: this.libraryId,
            folderId: this.libraryFolderId,
            path: this.path,
            relPath: this.relPath,
            isFile: this.isFile,
            mtimeMs: this.mtime?.valueOf(),
            ctimeMs: this.ctime?.valueOf(),
            birthtimeMs: this.birthtime?.valueOf(),
            addedAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
            isMissing: !!this.isMissing,
            isInvalid: !!this.isInvalid,
            mediaType: this.mediaType,
            media: this.mediaType === 'book'
                ? this.media.toOldJSONMinified()
                : this.media.toOldJSONMinified(),
            numFiles: this.libraryFiles.length,
            size: this.size,
        };
    }
    toOldJSONExpanded() {
        if (!this.media) {
            throw new Error(`[LibraryItem] Cannot convert to old JSON without media for library item "${this.id}"`);
        }
        return {
            id: this.id,
            ino: this.ino,
            oldLibraryItemId: this.extraData?.oldLibraryItemId || null,
            libraryId: this.libraryId,
            folderId: this.libraryFolderId,
            path: this.path,
            relPath: this.relPath,
            isFile: this.isFile,
            mtimeMs: this.mtime?.valueOf(),
            ctimeMs: this.ctime?.valueOf(),
            birthtimeMs: this.birthtime?.valueOf(),
            addedAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
            lastScan: this.lastScan?.valueOf(),
            scanVersion: this.lastScanVersion,
            isMissing: !!this.isMissing,
            isInvalid: !!this.isInvalid,
            mediaType: this.mediaType,
            media: this.mediaType === 'book'
                ? this.media.toOldJSONExpanded(this.id)
                : this.media.toOldJSONExpanded(this.id),
            libraryFiles: this.libraryFiles,
            size: this.size,
        };
    }
};
exports.LibraryItem = LibraryItem;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], LibraryItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "ino", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "relPath", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], LibraryItem.prototype, "mediaId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "mediaType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], LibraryItem.prototype, "isFile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], LibraryItem.prototype, "isMissing", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], LibraryItem.prototype, "isInvalid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], LibraryItem.prototype, "mtime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], LibraryItem.prototype, "ctime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], LibraryItem.prototype, "birthtime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", String)
], LibraryItem.prototype, "size", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], LibraryItem.prototype, "lastScan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "lastScanVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], LibraryItem.prototype, "libraryFiles", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], LibraryItem.prototype, "extraData", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "titleIgnorePrefix", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "authorNamesFirstLast", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], LibraryItem.prototype, "authorNamesLastFirst", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => library_model_1.Library),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], LibraryItem.prototype, "libraryId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => library_folder_model_1.LibraryFolder),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], LibraryItem.prototype, "libraryFolderId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_model_1.Library),
    __metadata("design:type", library_model_1.Library)
], LibraryItem.prototype, "library", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => library_folder_model_1.LibraryFolder),
    __metadata("design:type", library_folder_model_1.LibraryFolder)
], LibraryItem.prototype, "libraryFolder", void 0);
exports.LibraryItem = LibraryItem = LibraryItem_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'libraryItems',
        timestamps: true,
        indexes: [
            { fields: ['createdAt'] },
            { fields: ['mediaId'] },
            { fields: ['libraryId', 'mediaType'] },
            { fields: ['libraryId', 'mediaType', 'size'] },
            { fields: ['libraryId', 'mediaType', 'createdAt'] },
            { fields: ['libraryId', 'mediaType', { name: 'title', collate: 'NOCASE' }] },
            { fields: ['libraryId', 'mediaType', { name: 'titleIgnorePrefix', collate: 'NOCASE' }] },
            { fields: ['libraryId', 'mediaType', { name: 'authorNamesFirstLast', collate: 'NOCASE' }] },
            { fields: ['libraryId', 'mediaType', { name: 'authorNamesLastFirst', collate: 'NOCASE' }] },
            { fields: ['libraryId', 'mediaId', 'mediaType'] },
            { fields: ['birthtime'] },
            { fields: ['mtime'] },
        ],
    })
], LibraryItem);
//# sourceMappingURL=library-item.model.js.map