"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybackModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const playback_session_manager_service_1 = require("./playback-session-manager.service");
const stream_service_1 = require("./stream.service");
const hls_controller_1 = require("./hls.controller");
const playback_session_model_1 = require("../../core/database/models/playback-session.model");
const device_model_1 = require("../../core/database/models/device.model");
let PlaybackModule = class PlaybackModule {
};
exports.PlaybackModule = PlaybackModule;
exports.PlaybackModule = PlaybackModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([playback_session_model_1.PlaybackSession, device_model_1.Device])],
        controllers: [hls_controller_1.HlsController],
        providers: [playback_session_manager_service_1.PlaybackSessionManagerService, stream_service_1.StreamFactoryService],
        exports: [playback_session_manager_service_1.PlaybackSessionManagerService, stream_service_1.StreamFactoryService],
    })
], PlaybackModule);
//# sourceMappingURL=playback.module.js.map