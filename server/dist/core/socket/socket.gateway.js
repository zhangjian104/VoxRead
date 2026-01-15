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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
let SocketGateway = class SocketGateway {
    constructor(logger) {
        this.logger = logger;
        this.clients = new Map();
    }
    afterInit(server) {
        this.logger.info('[SocketGateway] WebSocket 服务器初始化完成');
    }
    handleConnection(socket) {
        const client = {
            id: socket.id,
            socket,
            connected_at: Date.now(),
        };
        this.clients.set(socket.id, client);
        this.logger.debug(`[SocketGateway] 客户端已连接: ${socket.id}`);
    }
    handleDisconnect(socket) {
        const client = this.clients.get(socket.id);
        if (client?.user) {
            this.logger.info(`[SocketGateway] 用户 "${client.user.username}" 断开连接 (${socket.id})`);
        }
        else {
            this.logger.debug(`[SocketGateway] 客户端断开连接: ${socket.id}`);
        }
        this.clients.delete(socket.id);
    }
    authenticateClient(socketId, user) {
        const client = this.clients.get(socketId);
        if (client) {
            client.user = user;
            this.logger.info(`[SocketGateway] 用户 "${user.username}" 已认证 (${socketId})`);
        }
    }
    getUsersOnline() {
        const onlineUsersMap = {};
        this.clients.forEach((client) => {
            if (client.user) {
                if (onlineUsersMap[client.user.id]) {
                    onlineUsersMap[client.user.id].connections++;
                }
                else {
                    onlineUsersMap[client.user.id] = {
                        ...client.user.toJSONForPublic?.() || client.user,
                        connections: 1,
                    };
                }
            }
        });
        return Object.values(onlineUsersMap);
    }
    getClientsForUser(userId) {
        const clients = [];
        this.clients.forEach((client) => {
            if (client.user?.id === userId) {
                clients.push(client);
            }
        });
        return clients;
    }
    emitter(event, data, filter) {
        this.clients.forEach((client) => {
            if (client.user) {
                if (filter && !filter(client.user)) {
                    return;
                }
                client.socket.emit(event, data);
            }
        });
    }
    clientEmitter(userId, event, data) {
        const clients = this.getClientsForUser(userId);
        if (clients.length === 0) {
            this.logger.debug(`[SocketGateway] clientEmitter - 未找到用户 ${userId} 的客户端`);
            return;
        }
        clients.forEach((client) => {
            client.socket.emit(event, data);
        });
    }
    adminEmitter(event, data) {
        this.emitter(event, data, (user) => user.isAdminOrUp === true || user.type === 'admin' || user.type === 'root');
    }
    emitterForLibrary(libraryId, event, data) {
        this.emitter(event, data, (user) => {
            if (user.isAdminOrUp)
                return true;
            return user.librariesAccessible?.includes?.(libraryId) || false;
        });
    }
    emitToRoom(room, event, data) {
        this.server.to(room).emit(event, data);
    }
    joinRoom(socketId, room) {
        const client = this.clients.get(socketId);
        if (client) {
            client.socket.join(room);
            this.logger.debug(`[SocketGateway] 客户端 ${socketId} 加入房间: ${room}`);
        }
    }
    leaveRoom(socketId, room) {
        const client = this.clients.get(socketId);
        if (client) {
            client.socket.leave(room);
            this.logger.debug(`[SocketGateway] 客户端 ${socketId} 离开房间: ${room}`);
        }
    }
    getClientCount() {
        return this.clients.size;
    }
    getAuthenticatedClientCount() {
        let count = 0;
        this.clients.forEach((client) => {
            if (client.user)
                count++;
        });
        return count;
    }
    disconnectUser(userId, reason) {
        const clients = this.getClientsForUser(userId);
        clients.forEach((client) => {
            client.socket.disconnect(true);
            this.logger.info(`[SocketGateway] 断开用户 ${userId} 的连接: ${reason || '无原因'}`);
        });
    }
    broadcast(event, data) {
        this.server.emit(event, data);
    }
    handlePing(socket) {
        return 'pong';
    }
    handleAuth(data, socket) {
        this.logger.debug(`[SocketGateway] 收到认证请求: ${socket.id}`);
        return { success: true };
    }
    handleLogSubscribe(data, socket) {
        const client = this.clients.get(socket.id);
        if (client?.user?.isAdminOrUp) {
            socket.join('log-listeners');
            this.logger.debug(`[SocketGateway] 用户 ${client.user.username} 订阅日志`);
            return { success: true };
        }
        return { success: false, error: 'Unauthorized' };
    }
    handleLogUnsubscribe(socket) {
        socket.leave('log-listeners');
        this.logger.debug(`[SocketGateway] 客户端 ${socket.id} 取消订阅日志`);
        return { success: true };
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", String)
], SocketGateway.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('auth'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleAuth", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log_subscribe'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleLogSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('log_unsubscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleLogUnsubscribe", null);
exports.SocketGateway = SocketGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    }),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map