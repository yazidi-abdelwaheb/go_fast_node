import { program } from "commander";
import { getListMigrationName } from "./utils.js";
import runMigration from "./run-migration.js";
import {newFileData,newMigration} from "./new-files.js";

/**
 * migration system configuration command line
 *
 * use by command name "migration" or alias "mg" :
 *  `node index.js migration --help` or `node index.js mg --help`
 *
 *@example
 * ```sh
 * node index.js migration --help #Output all option
 * ```
 * @returns {commander.command} commander.command
 */
async function migration_system() {
  return program
    .command("migration")
    .alias("mg")
    .description(
      "Migration system for manegment migration files. \n To be run or create a new migration file with the specified migration name."
    )
    .version("1.0.0", "-v, --version", "output the current version")
    .usage("<option> [value]")
    .option(
      "-n, --new <migartion-name>",
      'Create a new migration file in "@/src/migrations/migrations-files"'
    )
    .option(
      "-N, --newdata <data-file-name>",
      'Create a new data file in "@/src/migrations/data"'
    )
    .option(
      "-r, --run <migration-name>",
      'Run the migration file from "@/src/migrations/migrations-files"'
    )
    .option("-a, --all", "View all migrations names")

    .action(async (args) => {
      if (args.all) {
        console.log("");
        console.log("View all migrations");
        console.log("");
        console.table(getListMigrationName());
      } else if (args.new) {
        console.log("");
        console.log("create new migration : " + args.new);
        console.log("");
        await newMigration(args.new);
      } 
      else if (args.newdata) {
        console.log("");
        console.log("create new data file : " + args.newdata);
        console.log("");
        await newFileData(args.newdata);
      } 
      else if (args.run) {
        console.log("");
        console.log("run migration : " + args.run);
        console.log("");
        await runMigration(args.run);
      } else {
        console.log("");
        console.log(
          "Choix option for manegment your migration . Run --help for view all migration option "
        );
        console.log("");
      }
    })
    .parse(process.argv);
}

export default migration_system;
