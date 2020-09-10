import { createNew } from "../new/new";
import { Command, flags } from "@oclif/command";
import inquirer from "inquirer";
import { NewProjectTemplatesEnum, NewProjectConfig } from "../new/new.config";
import chalk from "chalk";
import { emoji } from "node-emoji";

const toTitleCase = (str: string) =>
  str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export default class New extends Command {
  static aliases = ["new"];

  static description = `creates a new merlin-gql project.\n
  Usage: merlin-gql new -t example -n myProject\n
  You can also run program without specifying any parameters to launch interactive mode.`;

  static flags = {
    help: flags.help(),

    template: flags.string({
      char: "t",
      description: "Template",
      options: ["basic", "example"],

      //default: connectionOptions.host,
    }),
    name: flags.string({
      char: "n",
      description: "Name of the project",

      //default: connectionOptions.host,
    }),
  };

  async run() {
    const { args, flags } = this.parse(New);
    if (!flags.template) {
      const {
        template,
      }: { template: NewProjectTemplatesEnum } = await inquirer.prompt([
        {
          name: "template",
          message: `Select a starting template for your project`,
          type: "list",
          choices: [
            {
              name: `${toTitleCase(
                NewProjectTemplatesEnum.Basic
              )} - Contains only the very minimum required files to start.`,
              value: NewProjectTemplatesEnum.Basic,
            },
            {
              name: `${toTitleCase(
                NewProjectTemplatesEnum.Example
              )} - Showcases basic functionality examples. For more info check https://foo.bar.`,
              value: NewProjectTemplatesEnum.Example,
            },
          ],
        },
      ]);
      flags.template = template;
    }
    if (!flags.name) {
      const { name }: { name: string } = await inquirer.prompt([
        {
          name: "name",
          message: `Enter the name of your project without spaces`,
          type: "input",
        },
      ]);
      flags.name = name.trim();
    }
    const config: NewProjectConfig = {
      template: flags.template as NewProjectTemplatesEnum,
      name: flags.name,
    };
    await createNew(config);
    this.log(
      `${chalk.cyan.bold("Project created successfully")} ${emoji.rocket}`
    );
  }
}
