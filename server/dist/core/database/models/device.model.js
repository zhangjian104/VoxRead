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
var Device_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
let Device = Device_1 = class Device extends sequelize_typescript_1.Model {
    static async getOldDeviceByDeviceId(deviceId) {
        const device = await Device_1.findOne({
            where: { deviceId },
        });
        if (!device)
            return null;
        return device.toOldJSON();
    }
    toOldJSON() {
        let browserVersion = null;
        let sdkVersion = null;
        if (this.clientName === 'Abs Android') {
            sdkVersion = this.deviceVersion || null;
        }
        else {
            browserVersion = this.deviceVersion || null;
        }
        return {
            id: this.id,
            deviceId: this.deviceId,
            userId: this.userId,
            ipAddress: this.ipAddress,
            browserName: this.extraData.browserName || null,
            browserVersion,
            osName: this.extraData.osName || null,
            osVersion: this.extraData.osVersion || null,
            clientVersion: this.clientVersion || null,
            manufacturer: this.extraData.manufacturer || null,
            model: this.extraData.model || null,
            sdkVersion,
            deviceName: this.deviceName,
            clientName: this.clientName,
        };
    }
};
exports.Device = Device;
__decorate([
    PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Device.prototype, "deviceId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Device.prototype, "clientName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Device.prototype, "clientVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Device.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Device.prototype, "deviceName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Device.prototype, "deviceVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)({}),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], Device.prototype, "extraData", void 0);
__decorate([
    ForeignKey(() => user_model_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Device.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_1.User)
], Device.prototype, "user", void 0);
exports.Device = Device = Device_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'devices',
        timestamps: true,
    })
], Device);
//# sourceMappingURL=device.model.js.map