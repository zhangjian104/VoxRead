"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../core/database/models");
const logger_service_1 = require("../../core/logger/logger.service");
let SeriesService = class SeriesService {
    constructor(seriesModel, logger) {
        this.seriesModel = seriesModel;
        this.logger = logger;
    }
    async findOne(id) {
        const series = await models_1.Series.getExpandedById(id);
        if (!series) {
            throw new common_1.NotFoundException(`系列 ${id} 未找到`);
        }
        return series;
    }
    async findAllByLibrary(libraryId) {
        return await this.seriesModel.findAll({
            where: { libraryId },
            order: [['name', 'ASC']],
        });
    }
    async update(id, updateData) {
        const series = await this.findOne(id);
        this.logger.info(`[SeriesService] 更新系列: ${series.name}`);
        Object.assign(series, updateData);
        await series.save();
        return series;
    }
    async exists(id) {
        return await models_1.Series.checkExistsById(id);
    }
};
exports.SeriesService = SeriesService;
exports.SeriesService = SeriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Series)),
    __metadata("design:paramtypes", [Object, logger_service_1.LoggerService])
], SeriesService);
//# sourceMappingURL=series.service.js.map