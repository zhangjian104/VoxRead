"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3333);
    const host = configService.get('HOST', '0.0.0.0');
    const routerBasePath = configService.get('ROUTER_BASE_PATH', '/audiobookshelf');
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    if (routerBasePath && routerBasePath !== '/') {
        app.setGlobalPrefix(routerBasePath);
    }
    const allowCors = configService.get('ALLOW_CORS', false);
    if (allowCors) {
        app.enableCors();
    }
    app.use((0, cookie_parser_1.default)());
    const MemoryStore = require('memorystore')(express_session_1.default);
    app.use((0, express_session_1.default)({
        secret: configService.get('SESSION_SECRET', 'audiobookshelf-secret'),
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    await app.listen(port, host);
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎧 Audiobookshelf NestJS Server                       ║
║                                                           ║
║   运行环境: ${process.env.NODE_ENV || 'production'}                     ║
║   监听地址: http://${host}:${port}${routerBasePath}                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map