import { TypeormDatabaseTypes } from "../../../commands/new"

export const NewTemplateUtils = {
    textType: (databaseType: TypeormDatabaseTypes) => {
        if (["mariadb", "mysql", "postgres", "mssql"].includes(databaseType)) {
            return "varchar"
        } else if (["oracle"].includes(databaseType)) {
            return "varchar2"
        }
    },
    numberWithDecimalsType: (databaseType: TypeormDatabaseTypes) => {
        if (["mariadb", "mysql"].includes(databaseType)) {
            return "double"
        } else if (["postgres", "oracle"].includes(databaseType)) {
            return "real"
        } else if (["mssql"].includes(databaseType)) {
            return "numeric"
        }
    },
    intType: (databaseType: TypeormDatabaseTypes) => {
        if (["mariadb", "mysql", "mssql"].includes(databaseType)) {
            return "int"
        } else if (["postgres", "oracle"].includes(databaseType)) {
            return "integer"
        }
    },
    dateTimeType: (databaseType: TypeormDatabaseTypes) => {
        if (["mariadb", "mysql", "mssql"].includes(databaseType)) {
            return "datetime"
        } else if (["postgres"].includes(databaseType)) {
            return "timestamp"
        } else if (["postgres"].includes(databaseType)) {
            return "date"
        }
    },
    booleanType: (databaseType: TypeormDatabaseTypes) => {
        if (["mariadb", "mysql", "postgres"].includes(databaseType)) {
            return "bool"
        } else if (["mssql"].includes(databaseType)) {
            return "bit"
        } else if (["oracle"].includes(databaseType)) {
            throw new Error("There is no boolean type in oracle")
        }
    }

}
