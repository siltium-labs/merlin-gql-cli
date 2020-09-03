import { ResolverDecoratorMetadataKeys } from "./resolver-decorator.keys";

export const Secure = (...roles: string[]): ClassDecorator => {
  return function (target: Function) {
    Reflect.defineMetadata(ResolverDecoratorMetadataKeys.Secure, true, target);
    if (roles && roles.length > 0) {
      Reflect.defineMetadata(
        ResolverDecoratorMetadataKeys.HasRoles,
        roles,
        target
      );
    }
  };
};
