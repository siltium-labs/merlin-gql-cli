import { mustHaveRole } from "./../../security/security.decorators";
import { IGqlContext } from "./../../context";
import { ResolverDecoratorMetadataKeys } from "../resolver-decorators/resolver-decorator.keys";
import { mustBeAuthenticated } from "../../security/security.decorators";

export abstract class AbstractSecureResolver {
  protected static hasSecureDecorator() {
    return !!Reflect.getMetadata(ResolverDecoratorMetadataKeys.Secure, this);
  }

  protected static hasSpecificRolesAllowed() {
    return !!Reflect.getMetadata(ResolverDecoratorMetadataKeys.HasRoles, this);
  }

  protected static allowedRoles(): string[] {
    return (
      Reflect.getMetadata(ResolverDecoratorMetadataKeys.HasRoles, this) ?? []
    );
  }

  protected checkSecurity(context: IGqlContext) {
    const hasSecureDecorator: boolean = (this as any).constructor.hasSecureDecorator();
    if (hasSecureDecorator) {
      mustBeAuthenticated(context);
    }
    const hasSpecificRolesAllowed: boolean = (this as any).constructor.hasSpecificRolesAllowed();
    if (hasSpecificRolesAllowed) {
      const allowedRoles: string[] = (this as any).constructor.allowedRoles();
      mustHaveRole(context, ...allowedRoles);
    }
  }
}
