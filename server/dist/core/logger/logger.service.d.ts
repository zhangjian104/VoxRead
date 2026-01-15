import { LoggerService as NestLoggerService } from '@nestjs/common';
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}
export declare class LoggerService implements NestLoggerService {
    private logLevel;
    private logPath;
    private dailyLogPath;
    private socketListeners;
    logManager: any;
    constructor();
    initialize(configPath: string): void;
    setLogLevel(level: string): void;
    addSocketListener(listener: (log: any) => void): void;
    removeSocketListener(listener: (log: any) => void): void;
    private formatMessage;
    private writeLog;
    log(message: any, ...optionalParams: any[]): void;
    error(message: any, ...optionalParams: any[]): void;
    warn(message: any, ...optionalParams: any[]): void;
    debug(message: any, ...optionalParams: any[]): void;
    verbose(message: any, ...optionalParams: any[]): void;
    info(...args: any[]): void;
    fatal(...args: any[]): void;
    getLogFiles(): string[];
    readLogFile(filename: string): string;
    cleanOldLogs(daysToKeep?: number): void;
}
