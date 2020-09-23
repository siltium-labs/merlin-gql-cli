import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";
import cli from "cli-ux";

export default class TestCommand extends Command {
  static description = "Testing";

  static examples = [`$ merlin-gql test`];

  static flags = {};

  static args = [];

  async run() {
    const { args, flags } = this.parse(TestCommand);
    
  }
}
