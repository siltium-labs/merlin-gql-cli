merlin_cli
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
$ npm install -g merlin_cli
$ merlin_cli COMMAND
running command...
$ merlin_cli (-v|--version|version)
merlin_cli/0.0.0 win32-x64 node-v10.15.0
$ merlin_cli --help [COMMAND]
USAGE
  $ merlin_cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`merlin_cli hello [FILE]`](#merlin_cli-hello-file)
* [`merlin_cli help [COMMAND]`](#merlin_cli-help-command)

## `merlin_cli hello [FILE]`

describe the command here

```
USAGE
  $ merlin_cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ merlin_cli hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/ezequielzacca/merlin_cli/blob/v0.0.0/src\commands\hello.ts)_

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
