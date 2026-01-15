"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const database_service_1 = require("./database.service");
const models_1 = require("./models");
const path = __importStar(require("path"));
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const configPath = configService.get('CONFIG_PATH', path.resolve('config'));
                    const dbPath = configService.get('DATABASE_PATH') ||
                        path.join(configPath, 'absdatabase.sqlite');
                    return {
                        dialect: 'sqlite',
                        storage: dbPath,
                        logging: false,
                        define: {
                            timestamps: true,
                            underscored: false,
                            freezeTableName: true,
                        },
                        pool: {
                            max: 10,
                            min: 0,
                            acquire: 30000,
                            idle: 10000,
                        },
                        models: [
                            models_1.User,
                            models_1.Session,
                            models_1.ApiKey,
                            models_1.Library,
                            models_1.LibraryFolder,
                            models_1.LibraryItem,
                            models_1.Book,
                            models_1.Author,
                            models_1.Series,
                            models_1.BookAuthor,
                            models_1.BookSeries,
                            models_1.Podcast,
                            models_1.PodcastEpisode,
                            models_1.MediaProgress,
                            models_1.Collection,
                            models_1.CollectionBook,
                            models_1.Playlist,
                            models_1.PlaylistMediaItem,
                            models_1.Device,
                            models_1.PlaybackSession,
                            models_1.MediaItemShare,
                            models_1.Setting,
                        ],
                        autoLoadModels: true,
                        synchronize: false,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            sequelize_1.SequelizeModule.forFeature([
                models_1.User,
                models_1.Session,
                models_1.ApiKey,
                models_1.Library,
                models_1.LibraryFolder,
                models_1.LibraryItem,
                models_1.Book,
                models_1.Author,
                models_1.Series,
                models_1.BookAuthor,
                models_1.BookSeries,
                models_1.Podcast,
                models_1.PodcastEpisode,
                models_1.MediaProgress,
                models_1.Collection,
                models_1.CollectionBook,
                models_1.Playlist,
                models_1.PlaylistMediaItem,
                models_1.Device,
                models_1.PlaybackSession,
                models_1.MediaItemShare,
                models_1.Setting,
            ]),
        ],
        providers: [database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService, sequelize_1.SequelizeModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map