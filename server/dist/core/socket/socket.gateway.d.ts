import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from '../logger/logger.service';
export interface SocketClient {
    id: string;
    socket: Socket;
    connected_at: number;
    user?: any;
}
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger;
    server: Server;
    private clients;
    constructor(logger: LoggerService);
    afterInit(server: Server): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    authenticateClient(socketId: string, user: any): void;
    getUsersOnline(): any[];
    getClientsForUser(userId: string): SocketClient[];
    emitter(event: string, data: any, filter?: (user: any) => boolean): void;
    clientEmitter(userId: string, event: string, data: any): void;
    adminEmitter(event: string, data: any): void;
    emitterForLibrary(libraryId: string, event: string, data: any): void;
    emitToRoom(room: string, event: string, data: any): void;
    joinRoom(socketId: string, room: string): void;
    leaveRoom(socketId: string, room: string): void;
    getClientCount(): number;
    getAuthenticatedClientCount(): number;
    disconnectUser(userId: string, reason?: string): void;
    broadcast(event: string, data: any): void;
    handlePing(socket: Socket): string;
    handleAuth(data: any, socket: Socket): {
        success: boolean;
    };
    handleLogSubscribe(data: any, socket: Socket): {
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    };
    handleLogUnsubscribe(socket: Socket): {
        success: boolean;
    };
}
