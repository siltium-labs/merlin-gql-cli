import { resolverIncludesOperation } from "./../../utils/metadata-storage";
import {
  toEntityFileName,
  toEntityName,
  toFileName,
  toFiltersName,
  toInputsCreateName,
  toInputsUpdateName,
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
    const fileName:string = toFileName(tscName, generationOptions)
    const filtersName:string = toFiltersName(tscName, generationOptions);
    const createInputName:string = toInputsCreateName(tscName, generationOptions);
    const updateInputName:string = toInputsUpdateName(tscName, generationOptions);
    const sortsName:string = toSortsName(tscName, generationOptions);
    const ignoreMetadata = generationOptions.graphqlFiles ?? false;


    const resolverImports:string[] =secureImport  ? [secureImport]:[]
    //list resolver based on metadata
    const shouldGenerateListResolver = ignoreMetadata || resolverIncludesOperation(entityName,"LIST")
    const listResolver:string = shouldGenerateListResolver ? `
    const BaseListResolver = ListResolver(${entityName},${filtersName},${sortsName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}ListResolver extends BaseListResolver<${entityName}, ${filtersName}, ${sortsName}> {}
    ` : ""
    if(shouldGenerateListResolver){
      resolverImports.push("ListResolver")
    }

    //find resolver based on metadata
    const shouldGenerateFindResolver = ignoreMetadata || resolverIncludesOperation(entityName,"FIND");
    const findResolver:string = shouldGenerateFindResolver ? `
    const BaseFindResolver = FindResolver(${entityName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}FindResolver extends BaseFindResolver<${entityName}> {}
    ` : "";

    if(shouldGenerateFindResolver){
      resolverImports.push("FindResolver")
    }

    //update resolver based on metadata
    const shouldGenerateUpdateResolver = ignoreMetadata || resolverIncludesOperation(entityName,"UPDATE")
    const updateResolver:string = shouldGenerateUpdateResolver ? `
    const BaseUpdateResolver = UpdateResolver(${entityName},${updateInputName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}UpdateResolver extends BaseUpdateResolver<${entityName}> {}
    ` : "";

    if(shouldGenerateUpdateResolver){
      resolverImports.push("UpdateResolver")
    }

    //create resolver based on metadata
    const shouldGenerateCreateResolver = ignoreMetadata || resolverIncludesOperation(entityName,"CREATE")
    const createResolver:string = shouldGenerateCreateResolver ? `
    const BaseCreateResolver = CreateResolver(${entityName},${createInputName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}CreateResolver extends BaseCreateResolver<${entityName}> {}
    ` : "";

    if(shouldGenerateCreateResolver){
      resolverImports.push("CreateResolver")
    }

    //create resolver based on metadata
    const shouldGenerateDeleteResolver = ignoreMetadata || resolverIncludesOperation(entityName,"DELETE")
    const deleteResolver:string = shouldGenerateDeleteResolver ? `
    const BaseDeleteResolver = DeleteResolver(${entityName});
    @Resolver()
    ${secureResolverDecorator}
    export class ${entityName}DeleteResolver extends BaseDeleteResolver<${entityName}> {}
    ` : "";

    if(shouldGenerateDeleteResolver){
      resolverImports.push("DeleteResolver")
    }

    const inputsToImport:string[] = []
    if(shouldGenerateCreateResolver){
      inputsToImport.push(createInputName);
    }
    if(shouldGenerateUpdateResolver){
      inputsToImport.push(updateInputName);
    }
    return `

    import { Resolver } from "type-graphql";
    import { ${entityName} } from "../../models/${fileName}/${toEntityFileName(tscName, generationOptions)}";
    ${shouldGenerateListResolver ? `
    import ${toLocalImport(filtersName, generationOptions)} from "./${fileName}.filter";
    import ${toLocalImport(sortsName, generationOptions)} from "./${fileName}.sort";
    `:''}
    ${inputsToImport.length > 0 ? `
    import ${toLocalImport(inputsToImport.join(", "), generationOptions)} from "./${fileName}.input"
    `: ''}
    import { ${resolverImports.join(", ")} } from "merlin-gql";

    ${listResolver}

    ${findResolver}

    ${updateResolver}

    ${createResolver}

    ${deleteResolver}

    `
}
