import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import fs from "fs";

/**
 * define all commands and aliases for system
 */
export const migration_system_commands_names = ["migration", "mg"];

/**
 *
 * Input function for
 *
 *
 * @example
 * ```js
 *    import {askQuestion} from "utils.js";
 *    const value = await askQuestion("Message write to stdout.");
 *    console.log(value);
 * ```
 *
 * @param {string} query message write to stdout
 * @returns {string} value read from stdin
 */
export const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
      rl.close();
    });
  });
};

/**
 * generetion table of migration data form files in ./migrations-files directory
 *
 * @returns {Array} list of migrations data  : [{name: "migration name" , createAt: "creation date" ,filePath: "file name"}]
 */
export const getListMigrationName = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, `migrations-files`);
  const files = fs.readdirSync(filePath);
  return files.map((e) => {
    return {
      name: e.split("#")[1].replace(".js", ""),
      createAt: e.split("#")[0].replaceAll("_", "-"),
      filePath: e,
    };
  });
};

/**
 * generetion table of data names form files in ./data directory
 *
 * @returns {Array} list of data names [{name : "data name" , path : "file path"}].
 */
export const getListDataName = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, `data`);
  const files = fs.readdirSync(filePath);
  return files.map((e) => {
    return {
      name: e.split("#")[1].replace(".json", ""),
      path: e
    };
  });
};


/**
 * load data from file in ./data directory  
 * @param {string} dataname name of the file 
 * @returns {Promise<array>}  data from the file 
 */
export const loadData = async (dataname) => {
  try {
   
    const files = getListDataName()
    const dataPath = files.find((file) => file.name === dataname)?.path;
    if (!dataPath) {
     throw new Error(`[loadData] Data file "${dataname}" not found.`);
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, 'data', dataPath);

    const data = fs.readFileSync(filePath, 'utf8');

    try {
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (parseErr) {
      throw new Error(`Le contenu de "${dataname}.json" n'est pas un JSON valide.`);
    }

  } catch (err) {
    console.error(`[loadData] Erreur: ${err.message}`);
    return null;
  }
};