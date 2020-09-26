import { SelectQueryBuilder } from "typeorm";
import { ISubQueryData } from "./query-resolver";

export const populate = (
    entityAlias: string,
    idName: string,
    queryBuilder: SelectQueryBuilder<any>,
    relation: ISubQueryData
): SelectQueryBuilder<any> => {
    const relatedAalias = entityAlias + relation.entityName;
    queryBuilder.leftJoin(entityAlias + "." + relation.entityName, relatedAalias);
    queryBuilder.addSelect([
        `${relatedAalias}.${idName}`,
        ...relation.data.selectedFields?.map(f => `${relatedAalias}.${f}`)
    ]);
    if (relation.data.relatedEntities) {
        relation.data.relatedEntities?.map(entity => {
            populate(relatedAalias, idName, queryBuilder, entity);
        });
    }
    return queryBuilder;
};
