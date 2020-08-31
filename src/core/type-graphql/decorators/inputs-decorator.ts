import { ModelDecoratorMetadataKeys } from './keys';
import { BaseInputFields } from '../models/base-input.model';

export function Inputs(inputsType: typeof BaseInputFields) {
    return function (target: Function) {
        Reflect.defineMetadata(ModelDecoratorMetadataKeys.Input, inputsType, target.constructor);
    };
}