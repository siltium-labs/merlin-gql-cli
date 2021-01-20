import { SortField } from "./../models/base-sort-fields";
import { FieldNode } from "graphql";
import { Brackets, WhereExpression, SelectQueryBuilder } from "typeorm";
import * as uuid from "uuid";
import { BaseModel } from "../../database/base.model";
import { registerEnumType } from "type-graphql";

export const isPageInfoFieldNode = (node: FieldNode) => {
  return node.name.value === "pageInfo";
};

export const parseFilter = (filter: string | null): IFilterCriteria | null =>
  filter ? <IFilterCriteria>JSON.parse(filter) : null;

export const parseSort = (sort: string | null): ISortCriteria | null =>
  sort ? <ISortCriteria>JSON.parse(sort) : null;

export const criteriaToQbWhere = (
  prefix: string,
  qb: WhereExpression,
  filter: IFilterCriteria | null,
  type: "and" | "or" = "and"
): WhereExpression => {
  if (!filter) return qb;

  let relations = isFilterRelation(filter as IPropertyFilterCriteria);

  relations.map((relation) => {
    const criteria = (filter as any)[relation];
    const keysAttr = Object.keys(criteria);
    return Object.keys(criteria).map((attribute) => {
      return qb.andWhere(
        new Brackets((bqb) => {
          //criteria[attribute].map((criterion) => exports.criteriaToQbWhere(attribute, bqb, criterion));
          criteriaToQbWhere(prefix + relation, bqb, criteria);
          delete (filter as any)[relation];
          relations = [];
        })
      );
    });
  });

  if (!filter) return qb;

  if (
    !isQueryAnd(filter) &&
    !isQueryOr(filter) &&
    (!relations || relations.length <= 0)
  ) {
    const criteria = <IPropertyFilterCriteria>filter;
    const formattedCriteria = Object.keys(criteria).map((property) => ({
      property,
      type: criteria[property].type,
      value: criteria[property].value,
    }));
    formattedCriteria.map((criterion) => {
      const propName = dotSplitedPropToQbAlias(criterion.property, prefix);
      console.log(criterion);
      const operator = criterion.type;
      const propUID = uuid.v1();
      let expression: string = "";
      let values: { [prop: string]: any } = {};
      switch (operator) {
        case FilterTypesEnum.EQUALS:
          expression = `${propName} = :${propUID}`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.NOT_EQUALS:
          expression = `${propName} != :${propUID}`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.IS_NULL:
          expression = `${propName} is null`;
          break;
        case FilterTypesEnum.IS_NOT_NULL:
          expression = `${propName} is not null`;
          break;
        case FilterTypesEnum.GREATHER_THAN:
          expression = `${propName} > :${propUID}`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.GREATHER_THAN_EQUALS:
          expression = `${propName} >= :${propUID}`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.LOWER_THAN:
          expression = `${propName} < :${propUID}`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.LOWER_THAN_EQUALS:
          expression = `${propName} <= :${propUID}`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.IN:
          expression = `${propName} IN (:...${propUID})`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.NOT_IN:
          expression = `${propName} NOT IN (:...${propUID})`;
          values = { [propUID]: criterion.value };
          break;
        case FilterTypesEnum.LIKE:
          expression = `${propName} like :${propUID}`;
          values = { [propUID]: "%" + criterion.value + "%" };
          break;
        default:
          throw "Invalid operator";
      }

      if (type === "and") {
        qb.andWhere(expression, values);
      } else {
        qb.orWhere(expression, values);
      }
    });

    return qb;
  } else if (isQueryOr(filter)) {
    const orCriteria = <IOrFilterCriteria>filter;
    if (type === "and") {
      return qb.andWhere(
        new Brackets((bqb) => {
          orCriteria.or.map((criterion) =>
            criteriaToQbWhere(prefix, bqb, criterion, "or")
          );
        })
      );
    } else {
      return qb.orWhere(
        new Brackets((bqb) => {
          orCriteria.or.map((criterion) =>
            criteriaToQbWhere(prefix, bqb, criterion, "or")
          );
        })
      );
    }
  } else if (isQueryAnd(filter)) {
    const andCriteria = <IAndFilterCriteria>filter;
    if (type === "and") {
      return qb.andWhere(
        new Brackets((bqb) => {
          andCriteria.and.map((criterion) =>
            criteriaToQbWhere(prefix, bqb, criterion)
          );
        })
      );
    } else {
      return qb.orWhere(
        new Brackets((bqb) => {
          andCriteria.and.map((criterion) =>
            criteriaToQbWhere(prefix, bqb, criterion)
          );
        })
      );
    }
  } else {
    return qb;
  }
};

export const criteriaToQbOrderBy = (
  prefix: string,
  qb: SelectQueryBuilder<BaseModel>,
  sort: ISortCriteria | null
): SelectQueryBuilder<BaseModel> => {
  if (!sort) return qb;
  Object.keys(sort)

    .map((property) => ({ property: property, directives: sort[property] }))
    .sort((a, b) => b.directives.priority - a.directives.priority)
    .map((criterion) => {
      const propName = dotSplitedPropToQbAlias(criterion.property, prefix);
      qb.addOrderBy(
        propName,
        criterion.directives.direction === SortDirectionsEnum.DESC
          ? "DESC"
          : "ASC"
      );
    });
  return qb;
};

export const dotSplitedPropToQbAlias = (
  prop: string,
  prefix: string
): string => {
  let propPrefix = "";
  const dotSplitedProperty = prop.split(".");
  let propName = "";
  if (dotSplitedProperty.length > 1) {
    propPrefix =
      dotSplitedProperty.slice(0, dotSplitedProperty.length - 1).join("") + ".";
    propName =
      prefix + propPrefix + dotSplitedProperty[dotSplitedProperty.length - 1];
  } else {
    propName = prefix + "." + dotSplitedProperty[dotSplitedProperty.length - 1];
  }
  return propName;
};

export interface ISubQueryData {
  entityName: string;
  data: IQueryData;
}

export interface IQueryData {
  selectedFields: Array<string>;
  relatedEntities: Array<ISubQueryData>;
}

export interface IQueryCriteria {
  skip?: number;
  max?: number;
  filter?: IFilterCriteria;
  sort?: ISortCriteria;
}

export type IFilterCriteria =
  | IPropertyFilterCriteria
  | IAndFilterCriteria
  | IOrFilterCriteria;

type FilteredProperty = {
  [key: string]:
    | {
        value: any;
        type: FilterTypesEnum;
      }
    | FilteredProperty;
};
export interface IPropertyFilterCriteria extends FilteredProperty {}
export interface IAndFilterCriteria {
  and: IFilterCriteria[];
}

export interface IOrFilterCriteria {
  or: IFilterCriteria[];
}

export enum FilterTypesEnum {
  EQUALS = "eq",
  IS_NULL = "null",
  IS_NOT_NULL = "not_null",
  GREATHER_THAN = "gt",
  GREATHER_THAN_EQUALS = "gte",
  LOWER_THAN = "lt",
  LOWER_THAN_EQUALS = "lte",
  NOT_EQUALS = "neq",
  IN = "in",
  NOT_IN = "not_in",
  LIKE = "like",
}

registerEnumType(FilterTypesEnum, {
  name: "FilterType", // this one is mandatory
  description: "More advanced filter", // this one is optional
});

export const isQueryOr = (criteria: IFilterCriteria) =>
  (<IOrFilterCriteria>criteria).or;

export const isQueryAnd = (criteria: IFilterCriteria) =>
  (<IAndFilterCriteria>criteria).and;

export const isFilterRelation = (
  criteria: IPropertyFilterCriteria
): string[] => {
  const relations = Object.keys(criteria)
    .map((property) => ({
      property,
      type: criteria[property].type,
      value: criteria[property].value,
    }))
    .filter(
      (item) =>
        item.property !== "and" &&
        item.property !== "or" &&
        (item.type === undefined || typeof item.type !== "string")
    )
    .map((item) => item.property);
  return relations;
};

export enum SortDirectionsEnum {
  ASC = "asc",
  DESC = "desc",
}

registerEnumType(SortDirectionsEnum, {
  name: "SortDirection", // this one is mandatory
  description: "The direction on which you wish to sort..", // this one is optional
});

type SortedProperties = {
  [key: string]: SortField;
};

export interface ISortCriteria extends SortedProperties {}
