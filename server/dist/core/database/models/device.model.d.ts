import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class Device extends Model<Device> {
    id: string;
    deviceId: string;
    clientName: string;
    clientVersion: string;
    ipAddress: string;
    deviceName: string;
    deviceVersion: string;
    extraData: {
        manufacturer?: string;
        model?: string;
        osName?: string;
        osVersion?: string;
        browserName?: string;
    };
    userId: string;
    user: User;
    static getOldDeviceByDeviceId(deviceId: string): Promise<any>;
    toOldJSON(): any;
}
