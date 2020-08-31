import { ModelDecoratorMetadataKeys } from './keys';
import { BaseFilterFields } from './../models/base-filter-fields.model';


export function Filters(filtersType: typeof BaseFilterFields) {
    return function (target: Function) {
        Reflect.defineMetadata(ModelDecoratorMetadataKeys.Filter, filtersType, target.constructor);
    };
}