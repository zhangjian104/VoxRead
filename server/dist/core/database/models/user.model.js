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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userCache = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const lru_cache_1 = require("lru-cache");
class UserCache {
    constructor() {
        this.cache = new lru_cache_1.LRUCache({ max: 100 });
    }
    getById(id) {
        return this.cache.get(id);
    }
    getByEmail(email) {
        for (const [, user] of this.cache.entries()) {
            if (user.email === email)
                return user;
        }
        return undefined;
    }
    getByUsername(username) {
        for (const [, user] of this.cache.entries()) {
            if (user.username === username)
                return user;
        }
        return undefined;
    }
    getByOldId(oldUserId) {
        for (const [, user] of this.cache.entries()) {
            if (user.extraData?.oldUserId === oldUserId)
                return user;
        }
        return undefined;
    }
    getByOpenIDSub(sub) {
        for (const [, user] of this.cache.entries()) {
            if (user.extraData?.authOpenIDSub === sub)
                return user;
        }
        return undefined;
    }
    set(user) {
        user.fromCache = true;
        this.cache.set(user.id, user);
    }
    delete(userId) {
        this.cache.delete(userId);
    }
    maybeInvalidate(user) {
        if (!user.fromCache) {
            this.delete(user.id);
        }
    }
}
exports.userCache = new UserCache();
let User = User_1 = class User extends sequelize_typescript_1.Model {
    get isRoot() {
        return this.type === 'root';
    }
    get authOpenIDSub() {
        return this.extraData?.authOpenIDSub;
    }
    set authOpenIDSub(sub) {
        if (!this.extraData) {
            this.extraData = {};
        }
        this.extraData.authOpenIDSub = sub;
    }
    static async checkUserExistsWithUsername(username) {
        const user = await User_1.findOne({
            where: { username: username.toLowerCase() },
        });
        return !!user;
    }
    static getDefaultPermissionsForUserType(type) {
        return {
            download: true,
            update: type === 'root' || type === 'admin',
            delete: type === 'root',
            upload: type === 'root' || type === 'admin',
            createEreader: type === 'root' || type === 'admin',
            accessAllLibraries: true,
            accessAllTags: true,
            accessExplicitContent: type === 'root' || type === 'admin',
            selectedTagsNotAccessible: false,
            librariesAccessible: [],
            itemTagsSelected: [],
        };
    }
    static getSampleAbsPermissions() {
        const samplePermissions = {};
        for (const key in User_1.permissionMapping) {
            if (key === 'allowedLibraries') {
                samplePermissions[key] = ['5406ba8a-16e1-451d-96d7-4931b0a0d966', '918fd848-7c1d-4a02-818a-847435a879ca'];
            }
            else if (key === 'allowedTags') {
                samplePermissions[key] = ['ExampleTag', 'AnotherTag', 'ThirdTag'];
            }
            else {
                samplePermissions[key] = false;
            }
        }
        return JSON.stringify(samplePermissions, null, 2);
    }
    static async getUserByUsername(username) {
        const cachedUser = exports.userCache.getByUsername(username.toLowerCase());
        if (cachedUser)
            return cachedUser;
        const user = await User_1.findOne({
            where: { username: username.toLowerCase() },
        });
        if (user) {
            exports.userCache.set(user);
        }
        return user;
    }
    static async getUserByEmail(email) {
        const cachedUser = exports.userCache.getByEmail(email.toLowerCase());
        if (cachedUser)
            return cachedUser;
        const user = await User_1.findOne({
            where: { email: email.toLowerCase() },
        });
        if (user) {
            exports.userCache.set(user);
        }
        return user;
    }
    static async getUserById(userId) {
        const cachedUser = exports.userCache.getById(userId);
        if (cachedUser)
            return cachedUser;
        const user = await User_1.findByPk(userId);
        if (user) {
            exports.userCache.set(user);
        }
        return user;
    }
    static async getUserByIdOrOldId(userId) {
        let user = await User_1.getUserById(userId);
        if (user)
            return user;
        user = exports.userCache.getByOldId(userId);
        if (user)
            return user;
        user = await User_1.findOne({
            where: {
                extraData: {
                    oldUserId: userId,
                },
            },
        });
        if (user) {
            exports.userCache.set(user);
        }
        return user;
    }
    static async getUserByOpenIDSub(sub) {
        const cachedUser = exports.userCache.getByOpenIDSub(sub);
        if (cachedUser)
            return cachedUser;
        const user = await User_1.findOne({
            where: {
                extraData: {
                    authOpenIDSub: sub,
                },
            },
        });
        if (user) {
            exports.userCache.set(user);
        }
        return user;
    }
    static async createRootUser(username, pash) {
        const userId = (0, uuid_1.v4)();
        const newUser = await User_1.create({
            id: userId,
            type: 'root',
            username,
            pash,
            token: '',
            isActive: true,
            permissions: User_1.getDefaultPermissionsForUserType('root'),
            bookmarks: [],
            extraData: {
                seriesHideFromContinueListening: [],
            },
        });
        return newUser;
    }
    get isAdminOrUp() {
        return this.type === 'root' || this.type === 'admin';
    }
    checkCanAccessLibrary(libraryId) {
        if (this.isAdminOrUp)
            return true;
        if (this.permissions.accessAllLibraries)
            return true;
        return this.permissions.librariesAccessible.includes(libraryId);
    }
    checkCanAccessLibraryItem(libraryItem) {
        if (!libraryItem)
            return false;
        return this.checkCanAccessLibrary(libraryItem.libraryId);
    }
    toJSONForBrowser() {
        const json = {
            id: this.id,
            username: this.username,
            email: this.email,
            type: this.type,
            isActive: this.isActive,
            isLocked: this.isLocked,
            lastSeen: this.lastSeen,
            permissions: this.permissions,
            bookmarks: this.bookmarks,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json;
    }
    toJSONForPublic(sessions) {
        return {
            id: this.id,
            username: this.username,
            type: this.type,
            isActive: this.isActive,
            isLocked: this.isLocked,
            lastSeen: this.lastSeen,
            createdAt: this.createdAt,
        };
    }
    static clearCacheOnUpdate(user) {
        exports.userCache.maybeInvalidate(user);
    }
    async $afterSave() {
        exports.userCache.set(this);
    }
    async $afterDestroy() {
        exports.userCache.delete(this.id);
    }
};
exports.User = User;
User.accountTypes = ['admin', 'user', 'guest'];
User.permissionMapping = {
    canDownload: 'download',
    canUpload: 'upload',
    canDelete: 'delete',
    canUpdate: 'update',
    canAccessExplicitContent: 'accessExplicitContent',
    canAccessAllLibraries: 'accessAllLibraries',
    canAccessAllTags: 'accessAllTags',
    canCreateEReader: 'createEreader',
    tagsAreDenylist: 'selectedTagsNotAccessible',
    allowedLibraries: 'librariesAccessible',
    allowedTags: 'itemTagsSelected',
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "pash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: 'user',
    }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isLocked", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "lastSeen", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], User.prototype, "permissions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "bookmarks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "extraData", void 0);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "clearCacheOnUpdate", null);
exports.User = User = User_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true,
    })
], User);
//# sourceMappingURL=user.model.js.map