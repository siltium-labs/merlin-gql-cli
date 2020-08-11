import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";
import cli from "cli-ux";

export default class EntityGenerator extends Command {
  static aliases = ["e"]
  static description = "Allows code generation";

  static examples = [`$ merlin-gql generate:model`];

  static flags = {
    name: flags.string({char:"n"}),
    resolver: flags.boolean({ char: "r" }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(EntityGenerator);
    let modelName = flags.name;
    if (!modelName || modelName === "") {
      const responses: { name: string } = await inquirer.prompt([
        {
          name: "name",
          message: "Name of the entity",
          type: "input",
        },
      ]);

      modelName = responses.name;
    }

    let shouldGenerateResolver = flags.resolver;
    if (
      shouldGenerateResolver === undefined ||
      shouldGenerateResolver === null
    ) {
      const responses: { resolver: boolean } = await inquirer.prompt([
        {
          name: "resolver",
          message: "Do you want to generate a resolver?",
          type: "checkbox",
          choices: [
            { name: "Yes", value: true },
            { name: "No", value: false },
          ],
        },
      ]);

      shouldGenerateResolver = responses.resolver;
    }
    cli.action.start("Generating model...");
    await Await3Seconds();
    cli.action.stop();
    //const name = flags.name ?? "world";
    /*this.log(`hello ${name} from .\\src\\commands\\hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }*/
    this.log(
      `Entity Generator will generate the entity ${modelName}Model ${
        shouldGenerateResolver ? "with resolver" : "without resolver"
      }`
    );
  }
}

const Await3Seconds = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 3000);
  });
};
