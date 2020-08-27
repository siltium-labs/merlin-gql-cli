import {
  ClassType,
  ObjectType,
  Field,
  Int,
  ArgsType,
  InputType,
} from "type-graphql";

@ObjectType({ isAbstract: true })
export class PageInfo {
  @Field((type) => Int)
  total: number = 0;
}

export default function Paginated<TModel>(TClass: ClassType<TModel>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponse {
    // here we use the runtime argument
    @Field((type) => [TClass])
    // and here the generic type
    result: TModel[] = [];

    @Field((type) => PageInfo)
    pageInfo: PageInfo = {
      total: 0,
    };
  }
  return PaginatedResponse;
}

// @ArgsType()
// export class PaginationCriteria {
//   @Field({ nullable: true })
//   skip?: number;

//   @Field({ nullable: true })
//   max?: number;
// }

export function createPaginationCriteria<TFilter, TSort>(
  TFilterClass: ClassType<TFilter>,
  TSortClass: ClassType<TSort>
) {
  @InputType({ isAbstract: true })
  abstract class PaginatorCriteria {
    @Field((type) => TFilterClass, { nullable: true })
    filter?: TFilter; //SearchFilterFields;

    @Field((type) => TSortClass, { nullable: true })
    sort?: TSort;

    @Field({ nullable: true })
    skip?: number;

    @Field({ nullable: true })
    max?: number;
  }

  return PaginatorCriteria;
}
