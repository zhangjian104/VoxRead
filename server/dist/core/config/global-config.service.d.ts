import { ConfigService as NestConfigService } from '@nestjs/config';
export declare class GlobalConfigService {
    private configService;
    constructor(configService: NestConfigService);
    private initializeGlobalVariables;
    private filePathToPOSIX;
    get<T = any>(key: string, defaultValue?: T): T;
    getPort(): number;
    getHost(): string;
    getConfigPath(): string;
    getMetadataPath(): string;
    getRouterBasePath(): string;
    getDatabasePath(): string;
    isDevelopment(): boolean;
    isProduction(): boolean;
    getFFmpegPath(): string | undefined;
    getFFprobePath(): string | undefined;
    skipBinariesCheck(): boolean;
    getBackupPath(): string;
    getAllowCors(): boolean;
    getAllowIframe(): boolean;
}
