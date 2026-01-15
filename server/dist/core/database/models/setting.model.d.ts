import { Model } from 'sequelize-typescript';
export declare class Setting extends Model<Setting> {
    key: string;
    value: Record<string, any>;
    static getAllSettings(): Promise<Setting[]>;
    static getByKey(key: string): Promise<Setting>;
    static updateSetting(key: string, value: Record<string, any>): Promise<[Setting, boolean]>;
}
