import { askQuestion, getListMigrationName } from "./utils.js";

/** define migrations names global  */
let migrations_names = [];

/**
 * validation functions for migration name
 *
 * @param {string} name migration name
 * @returns {false | object} false if migration name is not valid else object : {name: "migration name" , createAt: "creation date" ,filePath: "file name"}
 */
const isValidMigrationName = (name) => {
  try {
    if (!/^[a-zA-Z0-9-]+$/.test(name)) {
      throw new Error("Migration name not valid.");
    } else {
      const migration = migrations_names.filter((e) => e.name === name)[0];
      if (!migration) {
        throw new Error("Migration name not found.");
      } else return migration;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const runMigration = async (migration) => {
  try {
    migrations_names = getListMigrationName();

    /** validation migartion name and get migration data {name , createAt , filePath} */
    let migartion_data = isValidMigrationName(migration);
    if (!migartion_data) {
      while (true) {
        migration = await askQuestion(
          "Please enter a valid migration name (alphanumeric and dashed only): "
        );
        migartion_data = isValidMigrationName(migration);
        if (migartion_data) {
          console.log("break");
          break;
        }
      }
    }

    /**
     * Run migration file .
     * in file path "#"==="%23"
     */

    const filePath = `./migrations-files/${migartion_data.filePath.replace(
      "#",
      "%23"
    )}`;

    await import(filePath);
  } catch (error) {
    console.log(error.message);
  }
};

export default runMigration;
