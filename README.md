merlin-gql
==========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/merlin-gql.svg)](https://npmjs.org/package/merlin-gql)
[![Downloads/week](https://img.shields.io/npm/dw/merlin-gql.svg)](https://npmjs.org/package/merlin-gql)
[![License](https://img.shields.io/npm/l/merlin-gql.svg)](https://github.com/ezequielzacca/merlin-gql/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g merlin-gql
$ merlin-gql COMMAND
running command...
$ merlin-gql (-v|--version|version)
merlin-gql/0.2.2 win32-x64 node-v10.15.0
$ merlin-gql --help [COMMAND]
USAGE
  $ merlin-gql COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`merlin-gql generate:entity`](#merlin-gql-generateentity)
* [`merlin-gql help [COMMAND]`](#merlin-gql-help-command)
* [`merlin-gql list:entities`](#merlin-gql-listentities)

## `merlin-gql generate:entity`

Allows code generation

```
USAGE
  $ merlin-gql generate:entity

OPTIONS
  -n, --name=name
  -r, --resolver

ALIASES
  $ merlin-gql g:e

EXAMPLE
  $ merlin-gql generate:entity
```

_See code: [src\commands\generate\entity.ts](https://github.com/silentium-labs/merlin-gql-cli/blob/v0.2.2/src\commands\generate\entity.ts)_

## `merlin-gql help [COMMAND]`

display help for merlin-gql

```
USAGE
  $ merlin-gql help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src\commands\help.ts)_

## `merlin-gql list:entities`

Lists all typeorm existing entities

```
USAGE
  $ merlin-gql list:entities

ALIASES
  $ merlin-gql l

EXAMPLE
  $ merlin-gql list:entities
```

_See code: [src\commands\list\entities.ts](https://github.com/silentium-labs/merlin-gql-cli/blob/v0.2.2/src\commands\list\entities.ts)_
<!-- commandsstop -->
* [`merlin-gql generate:entity`](#merlin_cli-generateentity)

## `merlin_cli generate:entity`

Allows code generation

```
USAGE
  $ merlin_cli generate:entity

OPTIONS
  -n, --name=name
  -r, --resolver

EXAMPLE
  $ merlin_cli generate model
```

_See code: [src\commands\generate\entity.ts](https://github.com/ezequielzacca/merlin_cli/blob/v0.0.0/src\commands\generate\entity.ts)_
