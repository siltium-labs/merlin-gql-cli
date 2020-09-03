import { ResolverDecoratorMetadataKeys } from '../resolver-decorators/resolver-decorator.keys';

export abstract class AbstractSecureResolver {
  private static hasSecureDecorator() {
    return !!Reflect.getMetadata(ResolverDecoratorMetadataKeys.Secure, this);
  }
}
