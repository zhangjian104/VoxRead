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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const openid_client_1 = require("openid-client");
const logger_service_1 = require("../../core/logger/logger.service");
const auth_service_1 = require("../auth.service");
let OidcStrategy = class OidcStrategy extends (0, passport_1.PassportStrategy)(openid_client_1.Strategy, 'oidc') {
    constructor(authService, logger) {
        super({
            client: null,
            params: {
                scope: 'openid profile email',
            },
            passReqToCallback: true,
        });
        this.authService = authService;
        this.logger = logger;
        this.openIdAuthSession = new Map();
    }
    async initializeClient(serverSettings) {
        try {
            if (!serverSettings.isOpenIDAuthSettingsValid) {
                throw new Error('OpenID Connect 设置无效');
            }
            openid_client_1.custom.setHttpOptionsDefaults({ timeout: 10000 });
            const issuer = new openid_client_1.Issuer({
                issuer: serverSettings.authOpenIDIssuerURL,
                authorization_endpoint: serverSettings.authOpenIDAuthorizationURL,
                token_endpoint: serverSettings.authOpenIDTokenURL,
                userinfo_endpoint: serverSettings.authOpenIDUserInfoURL,
                jwks_uri: serverSettings.authOpenIDJwksURL,
                end_session_endpoint: serverSettings.authOpenIDLogoutURL,
            });
            this.client = new issuer.Client({
                client_id: serverSettings.authOpenIDClientID,
                client_secret: serverSettings.authOpenIDClientSecret,
                id_token_signed_response_alg: serverSettings.authOpenIDTokenSigningAlgorithm,
            });
            this.logger.info('[OidcStrategy] OpenID Connect 客户端初始化成功');
        }
        catch (error) {
            this.logger.error('[OidcStrategy] 初始化 OIDC 客户端失败:', error);
            throw error;
        }
    }
    async validate(req, tokenset, userinfo, done) {
        let isNewUser = false;
        let user = null;
        try {
            this.logger.debug('[OidcStrategy] OpenID 回调 userinfo:', JSON.stringify(userinfo, null, 2));
            if (!userinfo.sub) {
                throw new Error('Invalid userinfo, no sub');
            }
            if (!this.validateGroupClaim(userinfo)) {
                throw new Error('Group claim validation failed');
            }
            user = await this.authService.findOrCreateOidcUser(userinfo);
            if (!user) {
                throw new Error('Failed to find or create user');
            }
            if (!user.isActive) {
                throw new Error('User is not active');
            }
            await this.authService.updateUserFromOidcClaims(user, userinfo);
            user.openid_id_token = tokenset.id_token;
            this.logger.info(`[OidcStrategy] 用户 "${user.username}" OIDC 认证成功`);
            return done(null, user);
        }
        catch (error) {
            this.logger.error('[OidcStrategy] OIDC 回调错误:', error);
            if (isNewUser && user) {
                await this.authService.deleteUser(user.id);
            }
            return done(null, null);
        }
    }
    validateGroupClaim(userinfo) {
        const groupClaimName = global.ServerSettings?.authOpenIDGroupClaim;
        if (!groupClaimName) {
            return true;
        }
        if (!userinfo[groupClaimName]) {
            this.logger.warn(`[OidcStrategy] 群组声明 ${groupClaimName} 在 userinfo 中不存在`);
            return false;
        }
        return true;
    }
    getClient() {
        return this.client;
    }
    saveAuthSession(state, data) {
        this.openIdAuthSession.set(state, data);
    }
    getAuthSession(state) {
        const session = this.openIdAuthSession.get(state);
        this.openIdAuthSession.delete(state);
        return session;
    }
};
exports.OidcStrategy = OidcStrategy;
exports.OidcStrategy = OidcStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        logger_service_1.LoggerService])
], OidcStrategy);
//# sourceMappingURL=oidc.strategy.js.map