import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "merlin-gql";

@InputType()
export class PersonFilters extends BaseFilterFields {
    @Field((type) => [PersonFilters], { nullable: true })
    or?: PersonFilters[];

    @Field((type) => [PersonFilters], { nullable: true })
    and?: PersonFilters[];

    @Field((type) => FilteredFloat)
    id: number = 0;
    @Field((type) => FilteredDate)
    created: Date = new Date();
    @Field((type) => FilteredDate, { nullable: true })
    updated?: Date;
    @Field((type) => FilteredBoolean)
    deleted: boolean = false;
    @Field((type) => FilteredString)
    name: string = "";
    @Field((type) => FilteredFloat)
    age: number = 0;
    @Field((type) => FilteredFloat, { nullable: true })
    userId?: number;
    @Field((type) => FilteredDate, { nullable: true })
    deletedDate?: Date;
    @Field((type) => UserFilters, { nullable: true })
    user?: Promise<User>;
}
