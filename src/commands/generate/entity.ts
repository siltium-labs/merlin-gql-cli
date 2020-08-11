import {
  generateEntityClassFile,
  EntityClassFileArgs,
  EntityClassPropertyArgs,
  EntityClassPropertyType,
} from "../../templates/entity.template";
import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";
import cli from "cli-ux";
import * as handleblars from "handlebars";
import { ordinalize } from "../../utils/ordinalize";

export default class EntityGenerator extends Command {
  static aliases = ["g:e"];
  static description = "Allows code generation";

  static examples = [`$ merlin-gql generate:entity`];

  static flags = {
    name: flags.string({ char: "n" }),
    resolver: flags.boolean({ char: "r" }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(EntityGenerator);
    const entityClassFileArgs: EntityClassFileArgs = {
      name: "",
      properties: [],
    };
    entityClassFileArgs.name = flags.name ?? "";
    if (entityClassFileArgs.name === "") {
      const nameResponse: { name: string } = await inquirer.prompt([
        {
          name: "name",
          message: "Name of the entity",
          type: "input",
        },
      ]);

      entityClassFileArgs.name = nameResponse.name;
    }
    let userEnteredEmptyPropertyName = false;

    while (!userEnteredEmptyPropertyName) {
      const nameResponse: { name: string } = await inquirer.prompt([
        {
          name: "name",
          message: `Name of the ${ordinalize(
            entityClassFileArgs.properties.length + 1
          )} property (Empty to stop adding properties)`,
          type: "input",
        },
      ]);

      const propertyName = nameResponse.name;
      if (!propertyName || propertyName === "") {
        userEnteredEmptyPropertyName = true;
        break;
      }
      const typeResponse: {
        type: EntityClassPropertyType;
      } = await inquirer.prompt([
        {
          name: "type",
          message: `Type of the ${ordinalize(
            entityClassFileArgs.properties.length + 1
          )} property`,
          type: "list",
          choices: [
            { name: "string", value: "string" },
            { name: "number", value: "number" },
            { name: "boolean", value: "boolean" },
          ],
        },
      ]);
      const propertyType = typeResponse.type;
      const requiredResponse: { required: boolean } = await inquirer.prompt([
        {
          name: "required",
          message: `Is the property required?`,
          type: "confirm",
        },
      ]);
      const propertyRequired = requiredResponse.required;
      const property: EntityClassPropertyArgs = {
        name: propertyName,
        type: propertyType,
        required: propertyRequired,
      };
      entityClassFileArgs.properties.push(property);
    }

    let shouldGenerateResolver = flags.resolver;

    cli.action.start("Generating model...");
    await Await3Seconds();
    cli.action.stop();
    //const name = flags.name ?? "world";
    /*this.log(`hello ${name} from .\\src\\commands\\hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }*/

    this.log(generateEntityClassFile(entityClassFileArgs));
  }
}

const Await3Seconds = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 3000);
  });
};
