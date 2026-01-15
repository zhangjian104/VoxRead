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
exports.LoggerService = exports.LogLevel = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
let LoggerService = class LoggerService {
    constructor() {
        this.logLevel = LogLevel.INFO;
        this.socketListeners = new Set();
        this.logManager = null;
        this.logPath = '';
        this.dailyLogPath = '';
        const envLogLevel = process.env.LOG_LEVEL;
        if (envLogLevel) {
            this.setLogLevel(envLogLevel);
        }
    }
    initialize(configPath) {
        this.logPath = path.join(configPath, 'logs');
        this.dailyLogPath = path.join(this.logPath, 'daily');
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath, { recursive: true });
        }
        if (!fs.existsSync(this.dailyLogPath)) {
            fs.mkdirSync(this.dailyLogPath, { recursive: true });
        }
    }
    setLogLevel(level) {
        const levelMap = {
            DEBUG: LogLevel.DEBUG,
            INFO: LogLevel.INFO,
            WARN: LogLevel.WARN,
            ERROR: LogLevel.ERROR,
            FATAL: LogLevel.FATAL,
        };
        this.logLevel = levelMap[level.toUpperCase()] ?? LogLevel.INFO;
    }
    addSocketListener(listener) {
        this.socketListeners.add(listener);
    }
    removeSocketListener(listener) {
        this.socketListeners.delete(listener);
    }
    formatMessage(level, ...args) {
        const timestamp = new Date().toISOString();
        const message = args
            .map((arg) => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg);
                }
                catch {
                    return String(arg);
                }
            }
            return String(arg);
        })
            .join(' ');
        return `[${timestamp}] [${level}] ${message}`;
    }
    writeLog(level, levelNum, ...args) {
        if (levelNum < this.logLevel) {
            return;
        }
        const formattedMessage = this.formatMessage(level, ...args);
        const consoleMethod = level === 'ERROR' || level === 'FATAL' ? 'error' :
            level === 'WARN' ? 'warn' : 'log';
        console[consoleMethod](formattedMessage);
        if (this.logPath) {
            try {
                const logFile = path.join(this.logPath, 'combined.log');
                fs.appendFileSync(logFile, formattedMessage + '\n');
                const today = new Date().toISOString().split('T')[0];
                const dailyLogFile = path.join(this.dailyLogPath, `${today}.log`);
                fs.appendFileSync(dailyLogFile, formattedMessage + '\n');
            }
            catch (error) {
                console.error('[Logger] Failed to write log file:', error);
            }
        }
        if (this.socketListeners.size > 0) {
            const logData = {
                timestamp: new Date().getTime(),
                level,
                message: args.join(' '),
            };
            this.socketListeners.forEach((listener) => {
                try {
                    listener(logData);
                }
                catch (error) {
                    console.error('[Logger] Socket listener error:', error);
                }
            });
        }
    }
    log(message, ...optionalParams) {
        this.info(message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.writeLog('ERROR', LogLevel.ERROR, message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.writeLog('WARN', LogLevel.WARN, message, ...optionalParams);
    }
    debug(message, ...optionalParams) {
        this.writeLog('DEBUG', LogLevel.DEBUG, message, ...optionalParams);
    }
    verbose(message, ...optionalParams) {
        this.writeLog('DEBUG', LogLevel.DEBUG, message, ...optionalParams);
    }
    info(...args) {
        this.writeLog('INFO', LogLevel.INFO, ...args);
    }
    fatal(...args) {
        this.writeLog('FATAL', LogLevel.FATAL, ...args);
    }
    getLogFiles() {
        if (!this.dailyLogPath || !fs.existsSync(this.dailyLogPath)) {
            return [];
        }
        try {
            return fs.readdirSync(this.dailyLogPath)
                .filter((file) => file.endsWith('.log'))
                .sort()
                .reverse();
        }
        catch (error) {
            this.error('[Logger] Failed to read log files:', error);
            return [];
        }
    }
    readLogFile(filename) {
        const filePath = path.join(this.dailyLogPath, filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Log file not found: ${filename}`);
        }
        try {
            return fs.readFileSync(filePath, 'utf-8');
        }
        catch (error) {
            this.error('[Logger] Failed to read log file:', error);
            throw error;
        }
    }
    cleanOldLogs(daysToKeep = 30) {
        if (!this.dailyLogPath || !fs.existsSync(this.dailyLogPath)) {
            return;
        }
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        try {
            const files = fs.readdirSync(this.dailyLogPath);
            files.forEach((file) => {
                if (!file.endsWith('.log'))
                    return;
                const filePath = path.join(this.dailyLogPath, file);
                const stats = fs.statSync(filePath);
                if (stats.mtime < cutoffDate) {
                    fs.unlinkSync(filePath);
                    this.info(`[Logger] Deleted old log file: ${file}`);
                }
            });
        }
        catch (error) {
            this.error('[Logger] Failed to clean old logs:', error);
        }
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.DEFAULT }),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map