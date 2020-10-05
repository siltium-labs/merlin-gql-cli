import { resolverIncludesOperation } from "./../../utils/metadata-storage";
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

    //list resolver based on metadata
    const shouldGenerateListResolver = resolverIncludesOperation(entityName,"LIST")
    const listResolver:string = shouldGenerateListResolver ? `
    const BaseListResolver = ListResolver(${entityName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}ListResolver extends BaseListResolver<${entityName}, ${filtersName}, ${sortsName}> {}
    ` : ""

    //find resolver based on metadata
    const shouldGenerateFindResolver = resolverIncludesOperation(entityName,"FIND")
    const findResolver:string = shouldGenerateFindResolver ? `
    const BaseFindResolver = FindResolver(${entityName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}FindResolver extends BaseFindResolver<${entityName}> {}
    ` : ""

    //update resolver based on metadata
    const shouldGenerateUpdateResolver = resolverIncludesOperation(entityName,"UPDATE")
    const updateResolver:string = shouldGenerateUpdateResolver ? `
    const BaseUpdateResolver = UpdateResolver(${entityName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}UpdateResolver extends BaseUpdateResolver<${entityName}> {}
    ` : ""   

    //create resolver based on metadata
    const shouldGenerateCreateResolver = resolverIncludesOperation(entityName,"CREATE")
    const createResolver:string = shouldGenerateCreateResolver ? `
    const BaseCreateResolver = CreateResolver(${entityName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}CreateResolver extends BaseCreateResolver<${entityName}> {}
    ` : ""   

    //create resolver based on metadata
    const shouldGenerateDeleteResolver = resolverIncludesOperation(entityName,"DELETE")
    const deleteResolver:string = shouldGenerateDeleteResolver ? `
    const BaseDeleteResolver = DeleteResolver(${entityName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}DeleteResolver extends BaseDeleteResolver<${entityName}> {}
    ` : ""   


    return `
    
    import { Resolver } from "type-graphql";
    import { ${entityName} } from "../models/${fileName}/${toEntityFileName(tscName, generationOptions)}";
    import ${toLocalImport(filtersName, generationOptions)} from "../models/${fileName}/${fileName}.filter";
    import ${toLocalImport(sortsName, generationOptions)} from "../models/${fileName}/${fileName}.sort";
    import { CreateResolver, DeleteResolver, FindResolver, ListResolver, ${secureImport} UpdateResolver } from "merlin-gql";
    
    ${listResolver}    
    
    ${findResolver}    
    
    ${updateResolver}    
    
    ${createResolver}    
    
    ${deleteResolver}    
    
    `
}
