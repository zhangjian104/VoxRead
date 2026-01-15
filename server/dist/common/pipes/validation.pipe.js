"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseBoolPipe = exports.ParseIntPipe = exports.ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ValidationPipe = class ValidationPipe {
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToInstance)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            const messages = errors.map((error) => {
                return Object.values(error.constraints || {}).join(', ');
            });
            throw new common_1.BadRequestException(`Validation failed: ${messages.join('; ')}`);
        }
        return value;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
};
exports.ValidationPipe = ValidationPipe;
exports.ValidationPipe = ValidationPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationPipe);
let ParseIntPipe = class ParseIntPipe {
    transform(value) {
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new common_1.BadRequestException('Validation failed (numeric string is expected)');
        }
        return val;
    }
};
exports.ParseIntPipe = ParseIntPipe;
exports.ParseIntPipe = ParseIntPipe = __decorate([
    (0, common_1.Injectable)()
], ParseIntPipe);
let ParseBoolPipe = class ParseBoolPipe {
    transform(value) {
        if (value === 'true' || value === '1') {
            return true;
        }
        if (value === 'false' || value === '0') {
            return false;
        }
        throw new common_1.BadRequestException('Validation failed (boolean string is expected)');
    }
};
exports.ParseBoolPipe = ParseBoolPipe;
exports.ParseBoolPipe = ParseBoolPipe = __decorate([
    (0, common_1.Injectable)()
], ParseBoolPipe);
//# sourceMappingURL=validation.pipe.js.map