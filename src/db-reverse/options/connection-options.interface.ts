// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export type DatabaseType = "mssql" | "postgres" | "mysql" | "mariadb" | "oracle" | "sqlite"

export default interface IConnectionOptions {
  host: string;
  port: number;
  databaseName: string;
  user: string;
  password: string;
  databaseType: DatabaseType;
  schemaName: string;
  ssl: boolean;
  skipTables: string[];
}

export function getDefaultConnectionOptions(): IConnectionOptions {
  const connectionOptions: IConnectionOptions = {
    host: "127.0.0.1",
    port: 0,
    databaseName: "",
    user: "",
    password: "",
    databaseType: undefined as any,
    schemaName: "",
    ssl: false,
    skipTables: [],
  };
  return connectionOptions;
}
