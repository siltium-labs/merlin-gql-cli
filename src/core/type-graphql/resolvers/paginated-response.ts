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

export abstract class AbstractPaginatedResponse<TModel> {
  result: TModel[] = [];
  pageInfo: PageInfo = {
    total: 0,
  };
}

export default function Paginated<TModel>(
  TClass: ClassType<TModel>
): typeof AbstractPaginatedResponse {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponse<
    TModel
  > extends AbstractPaginatedResponse<TModel> {
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
export abstract class AbstractPaginatorCriteria<TFilter, TSort> {
  filter?: TFilter; //SearchFilterFields;
  sort?: TSort;
  skip?: number;
  max?: number;
  includeDeleted?: boolean;
}

export function createPaginationCriteria<TFilter, TSort>(
  TFilterClass: ClassType<TFilter>,
  TSortClass: ClassType<TSort>
): typeof AbstractPaginatorCriteria {
  @InputType({ isAbstract: true })
  abstract class PaginatorCriteria<
    TFilter,
    TSort
  > extends AbstractPaginatorCriteria<TFilter, TSort> {
    @Field((type) => TFilterClass, { nullable: true })
    filter?: TFilter; //SearchFilterFields;

    @Field((type) => TSortClass, { nullable: true })
    sort?: TSort;

    @Field((type) => Int, { nullable: true })
    skip?: number;

    @Field((type) => Int, { nullable: true })
    max?: number;

    @Field((type) => Boolean, { nullable: true })
    includeDeleted?: boolean;
  }

  return PaginatorCriteria;
}
