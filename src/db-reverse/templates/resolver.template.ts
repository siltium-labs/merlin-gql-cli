import {
  isOperationSecure,
  resolverIncludesOperation,
  securityRolesAllowedForOperation,
} from "@merlin-gql/core";
import IGenerationOptions from "../options/generation-options.interface";
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

// prettier-ignore
export const ResolverTemplate = (
  tscName: string,
  generationOptions: IGenerationOptions
): string => {
  //const secureResolverDecorator = generationOptions.secureResolvers ? "@Secure()" : "";
  const entityName: string = toEntityName(tscName, generationOptions)
  const fileName: string = toFileName(tscName, generationOptions)
  const filtersName: string = toFiltersName(tscName, generationOptions);
  const createInputName: string = toInputsCreateName(tscName, generationOptions);
  const updateInputName: string = toInputsUpdateName(tscName, generationOptions);
  const sortsName: string = toSortsName(tscName, generationOptions);
  const ignoreMetadata = generationOptions.graphqlFiles ?? false;


  const resolverImports: string[] = []
  const isListSecure = isOperationSecure(entityName, "LIST") || generationOptions.secureResolvers;
  const listSecuredRoles = securityRolesAllowedForOperation(entityName, "LIST");
  //list resolver based on metadata
  const shouldGenerateListResolver = ignoreMetadata || resolverIncludesOperation(entityName, "LIST")
  const listResolver: string = shouldGenerateListResolver ? `
    const BaseListResolver = ListResolver(${entityName},${filtersName},${sortsName});
    @Resolver()
    ${isListSecure ? `@Secure(${listSecuredRoles ? listSecuredRoles.map(r => `"${r}"`).join(', ') : ''})` : ''}
    export class ${entityName}ListResolver extends BaseListResolver<${entityName}, ${filtersName}, ${sortsName}> {}
    ` : ""
  if (shouldGenerateListResolver) {
    resolverImports.push("ListResolver")
  }

  //find resolver based on metadata
  const isFindSecure = isOperationSecure(entityName, "FIND") || generationOptions.secureResolvers;
  const findSecuredRoles = securityRolesAllowedForOperation(entityName, "FIND");
  const shouldGenerateFindResolver = ignoreMetadata || resolverIncludesOperation(entityName, "FIND");
  const findResolver: string = shouldGenerateFindResolver ? `
    const BaseFindResolver = FindResolver(${entityName});
    @Resolver()
    ${isFindSecure ? `@Secure(${findSecuredRoles ? findSecuredRoles.map(r => `"${r}"`).join(', ') : ''})` : ''}
    export class ${entityName}FindResolver extends BaseFindResolver<${entityName}> {}
    ` : "";

  if (shouldGenerateFindResolver) {
    resolverImports.push("FindResolver")
  }

  //update resolver based on metadata
  const isUpdateSecure = isOperationSecure(entityName, "UPDATE") || generationOptions.secureResolvers;
  const updateSecuredRoles = securityRolesAllowedForOperation(entityName, "UPDATE");
  const shouldGenerateUpdateResolver = ignoreMetadata || resolverIncludesOperation(entityName, "UPDATE")
  const updateResolver: string = shouldGenerateUpdateResolver ? `
    const BaseUpdateResolver = UpdateResolver(${entityName},${updateInputName});
    @Resolver()
    ${isUpdateSecure ? `@Secure(${updateSecuredRoles ? updateSecuredRoles.map(r => `"${r}"`).join(', ') : ''})` : ''}
    export class ${entityName}UpdateResolver extends BaseUpdateResolver<${entityName}> {}
    ` : "";

  if (shouldGenerateUpdateResolver) {
    resolverImports.push("UpdateResolver")
  }

  //create resolver based on metadata
  const isCreateSecure = isOperationSecure(entityName, "CREATE") || generationOptions.secureResolvers;
  const createSecuredRoles = securityRolesAllowedForOperation(entityName, "CREATE");
  const shouldGenerateCreateResolver = ignoreMetadata || resolverIncludesOperation(entityName, "CREATE")
  const createResolver: string = shouldGenerateCreateResolver ? `
    const BaseCreateResolver = CreateResolver(${entityName},${createInputName});
    @Resolver()
    ${isCreateSecure ? `@Secure(${createSecuredRoles ? createSecuredRoles.map(r => `"${r}"`).join(', ') : ''})` : ''}
    export class ${entityName}CreateResolver extends BaseCreateResolver<${entityName}> {}
    ` : "";

  if (shouldGenerateCreateResolver) {
    resolverImports.push("CreateResolver")
  }

  //delete resolver based on metadata
  const isDeleteSecure = isOperationSecure(entityName, "DELETE") || generationOptions.secureResolvers;
  const deleteSecuredRoles = securityRolesAllowedForOperation(entityName, "DELETE");
  const shouldGenerateDeleteResolver = ignoreMetadata || resolverIncludesOperation(entityName, "DELETE")
  const deleteResolver: string = shouldGenerateDeleteResolver ? `
    const BaseDeleteResolver = DeleteResolver(${entityName});
    @Resolver()
    ${isDeleteSecure ? `@Secure(${deleteSecuredRoles ? deleteSecuredRoles.map(r => `"${r}"`).join(', ') : ''})` : ''}
    export class ${entityName}DeleteResolver extends BaseDeleteResolver<${entityName}> {}
    ` : "";

  if (shouldGenerateDeleteResolver) {
    resolverImports.push("DeleteResolver")
  }

  const inputsToImport: string[] = []
  if (shouldGenerateCreateResolver) {
    inputsToImport.push(createInputName);
  }
  if (shouldGenerateUpdateResolver) {
    inputsToImport.push(updateInputName);
  }
  const secureImport = (isListSecure || isFindSecure || isUpdateSecure || isCreateSecure || isDeleteSecure) ? "Secure " : undefined;
  if (secureImport) {
    resolverImports.push(secureImport);
  }
  return `

    import { Resolver } from "type-graphql";
    import { ${entityName} } from "../../models/${fileName}/${toEntityFileName(tscName, generationOptions)}";
    ${shouldGenerateListResolver ? `
    import ${toLocalImport(filtersName, generationOptions)} from "./${fileName}.filter";
    import ${toLocalImport(sortsName, generationOptions)} from "./${fileName}.sort";
    `: ''}
    ${inputsToImport.length > 0 ? `
    import ${toLocalImport(inputsToImport.join(", "), generationOptions)} from "./${fileName}.input"
    `: ''}
    import { ${resolverImports.join(", ")} } from "@merlin-gql/core";

    ${listResolver}

    ${findResolver}

    ${updateResolver}

    ${createResolver}

    ${deleteResolver}

    `
}
