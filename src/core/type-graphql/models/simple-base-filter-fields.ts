import { BaseFilterFields } from './base-filter-fields';
import { Field, ID, InputType, ClassType } from "type-graphql";
import { FilteredID, FilteredString, FilteredDate, FilteredBoolean } from '../resolvers/filter-field';

@InputType({isAbstract:true})
export class SimpleBaseFilterFields extends BaseFilterFields {
    @Field((type) => FilteredID, { nullable: true })
    id?: number;
  
    @Field((type) => FilteredDate, { nullable: true })
    created?: Date;
  
    @Field((type) => FilteredDate, { nullable: true })
    updated?: Date;
  
    @Field((type) => FilteredBoolean, { nullable: true })
    deleted?: boolean;
}
