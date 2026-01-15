"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryItemModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const library_item_controller_1 = require("./library-item.controller");
const library_item_service_1 = require("./library-item.service");
const models_1 = require("../../core/database/models");
let LibraryItemModule = class LibraryItemModule {
};
exports.LibraryItemModule = LibraryItemModule;
exports.LibraryItemModule = LibraryItemModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.LibraryItem,
                models_1.Book,
                models_1.Podcast,
                models_1.PodcastEpisode,
                models_1.Library,
                models_1.Author,
                models_1.Series,
                models_1.MediaProgress,
            ]),
        ],
        controllers: [library_item_controller_1.LibraryItemController],
        providers: [library_item_service_1.LibraryItemService],
        exports: [library_item_service_1.LibraryItemService],
    })
], LibraryItemModule);
//# sourceMappingURL=library-item.module.js.map