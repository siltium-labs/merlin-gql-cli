import { ModelDecoratorMetadataKeys } from './model-decorator.keys';
import { BaseInputFields } from '../models/base-input-fields';

export const Inputs = (inputsType?: typeof BaseInputFields, updatesType?: typeof BaseInputFields)=> {
    return function (target: Function) {
        if(inputsType){
            Reflect.defineMetadata(ModelDecoratorMetadataKeys.Input, inputsType, target);
        }
        if(updatesType){
            Reflect.defineMetadata(ModelDecoratorMetadataKeys.Update, inputsType, target);
        }        
    };
}