import { Field, ID, InputType } from "type-graphql";
import { SortDirectionsEnum } from "../resolvers/query-resolver";

@InputType({ isAbstract: true })
export class BaseSortFields {}
