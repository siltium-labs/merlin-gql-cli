import MysqlDriver from "./mysql.driver";

export default class MariaDbDriver extends MysqlDriver {
  public readonly EngineName: string = "MariaDb";
}
