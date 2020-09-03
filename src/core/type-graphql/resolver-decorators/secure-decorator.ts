import { ResolverDecoratorMetadataKeys } from "./resolver-decorator.keys";

export const Secure = ():ClassDecorator => {
  return function (target: Function) {
    Reflect.defineMetadata(ResolverDecoratorMetadataKeys.Secure, true, target);
  };
};
