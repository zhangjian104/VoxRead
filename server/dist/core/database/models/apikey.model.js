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
var ApiKey_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = exports.apiKeyCache = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const sequelize_1 = require("sequelize");
const lru_cache_1 = require("lru-cache");
const jwt = __importStar(require("jsonwebtoken"));
class ApiKeyCache {
    constructor() {
        this.cache = new lru_cache_1.LRUCache({ max: 100 });
    }
    getById(id) {
        return this.cache.get(id);
    }
    set(apiKey) {
        apiKey.fromCache = true;
        this.cache.set(apiKey.id, apiKey);
    }
    delete(apiKeyId) {
        this.cache.delete(apiKeyId);
    }
    maybeInvalidate(apiKey) {
        if (!apiKey.fromCache) {
            this.delete(apiKey.id);
        }
    }
}
exports.apiKeyCache = new ApiKeyCache();
let ApiKey = ApiKey_1 = class ApiKey extends sequelize_typescript_1.Model {
    static getDefaultPermissions() {
        return {
            download: true,
            update: true,
            delete: true,
            upload: true,
            createEreader: true,
            accessAllLibraries: true,
            accessAllTags: true,
            accessExplicitContent: true,
            selectedTagsNotAccessible: false,
            librariesAccessible: [],
            itemTagsSelected: [],
        };
    }
    static mergePermissionsWithDefault(reqPermissions) {
        const permissions = ApiKey_1.getDefaultPermissions();
        if (!reqPermissions || typeof reqPermissions !== 'object') {
            console.warn('[ApiKey] 无效的权限对象');
            return permissions;
        }
        for (const key in reqPermissions) {
            if (reqPermissions[key] === undefined) {
                continue;
            }
            if (key === 'librariesAccessible' || key === 'itemTagsSelected') {
                const value = reqPermissions[key];
                if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) {
                    console.warn(`[ApiKey] 无效的 ${key} 值`);
                    continue;
                }
                permissions[key] = value;
            }
            else if (typeof reqPermissions[key] !== 'boolean') {
                console.warn(`[ApiKey] ${key} 应该是布尔值`);
                continue;
            }
            else {
                permissions[key] = reqPermissions[key];
            }
        }
        return permissions;
    }
    static async deactivateExpiredApiKeys() {
        const [affectedCount] = await ApiKey_1.update({ isActive: false }, {
            where: {
                isActive: true,
                expiresAt: {
                    [sequelize_1.Op.lt]: new Date(),
                },
            },
        });
        return affectedCount;
    }
    static async generateApiKey(tokenSecret, keyId, name, expiresIn) {
        return new Promise((resolve) => {
            const payload = {
                keyId,
                name,
                type: 'api',
            };
            const options = {};
            if (expiresIn && !isNaN(expiresIn) && expiresIn > 0) {
                options.expiresIn = expiresIn;
            }
            jwt.sign(payload, tokenSecret, options, (err, token) => {
                if (err) {
                    console.error('[ApiKey] 生成 API Key 失败:', err);
                    resolve(null);
                }
                else {
                    resolve(token);
                }
            });
        });
    }
    static async getById(apiKeyId) {
        if (!apiKeyId)
            return null;
        const cachedApiKey = exports.apiKeyCache.getById(apiKeyId);
        if (cachedApiKey)
            return cachedApiKey;
        const apiKey = await ApiKey_1.findByPk(apiKeyId, {
            include: [user_model_1.User],
        });
        if (apiKey) {
            exports.apiKeyCache.set(apiKey);
        }
        return apiKey;
    }
    static async getUserApiKeys(userId) {
        return await ApiKey_1.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
    }
    isExpired() {
        if (!this.expiresAt)
            return false;
        return this.expiresAt < new Date();
    }
    async updateLastUsed() {
        this.lastUsedAt = new Date();
        await this.save();
    }
    async deactivate() {
        this.isActive = false;
        await this.save();
    }
    async activate() {
        this.isActive = true;
        await this.save();
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            expiresAt: this.expiresAt,
            lastUsedAt: this.lastUsedAt,
            isActive: this.isActive,
            permissions: this.permissions,
            userId: this.userId,
            createdByUserId: this.createdByUserId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    async $afterUpdate() {
        exports.apiKeyCache.maybeInvalidate(this);
    }
    async $afterSave() {
        exports.apiKeyCache.set(this);
    }
    async $afterDestroy() {
        exports.apiKeyCache.delete(this.id);
    }
};
exports.ApiKey = ApiKey;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], ApiKey.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ApiKey.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ApiKey.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], ApiKey.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], ApiKey.prototype, "lastUsedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], ApiKey.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], ApiKey.prototype, "permissions", void 0);
__decorate([
    ForeignKey(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ApiKey.prototype, "userId", void 0);
__decorate([
    ForeignKey(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ApiKey.prototype, "createdByUserId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], ApiKey.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User, 'createdByUserId'),
    __metadata("design:type", user_model_1.User)
], ApiKey.prototype, "createdByUser", void 0);
exports.ApiKey = ApiKey = ApiKey_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'apiKeys',
        timestamps: true,
    })
], ApiKey);
//# sourceMappingURL=apikey.model.js.map