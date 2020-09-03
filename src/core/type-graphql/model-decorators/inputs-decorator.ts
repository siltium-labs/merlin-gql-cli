import { ModelDecoratorMetadataKeys } from './model-decorator.keys';
import { BaseInputFields } from '../models/base-input-fields';

export const Inputs = (inputsType: typeof BaseInputFields)=> {
    return function (target: Function) {
        Reflect.defineMetadata(ModelDecoratorMetadataKeys.Input, inputsType, target);
    };
}