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
var Setting_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Setting = Setting_1 = class Setting extends sequelize_typescript_1.Model {
    static async getAllSettings() {
        return Setting_1.findAll();
    }
    static async getByKey(key) {
        return Setting_1.findByPk(key);
    }
    static async updateSetting(key, value) {
        return Setting_1.upsert({ key, value });
    }
};
exports.Setting = Setting;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Setting.prototype, "key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], Setting.prototype, "value", void 0);
exports.Setting = Setting = Setting_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'settings',
        timestamps: true,
    })
], Setting);
//# sourceMappingURL=setting.model.js.map