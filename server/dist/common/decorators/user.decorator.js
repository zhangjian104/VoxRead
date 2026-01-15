"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgent = exports.ClientIp = exports.CurrentLibraryItem = exports.CurrentLibrary = exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
exports.CurrentLibrary = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.library;
});
exports.CurrentLibraryItem = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.libraryItem;
});
exports.ClientIp = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.headers['x-forwarded-for']?.split(',')[0] ||
        request.headers['x-real-ip'] ||
        request.connection?.remoteAddress ||
        request.socket?.remoteAddress ||
        request.ip);
});
exports.UserAgent = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || '';
});
//# sourceMappingURL=user.decorator.js.map