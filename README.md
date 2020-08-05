merlin-gql
==========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/merlin_cli.svg)](https://npmjs.org/package/merlin_cli)
[![Downloads/week](https://img.shields.io/npm/dw/merlin_cli.svg)](https://npmjs.org/package/merlin_cli)
[![License](https://img.shields.io/npm/l/merlin_cli.svg)](https://github.com/ezequielzacca/merlin_cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g merlin-gql
$ merlin_cli COMMAND
running command...
$ merlin_cli (-v|--version|version)
merlin-gql/0.2.0 win32-x64 node-v10.15.0
$ merlin_cli --help [COMMAND]
USAGE
  $ merlin_cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`merlin_cli generate:entity`](#merlin_cli-generateentity)
* [`merlin_cli help [COMMAND]`](#merlin_cli-help-command)

## `merlin_cli generate:entity`

Allows code generation

```
USAGE
  $ merlin_cli generate:entity

OPTIONS
  -n, --name=name
  -r, --resolver

ALIASES
  $ merlin_cli e

EXAMPLE
  $ merlin_cli generate model
```

_See code: [src\commands\generate\entity.ts](https://github.com/ezequielzacca/merlin_cli/blob/v0.2.0/src\commands\generate\entity.ts)_

## `merlin_cli help [COMMAND]`

display help for merlin_cli

```
USAGE
  $ merlin_cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src\commands\help.ts)_
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
