import { Resolver } from "type-graphql";
import { Category } from "../../models/category/category.model";

import { CategoryFilters } from "./category.filter";
import { CategorySorts } from "./category.sort";

import { CategoryCreateInput, CategoryUpdateInput } from "./category.input";

import { ListResolver, FindResolver, UpdateResolver, CreateResolver, DeleteResolver } from "merlin-gql";

const BaseListResolver = ListResolver(Category, CategoryFilters, CategorySorts);
@Resolver()
export class CategoryListResolver extends BaseListResolver<Category, CategoryFilters, CategorySorts> {}

const BaseFindResolver = FindResolver(Category);
@Resolver()
export class CategoryFindResolver extends BaseFindResolver<Category> {}

const BaseUpdateResolver = UpdateResolver(Category, CategoryUpdateInput);
@Resolver()
export class CategoryUpdateResolver extends BaseUpdateResolver<Category> {}

const BaseCreateResolver = CreateResolver(Category, CategoryCreateInput);
@Resolver()
export class CategoryCreateResolver extends BaseCreateResolver<Category> {}

const BaseDeleteResolver = DeleteResolver(Category);
@Resolver()
export class CategoryDeleteResolver extends BaseDeleteResolver<Category> {}
