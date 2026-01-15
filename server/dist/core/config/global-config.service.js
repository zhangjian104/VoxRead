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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let GlobalConfigService = class GlobalConfigService {
    constructor(configService) {
        this.configService = configService;
        this.initializeGlobalVariables();
    }
    initializeGlobalVariables() {
        global.Source = this.configService.get('SOURCE', 'local');
        global.isWin = process.platform === 'win32';
        const configPath = this.configService.get('CONFIG_PATH', path.resolve('config'));
        const metadataPath = this.configService.get('METADATA_PATH', path.resolve('metadata'));
        global.ConfigPath = this.filePathToPOSIX(path.normalize(configPath));
        global.MetadataPath = this.filePathToPOSIX(path.normalize(metadataPath));
        global.RouterBasePath = this.configService.get('ROUTER_BASE_PATH', '/audiobookshelf');
        if (!fs.existsSync(global.ConfigPath)) {
            fs.mkdirSync(global.ConfigPath, { recursive: true });
        }
        if (!fs.existsSync(global.MetadataPath)) {
            fs.mkdirSync(global.MetadataPath, { recursive: true });
        }
        global.XAccel = this.configService.get('USE_X_ACCEL');
        global.AllowCors = this.configService.get('ALLOW_CORS', false);
        global.PodcastDownloadTimeout = this.configService.get('PODCAST_DOWNLOAD_TIMEOUT', 30000);
        global.MaxFailedEpisodeChecks = this.configService.get('MAX_FAILED_EPISODE_CHECKS', 24);
        const expProxySupport = this.configService.get('EXP_PROXY_SUPPORT', false);
        const disableSsrfFilter = this.configService.get('DISABLE_SSRF_REQUEST_FILTER', false);
        const ssrfWhitelist = this.configService.get('SSRF_REQUEST_FILTER_WHITELIST', '');
        if (expProxySupport) {
            global.DisableSsrfRequestFilter = () => true;
        }
        else if (disableSsrfFilter) {
            global.DisableSsrfRequestFilter = () => true;
        }
        else if (ssrfWhitelist) {
            const whitelistedUrls = ssrfWhitelist.split(',').map((url) => url.trim());
            if (whitelistedUrls.length) {
                global.DisableSsrfRequestFilter = (url) => {
                    try {
                        return whitelistedUrls.includes(new URL(url).hostname);
                    }
                    catch {
                        return false;
                    }
                };
            }
        }
    }
    filePathToPOSIX(filePath) {
        return filePath.replace(/\\/g, '/');
    }
    get(key, defaultValue) {
        return this.configService.get(key, defaultValue);
    }
    getPort() {
        return this.configService.get('PORT', 3333);
    }
    getHost() {
        return this.configService.get('HOST', '0.0.0.0');
    }
    getConfigPath() {
        return global.ConfigPath;
    }
    getMetadataPath() {
        return global.MetadataPath;
    }
    getRouterBasePath() {
        return global.RouterBasePath;
    }
    getDatabasePath() {
        const dbPath = this.configService.get('DATABASE_PATH');
        if (dbPath) {
            return path.resolve(dbPath);
        }
        return path.join(this.getConfigPath(), 'absdatabase.sqlite');
    }
    isDevelopment() {
        return this.configService.get('NODE_ENV') === 'development';
    }
    isProduction() {
        return this.configService.get('NODE_ENV') === 'production';
    }
    getFFmpegPath() {
        return this.configService.get('FFMPEG_PATH');
    }
    getFFprobePath() {
        return this.configService.get('FFPROBE_PATH');
    }
    skipBinariesCheck() {
        return this.configService.get('SKIP_BINARIES_CHECK', false);
    }
    getBackupPath() {
        const backupPath = this.configService.get('BACKUP_PATH');
        if (backupPath) {
            return path.resolve(backupPath);
        }
        return path.join(this.getMetadataPath(), 'backups');
    }
    getAllowCors() {
        return global.AllowCors;
    }
    getAllowIframe() {
        return this.configService.get('ALLOW_IFRAME', false);
    }
};
exports.GlobalConfigService = GlobalConfigService;
exports.GlobalConfigService = GlobalConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GlobalConfigService);
//# sourceMappingURL=global-config.service.js.map