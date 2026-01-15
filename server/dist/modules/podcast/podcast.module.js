"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const podcast_controller_1 = require("./podcast.controller");
const podcast_service_1 = require("./podcast.service");
const models_1 = require("../../core/database/models");
let PodcastModule = class PodcastModule {
};
exports.PodcastModule = PodcastModule;
exports.PodcastModule = PodcastModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.Podcast,
                models_1.PodcastEpisode,
            ]),
        ],
        controllers: [podcast_controller_1.PodcastController],
        providers: [podcast_service_1.PodcastService],
        exports: [podcast_service_1.PodcastService],
    })
], PodcastModule);
//# sourceMappingURL=podcast.module.js.map