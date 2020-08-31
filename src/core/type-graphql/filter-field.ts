import { GraphQLScalarType } from "graphql";
import { ClassType, InputType, Field, ID } from "type-graphql";
import { FilterTypesEnum } from "../query-resolver";

@InputType()
export class FilteredID extends FilterField(ID) {}

@InputType()
export class FilteredString extends FilterField(String) {}

export default function FilterField<TField>(
  TFieldClass: ClassType<TField> | GraphQLScalarType
):any {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @InputType({ isAbstract: true })
  abstract class FilterFieldClass {
    // here we use the runtime argument
    @Field((type) => TFieldClass)
    // and here the generic type
    value: TField | null = null;

    @Field((type) => FilterTypesEnum, {
      nullable: true,
      defaultValue: FilterTypesEnum.EQUALS,
    })
    type?: FilterTypesEnum = FilterTypesEnum.EQUALS;
  }
  return FilterFieldClass;
}
