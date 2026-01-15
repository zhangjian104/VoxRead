import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export interface ApiKeyPermissions {
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
declare class ApiKeyCache {
    private cache;
    constructor();
    getById(id: string): ApiKey | undefined;
    set(apiKey: ApiKey): void;
    delete(apiKeyId: string): void;
    maybeInvalidate(apiKey: ApiKey): void;
}
export declare const apiKeyCache: ApiKeyCache;
export declare class ApiKey extends Model {
    id: string;
    name: string;
    description: string;
    expiresAt: Date;
    lastUsedAt: Date;
    isActive: boolean;
    permissions: ApiKeyPermissions;
    userId: string;
    createdByUserId: string;
    user: User;
    createdByUser: User;
    static getDefaultPermissions(): ApiKeyPermissions;
    static mergePermissionsWithDefault(reqPermissions: Partial<ApiKeyPermissions>): ApiKeyPermissions;
    static deactivateExpiredApiKeys(): Promise<number>;
    static generateApiKey(tokenSecret: string, keyId: string, name: string, expiresIn?: number): Promise<string | null>;
    static getById(apiKeyId: string): Promise<ApiKey | null>;
    static getUserApiKeys(userId: string): Promise<ApiKey[]>;
    isExpired(): boolean;
    updateLastUsed(): Promise<void>;
    deactivate(): Promise<void>;
    activate(): Promise<void>;
    toJSON(): any;
    $afterUpdate(): Promise<void>;
    $afterSave(): Promise<void>;
    $afterDestroy(): Promise<void>;
}
export {};
