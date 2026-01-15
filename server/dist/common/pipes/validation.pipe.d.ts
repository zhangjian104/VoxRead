import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ValidationPipe implements PipeTransform<any> {
    transform(value: any, { metatype }: ArgumentMetadata): Promise<any>;
    private toValidate;
}
export declare class ParseIntPipe implements PipeTransform<string, number> {
    transform(value: string): number;
}
export declare class ParseBoolPipe implements PipeTransform<string, boolean> {
    transform(value: string): boolean;
}
