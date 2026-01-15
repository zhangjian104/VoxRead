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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const sequelize_2 = require("@nestjs/sequelize");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const logger_service_1 = require("../logger/logger.service");
const global_config_service_1 = require("../config/global-config.service");
let DatabaseService = class DatabaseService {
    constructor(sequelize, logger, config) {
        this.sequelize = sequelize;
        this.logger = logger;
        this.config = config;
        this.isNew = false;
        this.hasRootUser = false;
        this.settings = [];
        this.libraryFilterData = {};
        this.serverSettings = null;
        this.notificationSettings = null;
        this.emailSettings = null;
        this.supportsUnaccent = false;
        this.supportsUnicodeFoldings = false;
        this.dbPath = this.config.getDatabasePath();
    }
    async onModuleInit() {
        await this.initialize();
    }
    async initialize() {
        try {
            this.logger.info('[Database] 初始化数据库连接...');
            this.isNew = !fs.existsSync(this.dbPath);
            if (this.isNew) {
                this.logger.info('[Database] 创建新的数据库文件');
            }
            await this.sequelize.authenticate();
            this.logger.info('[Database] 数据库连接成功');
            await this.checkSQLiteExtensions();
            await this.loadSettings();
            this.logger.info('[Database] 数据库初始化完成');
        }
        catch (error) {
            this.logger.error('[Database] 数据库初始化失败:', error);
            throw error;
        }
    }
    async checkSQLiteExtensions() {
        try {
            const nunicodePath = this.config.get('NUSQLITE3_PATH');
            if (nunicodePath && fs.existsSync(nunicodePath)) {
                await this.sequelize.query(`SELECT load_extension('${nunicodePath}')`);
                this.supportsUnaccent = true;
                this.supportsUnicodeFoldings = true;
                this.logger.info('[Database] SQLite Unicode 扩展已加载');
            }
        }
        catch (error) {
            this.logger.warn('[Database] SQLite Unicode 扩展加载失败，使用基础功能');
        }
    }
    async loadSettings() {
        try {
            this.logger.debug('[Database] 加载系统设置...');
        }
        catch (error) {
            this.logger.error('[Database] 加载设置失败:', error);
        }
    }
    getSequelize() {
        return this.sequelize;
    }
    getOp() {
        return sequelize_1.Op;
    }
    async query(sql, options) {
        return this.sequelize.query(sql, options);
    }
    async transaction(callback) {
        return this.sequelize.transaction(callback);
    }
    async sync(force = false) {
        try {
            await this.sequelize.sync({ force });
            this.logger.info('[Database] 数据库同步完成');
        }
        catch (error) {
            this.logger.error('[Database] 数据库同步失败:', error);
            throw error;
        }
    }
    async close() {
        try {
            await this.sequelize.close();
            this.logger.info('[Database] 数据库连接已关闭');
        }
        catch (error) {
            this.logger.error('[Database] 关闭数据库连接失败:', error);
            throw error;
        }
    }
    async healthCheck() {
        try {
            await this.sequelize.authenticate();
            return true;
        }
        catch (error) {
            this.logger.error('[Database] 健康检查失败:', error);
            return false;
        }
    }
    async getVersion() {
        try {
            const result = await this.sequelize.query('SELECT sqlite_version() as version');
            return result[0][0]['version'];
        }
        catch (error) {
            this.logger.error('[Database] 获取数据库版本失败:', error);
            return 'unknown';
        }
    }
    async backup(backupPath) {
        try {
            this.logger.info(`[Database] 开始备份数据库到: ${backupPath}`);
            const backupDir = path.dirname(backupPath);
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            fs.copyFileSync(this.dbPath, backupPath);
            this.logger.info('[Database] 数据库备份完成');
        }
        catch (error) {
            this.logger.error('[Database] 数据库备份失败:', error);
            throw error;
        }
    }
    async restore(backupPath) {
        try {
            this.logger.info(`[Database] 从备份恢复数据库: ${backupPath}`);
            if (!fs.existsSync(backupPath)) {
                throw new Error(`备份文件不存在: ${backupPath}`);
            }
            await this.close();
            const currentBackup = `${this.dbPath}.bak`;
            if (fs.existsSync(this.dbPath)) {
                fs.copyFileSync(this.dbPath, currentBackup);
            }
            fs.copyFileSync(backupPath, this.dbPath);
            await this.initialize();
            this.logger.info('[Database] 数据库恢复完成');
        }
        catch (error) {
            this.logger.error('[Database] 数据库恢复失败:', error);
            throw error;
        }
    }
    async vacuum() {
        try {
            this.logger.info('[Database] 开始优化数据库...');
            await this.sequelize.query('VACUUM');
            this.logger.info('[Database] 数据库优化完成');
        }
        catch (error) {
            this.logger.error('[Database] 数据库优化失败:', error);
            throw error;
        }
    }
    async analyze() {
        try {
            this.logger.info('[Database] 开始分析数据库...');
            await this.sequelize.query('ANALYZE');
            this.logger.info('[Database] 数据库分析完成');
        }
        catch (error) {
            this.logger.error('[Database] 数据库分析失败:', error);
            throw error;
        }
    }
    getDatabaseSize() {
        try {
            if (fs.existsSync(this.dbPath)) {
                const stats = fs.statSync(this.dbPath);
                return stats.size;
            }
            return 0;
        }
        catch (error) {
            this.logger.error('[Database] 获取数据库大小失败:', error);
            return 0;
        }
    }
    clearLibraryFilterData(libraryId) {
        if (libraryId) {
            delete this.libraryFilterData[libraryId];
            this.logger.debug(`[Database] 清除库 ${libraryId} 的过滤数据缓存`);
        }
        else {
            this.libraryFilterData = {};
            this.logger.debug('[Database] 清除所有库过滤数据缓存');
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_2.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_1.Sequelize,
        logger_service_1.LoggerService,
        global_config_service_1.GlobalConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map