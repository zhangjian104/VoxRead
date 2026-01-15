"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const core_module_1 = require("./core/core.module");
const auth_module_1 = require("./auth/auth.module");
const exception_filter_1 = require("./common/filters/exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const logger_service_1 = require("./core/logger/logger.service");
const library_module_1 = require("./modules/library/library.module");
const library_item_module_1 = require("./modules/library-item/library-item.module");
const book_module_1 = require("./modules/book/book.module");
const podcast_module_1 = require("./modules/podcast/podcast.module");
const author_module_1 = require("./modules/author/author.module");
const series_module_1 = require("./modules/series/series.module");
const user_module_1 = require("./modules/user/user.module");
const me_module_1 = require("./modules/me/me.module");
const collection_module_1 = require("./modules/collection/collection.module");
const playlist_module_1 = require("./modules/playlist/playlist.module");
const search_module_1 = require("./modules/search/search.module");
const session_module_1 = require("./modules/session/session.module");
const playback_module_1 = require("./modules/playback/playback.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
                load: [
                    () => ({
                        NODE_ENV: process.env.NODE_ENV || 'production',
                        PORT: parseInt(process.env.PORT || '3333', 10),
                        HOST: process.env.HOST || '0.0.0.0',
                        SOURCE: process.env.SOURCE || 'local',
                        CONFIG_PATH: process.env.CONFIG_PATH,
                        METADATA_PATH: process.env.METADATA_PATH,
                        DATABASE_PATH: process.env.DATABASE_PATH,
                        LOG_PATH: process.env.LOG_PATH,
                        COVERS_PATH: process.env.COVERS_PATH,
                        AUDIO_CACHE_PATH: process.env.AUDIO_CACHE_PATH,
                        UPLOAD_PATH: process.env.UPLOAD_PATH,
                        FFMPEG_PATH: process.env.FFMPEG_PATH,
                        FFPROBE_PATH: process.env.FFPROBE_PATH,
                        NUSQLITE3_PATH: process.env.NUSQLITE3_PATH,
                        SKIP_BINARIES_CHECK: process.env.SKIP_BINARIES_CHECK === '1',
                        BACKUP_PATH: process.env.BACKUP_PATH,
                        PODCAST_DOWNLOAD_TIMEOUT: parseInt(process.env.PODCAST_DOWNLOAD_TIMEOUT || '30000', 10),
                        MAX_FAILED_EPISODE_CHECKS: parseInt(process.env.MAX_FAILED_EPISODE_CHECKS || '24', 10),
                        ALLOW_CORS: process.env.ALLOW_CORS === '1',
                        ROUTER_BASE_PATH: process.env.ROUTER_BASE_PATH,
                        JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey',
                        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshkey',
                        ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
                        REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
                        OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
                        OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
                        OIDC_ISSUER_URL: process.env.OIDC_ISSUER_URL,
                        OIDC_REDIRECT_URI: process.env.OIDC_REDIRECT_URI,
                        OIDC_SCOPE: process.env.OIDC_SCOPE || 'openid profile email',
                    }),
                ],
            }),
            schedule_1.ScheduleModule.forRoot(),
            core_module_1.CoreModule,
            auth_module_1.AuthModule,
            library_module_1.LibraryModule,
            library_item_module_1.LibraryItemModule,
            book_module_1.BookModule,
            podcast_module_1.PodcastModule,
            author_module_1.AuthorModule,
            series_module_1.SeriesModule,
            user_module_1.UserModule,
            me_module_1.MeModule,
            collection_module_1.CollectionModule,
            playlist_module_1.PlaylistModule,
            search_module_1.SearchModule,
            session_module_1.SessionModule,
            playback_module_1.PlaybackModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: exception_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.PerformanceInterceptor,
            },
            logger_service_1.LoggerService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map