export type EntityClassFileArgs = {
  name: string;
  properties: EntityClassPropertyArgs[];
};

export type EntityClassPropertyArgs = {
  name: string;
  type: EntityClassPropertyType;
  required: boolean;
};

export type EntityClassPropertyType = "string" | "number" | "date" | "boolean";

export const generateEntityClassFile = (args: EntityClassFileArgs) => {
  return `
import { Entity } from "typeorm";

@Entity()  
export class ${args.name} {

    ${args.properties
      .map((prop) => `${prop.name}${!prop.required ? "?" : ""}: ${prop.type};`)
      .join("\r\n    ")}
      
}
`;
};
