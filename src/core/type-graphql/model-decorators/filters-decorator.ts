import { ModelDecoratorMetadataKeys } from './model-decorator.keys';
import { BaseFilterFields } from '../models/base-filter-fields';


export const Filters = (filtersType: typeof BaseFilterFields)=> {
    return function (target: Function) {
        Reflect.defineMetadata(ModelDecoratorMetadataKeys.Filter, filtersType, target);
    };
}

