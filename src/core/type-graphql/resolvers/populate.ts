import { SelectQueryBuilder } from "typeorm";
import { ISubQueryData } from "./query-resolver";

export const populate = (
    entityAlias: string,
    qb: SelectQueryBuilder<any>,
    relation: ISubQueryData
): SelectQueryBuilder<any> => {
    const relatedAalias = entityAlias + relation.entityName;
    qb.leftJoin(entityAlias + "." + relation.entityName, relatedAalias);
    qb.addSelect([
        `${relatedAalias}.id`,
        ...relation.data.selectedFields?.map(f => `${relatedAalias}.${f}`)
    ]);
    if (relation.data.relatedEntities) {
        relation.data.relatedEntities?.map(entity => {
            populate(relatedAalias, qb, entity);
        });
    }
    return qb;
};
