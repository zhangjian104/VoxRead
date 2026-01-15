"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const collection_controller_1 = require("./collection.controller");
const collection_service_1 = require("./collection.service");
const collection_model_1 = require("../../core/database/models/collection.model");
const collection_book_model_1 = require("../../core/database/models/collection-book.model");
const library_item_model_1 = require("../../core/database/models/library-item.model");
const book_model_1 = require("../../core/database/models/book.model");
let CollectionModule = class CollectionModule {
};
exports.CollectionModule = CollectionModule;
exports.CollectionModule = CollectionModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([collection_model_1.Collection, collection_book_model_1.CollectionBook, library_item_model_1.LibraryItem, book_model_1.Book])],
        controllers: [collection_controller_1.CollectionController],
        providers: [collection_service_1.CollectionService],
        exports: [collection_service_1.CollectionService],
    })
], CollectionModule);
//# sourceMappingURL=collection.module.js.map