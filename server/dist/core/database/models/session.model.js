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
var Session_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const sequelize_1 = require("sequelize");
let Session = Session_1 = class Session extends sequelize_typescript_1.Model {
    static async createSession(userId, ipAddress, userAgent, refreshToken, expiresAt) {
        const session = await Session_1.create({
            userId,
            ipAddress,
            userAgent,
            refreshToken,
            expiresAt,
        });
        return session;
    }
    static async cleanupExpiredSessions() {
        const deletedCount = await Session_1.destroy({
            where: {
                expiresAt: {
                    [sequelize_1.Op.lt]: new Date(),
                },
            },
        });
        return deletedCount;
    }
    static async findByRefreshToken(refreshToken) {
        return await Session_1.findOne({
            where: { refreshToken },
            include: [user_model_1.User],
        });
    }
    static async getUserActiveSessions(userId) {
        return await Session_1.findAll({
            where: {
                userId,
                expiresAt: {
                    [sequelize_1.Op.gt]: new Date(),
                },
            },
            order: [['createdAt', 'DESC']],
        });
    }
    static async deleteUserSessions(userId) {
        return await Session_1.destroy({
            where: { userId },
        });
    }
    static async deleteOtherUserSessions(userId, currentSessionId) {
        return await Session_1.destroy({
            where: {
                userId,
                id: {
                    [sequelize_1.Op.ne]: currentSessionId,
                },
            },
        });
    }
    isExpired() {
        return this.expiresAt < new Date();
    }
    async touch() {
        await this.update({
            updatedAt: new Date(),
        });
    }
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            expiresAt: this.expiresAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
};
exports.Session = Session;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Session.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Session.prototype, "userAgent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Session.prototype, "refreshToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Session.prototype, "expiresAt", void 0);
__decorate([
    ForeignKey(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Session.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Session.prototype, "user", void 0);
exports.Session = Session = Session_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'sessions',
        timestamps: true,
    })
], Session);
//# sourceMappingURL=session.model.js.map