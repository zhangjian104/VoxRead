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
var Book_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const author_model_1 = require("./author.model");
const series_model_1 = require("./series.model");
const book_author_model_1 = require("./book-author.model");
const book_series_model_1 = require("./book-series.model");
let Book = Book_1 = class Book extends sequelize_typescript_1.Model {
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
    get authorName() {
        if (!this.authors) {
            return '';
        }
        return this.authors.map((au) => au.name).join(', ');
    }
    get authorNameLF() {
        if (!this.authors) {
            return '';
        }
        return this.authors.map((au) => author_model_1.Author.getLastFirst(au.name)).join(', ');
    }
    get seriesName() {
        if (!this.series) {
            return '';
        }
        return this.series
            .map((se) => {
            const sequence = se.bookSeries?.sequence || '';
            if (!sequence)
                return se.name;
            return `${se.name} #${sequence}`;
        })
            .join(', ');
    }
    get includedAudioFiles() {
        return this.audioFiles.filter((af) => !af.exclude);
    }
    get hasMediaFiles() {
        return this.hasAudioTracks || !!this.ebookFile;
    }
    get hasAudioTracks() {
        return this.includedAudioFiles.length > 0;
    }
    get ebookFormat() {
        return this.ebookFile?.ebookFormat;
    }
    get size() {
        let total = 0;
        this.audioFiles.forEach((af) => (total += af.metadata.size || 0));
        if (this.ebookFile) {
            total += this.ebookFile.metadata.size || 0;
        }
        return total;
    }
    checkCanDirectPlay(supportedMimeTypes) {
        if (!Array.isArray(supportedMimeTypes)) {
            return false;
        }
        return this.includedAudioFiles.every((af) => supportedMimeTypes.includes(af.mimeType));
    }
    getTracklist(libraryItemId) {
        let startOffset = 0;
        return this.includedAudioFiles.map((af) => {
            const track = { ...af };
            track.title = af.metadata.filename;
            track.startOffset = startOffset;
            track.contentUrl = `/api/items/${libraryItemId}/file/${track.ino}`;
            startOffset += track.duration;
            return track;
        });
    }
    getChapters() {
        return structuredClone(this.chapters) || [];
    }
    getPlaybackTitle() {
        return this.title;
    }
    getPlaybackAuthor() {
        return this.authorName;
    }
    getPlaybackDuration() {
        return this.duration;
    }
    toOldJSON(libraryItemId) {
        if (!libraryItemId) {
            throw new Error('[Book] Cannot convert to old JSON because libraryItemId is not provided');
        }
        if (!this.authors) {
            throw new Error('[Book] Cannot convert to old JSON because authors are not loaded');
        }
        if (!this.series) {
            throw new Error('[Book] Cannot convert to old JSON because series are not loaded');
        }
        const authors = this.authors.map((au) => ({ id: au.id, name: au.name }));
        const series = this.series.map((se) => ({
            id: se.id,
            name: se.name,
            sequence: se.bookSeries?.sequence || null,
        }));
        return {
            id: this.id,
            libraryItemId,
            metadata: {
                title: this.title,
                subtitle: this.subtitle,
                authors,
                narrators: [...(this.narrators || [])],
                series,
                genres: [...(this.genres || [])],
                publishedYear: this.publishedYear,
                publishedDate: this.publishedDate,
                publisher: this.publisher,
                description: this.description,
                isbn: this.isbn,
                asin: this.asin,
                language: this.language,
                explicit: this.explicit,
                abridged: this.abridged,
            },
            coverPath: this.coverPath,
            tags: [...(this.tags || [])],
            audioFiles: structuredClone(this.audioFiles),
            chapters: structuredClone(this.chapters),
            ebookFile: structuredClone(this.ebookFile),
        };
    }
    toOldJSONMinified() {
        if (!this.authors) {
            throw new Error('[Book] Cannot convert to old JSON because authors are not loaded');
        }
        if (!this.series) {
            throw new Error('[Book] Cannot convert to old JSON because series are not loaded');
        }
        return {
            id: this.id,
            metadata: {
                title: this.title,
                titleIgnorePrefix: Book_1.getTitlePrefixAtEnd(this.title),
                subtitle: this.subtitle,
                authorName: this.authorName,
                authorNameLF: this.authorNameLF,
                narratorName: (this.narrators || []).join(', '),
                seriesName: this.seriesName,
                genres: [...(this.genres || [])],
                publishedYear: this.publishedYear,
                publishedDate: this.publishedDate,
                publisher: this.publisher,
                description: this.description,
                isbn: this.isbn,
                asin: this.asin,
                language: this.language,
                explicit: this.explicit,
                abridged: this.abridged,
            },
            coverPath: this.coverPath,
            tags: [...(this.tags || [])],
            numTracks: this.includedAudioFiles.length,
            numAudioFiles: this.audioFiles?.length || 0,
            numChapters: this.chapters?.length || 0,
            duration: this.duration,
            size: this.size,
            ebookFormat: this.ebookFile?.ebookFormat,
        };
    }
    toOldJSONExpanded(libraryItemId) {
        const json = this.toOldJSON(libraryItemId);
        json.duration = this.duration;
        json.size = this.size;
        json.tracks = this.getTracklist(libraryItemId);
        return json;
    }
};
exports.Book = Book;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "titleIgnorePrefix", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "subtitle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "publishedYear", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "publishedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "publisher", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "isbn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "asin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "language", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Book.prototype, "explicit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Book.prototype, "abridged", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Book.prototype, "coverPath", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], Book.prototype, "duration", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Book.prototype, "narrators", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Book.prototype, "audioFiles", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], Book.prototype, "ebookFile", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Book.prototype, "chapters", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Book.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Book.prototype, "genres", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => author_model_1.Author, () => book_author_model_1.BookAuthor),
    __metadata("design:type", Array)
], Book.prototype, "authors", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => series_model_1.Series, () => book_series_model_1.BookSeries),
    __metadata("design:type", Array)
], Book.prototype, "series", void 0);
exports.Book = Book = Book_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'books',
        timestamps: true,
        indexes: [
            {
                fields: [{ name: 'title', collate: 'NOCASE' }],
            },
            {
                fields: ['publishedYear'],
            },
            {
                fields: ['duration'],
            },
        ],
    })
], Book);
//# sourceMappingURL=book.model.js.map