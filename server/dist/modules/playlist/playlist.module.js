"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const playlist_controller_1 = require("./playlist.controller");
const playlist_service_1 = require("./playlist.service");
const playlist_model_1 = require("../../core/database/models/playlist.model");
const playlist_media_item_model_1 = require("../../core/database/models/playlist-media-item.model");
const library_item_model_1 = require("../../core/database/models/library-item.model");
const podcast_episode_model_1 = require("../../core/database/models/podcast-episode.model");
const collection_model_1 = require("../../core/database/models/collection.model");
let PlaylistModule = class PlaylistModule {
};
exports.PlaylistModule = PlaylistModule;
exports.PlaylistModule = PlaylistModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([playlist_model_1.Playlist, playlist_media_item_model_1.PlaylistMediaItem, library_item_model_1.LibraryItem, podcast_episode_model_1.PodcastEpisode, collection_model_1.Collection])],
        controllers: [playlist_controller_1.PlaylistController],
        providers: [playlist_service_1.PlaylistService],
        exports: [playlist_service_1.PlaylistService],
    })
], PlaylistModule);
//# sourceMappingURL=playlist.module.js.map