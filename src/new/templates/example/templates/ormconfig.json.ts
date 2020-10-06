import { OrmConfigTemplateParams } from "../../../new";

export const OrmConfigTemplate = (
  ormconfig: OrmConfigTemplateParams
): string => {
  return `{
  "type": "${ormconfig.database.type}",
  "database": "${ormconfig.database.name}",
  "username": "${ormconfig.database.user}",
  "password": "${ormconfig.database.password}",
  "port": "${ormconfig.database.port}",
  "host": "${ormconfig.database.host}",
  "logging": ["query"],
  "synchronize": true,
  "entities": ["**/*.model.js"]
}
`;
};
