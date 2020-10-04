export const getEntityNameFromSublass = (
  subclassType: Object,
  notInherited: boolean
) =>
  notInherited
    ? subclassType.constructor.name
    : Object.getPrototypeOf(subclassType).constructor.name;
