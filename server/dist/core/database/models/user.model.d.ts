import { Model } from 'sequelize-typescript';
export interface AudioBookmark {
    libraryItemId: string;
    title: string;
    time: number;
    createdAt: number;
}
export interface UserPermissions {
    download: boolean;
    update: boolean;
    delete: boolean;
    upload: boolean;
    createEreader: boolean;
    accessAllLibraries: boolean;
    accessAllTags: boolean;
    accessExplicitContent: boolean;
    selectedTagsNotAccessible: boolean;
    librariesAccessible: string[];
    itemTagsSelected: string[];
}
export interface UserExtraData {
    seriesHideFromContinueListening?: string[];
    oldUserId?: string;
    authOpenIDSub?: string;
    [key: string]: any;
}
declare class UserCache {
    private cache;
    constructor();
    getById(id: string): User | undefined;
    getByEmail(email: string): User | undefined;
    getByUsername(username: string): User | undefined;
    getByOldId(oldUserId: string): User | undefined;
    getByOpenIDSub(sub: string): User | undefined;
    set(user: User): void;
    delete(userId: string): void;
    maybeInvalidate(user: User): void;
}
export declare const userCache: UserCache;
export declare class User extends Model {
    id: string;
    username: string;
    email: string;
    pash: string;
    type: 'root' | 'admin' | 'user' | 'guest';
    token: string;
    isActive: boolean;
    isLocked: boolean;
    lastSeen: Date;
    permissions: UserPermissions;
    bookmarks: AudioBookmark[];
    extraData: UserExtraData;
    get isRoot(): boolean;
    get authOpenIDSub(): string | undefined;
    set authOpenIDSub(sub: string | undefined);
    static accountTypes: string[];
    static permissionMapping: {
        canDownload: string;
        canUpload: string;
        canDelete: string;
        canUpdate: string;
        canAccessExplicitContent: string;
        canAccessAllLibraries: string;
        canAccessAllTags: string;
        canCreateEReader: string;
        tagsAreDenylist: string;
        allowedLibraries: string;
        allowedTags: string;
    };
    static checkUserExistsWithUsername(username: string): Promise<boolean>;
    static getDefaultPermissionsForUserType(type: string): UserPermissions;
    static getSampleAbsPermissions(): string;
    static getUserByUsername(username: string): Promise<User | null>;
    static getUserByEmail(email: string): Promise<User | null>;
    static getUserById(userId: string): Promise<User | null>;
    static getUserByIdOrOldId(userId: string): Promise<User | null>;
    static getUserByOpenIDSub(sub: string): Promise<User | null>;
    static createRootUser(username: string, pash: string | null): Promise<User>;
    get isAdminOrUp(): boolean;
    checkCanAccessLibrary(libraryId: string): boolean;
    checkCanAccessLibraryItem(libraryItem: any): boolean;
    toJSONForBrowser(): any;
    toJSONForPublic(sessions?: any[]): any;
    static clearCacheOnUpdate(user: User): void;
    $afterSave(): Promise<void>;
    $afterDestroy(): Promise<void>;
}
export {};
