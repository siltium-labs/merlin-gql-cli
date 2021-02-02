import { FieldNode, GraphQLResolveInfo, SelectionNode } from "graphql";
import {
  IAndFilterCriteria,
  IFilterCriteria,
  IOrFilterCriteria,
  IPropertyFilterCriteria,
  IQueryData,
  isFilterRelation,
  ISortCriteria,
  isQueryAnd,
  isQueryOr,
  ISubQueryData,
} from "../type-graphql/resolvers/query-resolver";
import { BaseModel, IRelationDefinition } from "./../database/base.model";
import { isSortRelation } from "./../type-graphql/resolvers/query-resolver";

/**
 *
 * Parses GraphQL Info object an converts to a tree like structure containing fields and entities
 *
 * @param {FieldNode} info
 * @param {Array<IRelationDefinition>} relations
 * @returns {IQueryData}
 */
export const getQueryData = (
  info: FieldNode,
  modelType: typeof BaseModel,
  sort?: ISortCriteria,
  omitedFields?: Array<string>
): IQueryData => {
  const queryData: IQueryData = {
    selectedFields: [],
    relatedEntities: [],
  };
  const allRequestedFields = <Array<string>>info.selectionSet?.selections
    .map((f: any) => <string>f.name.value)
    .filter((f) => !f.includes("__"))
    .filter((f) => !omitedFields || !omitedFields.includes(f));
  const mainEntityRequestedFields = allRequestedFields.filter(
    (field) =>
      !modelType
        .getRelations()
        .map((r) => r.name)
        .includes(field) && Object.keys(new modelType()).includes(field)
  );
  queryData.selectedFields = [
    ...mainEntityRequestedFields,
    //We don't need sort attributes in select, if this is not true we have to
    //manage this because it is adding relations instead of relation attributes
    //📝  https://stackoverflow.com/a/20357066
    //...(sort ? getAllPropertiesFromSort(sort) : []),
  ];
  const relatedEntities = allRequestedFields.filter((field) =>
    modelType
      .getRelations()
      .map((r) => r.name)
      .includes(field)
  );

  if (relatedEntities?.length > 0) {
    relatedEntities.map((related) => {
      const relatedInfo = (<Array<FieldNode>>(
        info.selectionSet?.selections
      )).find((selection: FieldNode) => selection?.name.value === related);
      if (relatedInfo) {
        const relatedModel = modelType
          .getRelations()
          .find((r) => r.name === related);
        if (relatedModel) {
          const relatedFieldsFromInfo = getQueryData(
            relatedInfo,
            relatedModel.model,
            undefined,
            omitedFields
          );
          const subqueryData: ISubQueryData = {
            entityName: related,
            data: relatedFieldsFromInfo,
          };
          queryData.relatedEntities.push(subqueryData);
        }
      }
    });
  }
  return queryData;
};

export interface GraphQLPartialResolveInfo {
  fieldNodes: [
    {
      selectionSet: {
        selections: readonly SelectionNode[];
      };
    }
  ];
}

export const getInfoFromSubfield = (
  subfield: string,
  info: GraphQLInfo
): GraphQLPartialResolveInfo | null => {
  try {
    const subnode = <FieldNode>(
      info.fieldNodes[0].selectionSet?.selections.find(
        (node) => (<FieldNode>node).name.value === subfield
      )
    );
    return {
      fieldNodes: [
        {
          selectionSet: {
            selections: subnode.selectionSet?.selections ?? [],
          },
        },
      ],
    };
  } catch (e) {
    return null;
  }
};

export const getQueryDataFromFilters = (
  queryData: IQueryData | null,
  filter: IFilterCriteria | null,
  relations: Array<IRelationDefinition>
): IQueryData => {
  const data = queryData ?? {
    relatedEntities: [],
    selectedFields: [],
  };

  let dictionary;
  if (filter instanceof Array) {
    dictionary = filter.reduce((acc, value, idx) => {
      return { ...acc, [idx]: value };
    });
  }
  filter = dictionary ? dictionary : filter;

  const currentLevelProperties = filter ? isFilterRelation(filter) : [];

  relations
    .filter((r) => currentLevelProperties.includes(r.name))
    .map((r) => {
      const existingRelation = data.relatedEntities.find(
        (e) => e.entityName === r.name
      );
      const subrelations = getQueryDataFromFilters(
        existingRelation?.data ?? null,
        (filter as any)[r.name],
        r.model.getRelations()
      );
      if (existingRelation) {
        const existingSubqueryData = existingRelation.data.relatedEntities.find(
          (sr) => sr.entityName === r.name
        );
        if (existingSubqueryData) {
          existingSubqueryData.data.relatedEntities = [
            ...existingSubqueryData.data.relatedEntities,
            ...subrelations.relatedEntities.filter(
              (sr) =>
                !existingSubqueryData.data.relatedEntities
                  .map((en) => en.entityName)
                  .includes(sr.entityName)
            ),
          ];
        }
      } else {
        const subqueryData: ISubQueryData = {
          entityName: r.name,
          data: subrelations,
        };
        data.relatedEntities.push(subqueryData);
      }
    });
  return data;
};

export const getQueryDataFromSorts = (
  queryData: IQueryData | null,
  sort: ISortCriteria,
  relations: Array<IRelationDefinition>,
  positionInsideProperty: number = 0
): IQueryData => {
  const data = queryData ?? {
    relatedEntities: [],
    selectedFields: [],
  };

  const currentLevelProperties = sort ? isSortRelation(sort) : [];

  relations
    .filter((r) => currentLevelProperties.includes(r.name))
    .map((r) => {
      const existingRelation = data.relatedEntities.find(
        (e) => e.entityName === r.name
      );
      const subrelations = getQueryDataFromSorts(
        existingRelation?.data ?? null,
        (sort as any)[r.name],
        r.model.getRelations(),
        positionInsideProperty + 1
      );
      if (existingRelation) {
        const existingSubqueryData = existingRelation.data.relatedEntities.find(
          (sr) => sr.entityName === r.name
        );
        if (existingSubqueryData) {
          existingSubqueryData.data.relatedEntities = [
            ...existingSubqueryData.data.relatedEntities,
            ...subrelations.relatedEntities.filter(
              (sr) =>
                !existingSubqueryData.data.relatedEntities
                  .map((en) => en.entityName)
                  .includes(sr.entityName)
            ),
          ];
        }
      } else {
        const subqueryData: ISubQueryData = {
          entityName: r.name,
          data: subrelations,
        };
        data.relatedEntities.push(subqueryData);
      }
    });
  return data;
};

export const getAllPropertiesFromFilter = (
  filter: IFilterCriteria | null
): Array<string> => {
  if (!filter) return [];
  if (!isQueryOr(filter) && !isQueryAnd(filter)) {
    const propFilter = <IPropertyFilterCriteria>filter;
    return Object.keys(propFilter);
  } else if (isQueryOr(filter)) {
    const orFilter = <IOrFilterCriteria>filter;
    return [
      ...orFilter.or
        .map(getAllPropertiesFromFilter)
        .reduce((p, n) => p.concat(n), []),
    ];
  } else if (isQueryAnd(filter)) {
    const andFilter = <IAndFilterCriteria>filter;
    return [
      ...andFilter.and
        .map(getAllPropertiesFromFilter)
        .reduce((p, n) => p.concat(n), []),
    ];
  } else return [];
};

export const getAllPropertiesFromSort = (
  sort: ISortCriteria | null
): Array<string> => (sort ? Object.keys(sort) : []);

export type GraphQLInfo = GraphQLResolveInfo | GraphQLPartialResolveInfo;
