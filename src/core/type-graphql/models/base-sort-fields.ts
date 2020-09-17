import { Field, InputType, Int } from "type-graphql";
import { SortDirectionsEnum } from "../resolvers/query-resolver";

@InputType()
export class SortField{
    @Field((type) => SortDirectionsEnum, { nullable: true })
    direction:SortDirectionsEnum = SortDirectionsEnum.ASC;
    @Field((type) => Int, { nullable: true })
    priority:number = 1;
}

@InputType({ isAbstract: true })
export class BaseSortFields {}
