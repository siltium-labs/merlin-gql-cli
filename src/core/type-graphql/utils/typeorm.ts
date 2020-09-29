import { BaseModel } from "./../../database/base.model";
export const getTypeormEntityFromSubclass = (target: typeof BaseModel) => {
  return Object.getPrototypeOf(target) as typeof BaseModel;
};
