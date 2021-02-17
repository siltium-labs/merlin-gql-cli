import { Resolver } from "type-graphql";
import { Product } from "../../models/product/product.model";

import { ProductFilters } from "./product.filter";
import { ProductSorts } from "./product.sort";

import { ProductCreateInput, ProductUpdateInput } from "./product.input";

import { ListResolver, FindResolver, UpdateResolver, CreateResolver, DeleteResolver } from "@merlin-gql/core";

const BaseListResolver = ListResolver(Product, ProductFilters, ProductSorts);
@Resolver()
export class ProductListResolver extends BaseListResolver<Product, ProductFilters, ProductSorts> {}

const BaseFindResolver = FindResolver(Product);
@Resolver()
export class ProductFindResolver extends BaseFindResolver<Product> {}

const BaseUpdateResolver = UpdateResolver(Product, ProductUpdateInput);
@Resolver()
export class ProductUpdateResolver extends BaseUpdateResolver<Product> {}

const BaseCreateResolver = CreateResolver(Product, ProductCreateInput);
@Resolver()
export class ProductCreateResolver extends BaseCreateResolver<Product> {}

const BaseDeleteResolver = DeleteResolver(Product);
@Resolver()
export class ProductDeleteResolver extends BaseDeleteResolver<Product> {}
