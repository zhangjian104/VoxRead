"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const me_controller_1 = require("./me.controller");
const me_service_1 = require("./me.service");
const user_model_1 = require("../../core/database/models/user.model");
const media_progress_model_1 = require("../../core/database/models/media-progress.model");
const library_item_model_1 = require("../../core/database/models/library-item.model");
const series_model_1 = require("../../core/database/models/series.model");
const auth_module_1 = require("../../auth/auth.module");
let MeModule = class MeModule {
};
exports.MeModule = MeModule;
exports.MeModule = MeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([user_model_1.User, media_progress_model_1.MediaProgress, library_item_model_1.LibraryItem, series_model_1.Series]),
            auth_module_1.AuthModule,
        ],
        controllers: [me_controller_1.MeController],
        providers: [me_service_1.MeService],
        exports: [me_service_1.MeService],
    })
], MeModule);
//# sourceMappingURL=me.module.js.map