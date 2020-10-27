import { resolverIncludesOperation } from "./../../utils/metadata-storage";
import {
  toEntityFileName,
  toEntityName,
  toEntityOTFileName,
  toEntityOTName,
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
    const secureImport = generationOptions.secureResolvers ? "Secure " : undefined;
    const entityName:string = toEntityName(tscName, generationOptions)
    const entityOTName:string = toEntityOTName(tscName, generationOptions)
    const fileName:string = toFileName(tscName, generationOptions)
    const otFileName:string = toEntityOTFileName(tscName, generationOptions)
    const filtersName:string = toFiltersName(tscName, generationOptions);
    const sortsName:string = toSortsName(tscName, generationOptions);
    const ignoreMetadata = generationOptions.graphqlFiles ?? false;
    

    const resolverImports:string[] =secureImport  ? [secureImport]:[]
    //list resolver based on metadata
    const shouldGenerateListResolver = ignoreMetadata || resolverIncludesOperation(entityName,"LIST")
    const listResolver:string = shouldGenerateListResolver ? `
    const BaseListResolver = ListResolver(${entityOTName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}ListResolver extends BaseListResolver<${entityOTName}, ${filtersName}, ${sortsName}> {}
    ` : ""
    if(shouldGenerateListResolver){
      resolverImports.push("ListResolver")
    }

    //find resolver based on metadata
    const shouldGenerateFindResolver = ignoreMetadata || resolverIncludesOperation(entityName,"FIND");
    const findResolver:string = shouldGenerateFindResolver ? `
    const BaseFindResolver = FindResolver(${entityOTName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}FindResolver extends BaseFindResolver<${entityOTName}> {}
    ` : ""
    if(shouldGenerateFindResolver){
      resolverImports.push("FindResolver")
    }

    //update resolver based on metadata
    const shouldGenerateUpdateResolver = ignoreMetadata || resolverIncludesOperation(entityName,"UPDATE")
    const updateResolver:string = shouldGenerateUpdateResolver ? `
    const BaseUpdateResolver = UpdateResolver(${entityOTName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}UpdateResolver extends BaseUpdateResolver<${entityOTName}> {}
    ` : ""   
    if(shouldGenerateUpdateResolver){
      resolverImports.push("UpdateResolver")
    }

    //create resolver based on metadata
    const shouldGenerateCreateResolver = ignoreMetadata || resolverIncludesOperation(entityName,"CREATE")
    const createResolver:string = shouldGenerateCreateResolver ? `
    const BaseCreateResolver = CreateResolver(${entityOTName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}CreateResolver extends BaseCreateResolver<${entityOTName}> {}
    ` : ""
    if(shouldGenerateCreateResolver){
      resolverImports.push("CreateResolver")
    }   

    //create resolver based on metadata
    const shouldGenerateDeleteResolver = ignoreMetadata || resolverIncludesOperation(entityName,"DELETE")
    const deleteResolver:string = shouldGenerateDeleteResolver ? `
    const BaseDeleteResolver = DeleteResolver(${entityOTName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}DeleteResolver extends BaseDeleteResolver<${entityOTName}> {}
    ` : ""  
    if(shouldGenerateDeleteResolver){
      resolverImports.push("DeleteResolver")
    }    

    

    return `
    
    import { Resolver } from "type-graphql";
    import { ${entityOTName} } from "../../models/${fileName}/${toEntityOTFileName(tscName, generationOptions)}";
    import ${toLocalImport(filtersName, generationOptions)} from "./${fileName}.filter";
    import ${toLocalImport(sortsName, generationOptions)} from "./${fileName}.sort";
    import { ${resolverImports.join(", ")} } from "merlin-gql";
    
    ${listResolver}    
    
    ${findResolver}    
    
    ${updateResolver}    
    
    ${createResolver}    
    
    ${deleteResolver}    
    
    `
}
