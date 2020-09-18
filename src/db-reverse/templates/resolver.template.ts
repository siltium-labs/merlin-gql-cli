import {
  toEntityFileName,
  toEntityName,
  toFileName,
  toFiltersName,
  toLocalImport,
  toSortsName,
} from "./../generation/model-generation";
import IGenerationOptions from "../options/generation-options.interface";

// prettier-ignore
export const ResolverTemplate = (
  tscName: string,
  generationOptions: IGenerationOptions
): string => {
    const secureResolverDecorator = generationOptions.secureResolvers ? "@Secure()" : "";
    const secureImport = generationOptions.secureResolvers ? "Secure, " : "";
    const entityName:string = toEntityName(tscName, generationOptions)
    const fileName:string = toFileName(tscName, generationOptions)
    const filtersName:string = toFiltersName(tscName, generationOptions);
    const sortsName:string = toSortsName(tscName, generationOptions);
    return `
    
    import { Resolver } from "type-graphql";
    import { ${entityName} } from "../models/${fileName}/${toEntityFileName(tscName, generationOptions)}";
    import ${toLocalImport(filtersName, generationOptions)} from "../models/${fileName}/${fileName}-filters.model";
    import ${toLocalImport(sortsName, generationOptions)} from "../models/${fileName}/${fileName}-sorts.model";
    import { CreateResolver, DeleteResolver, FindResolver, ListResolver, ${secureImport} UpdateResolver } from "merlin-gql";
    
    const BaseListResolver = ListResolver(${entityName});
    const BaseFindResolver = FindResolver(${entityName});
    const BaseCreateResolver = CreateResolver(${entityName});
    const BaseUpdateResolver = UpdateResolver(${entityName});
    const BaseDeleteResolver = DeleteResolver(${entityName});
    
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}ListResolver extends BaseListResolver<${entityName}, ${filtersName}, ${sortsName}> {}
    
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}FindResolver extends BaseFindResolver<${entityName}> {}
    
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}UpdateResolver extends BaseUpdateResolver<${entityName}> {}
    
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}CreateResolver extends BaseCreateResolver<${entityName}> {}
    
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}DeleteResolver extends BaseDeleteResolver<${entityName}> {}
    
    `
}
