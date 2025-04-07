import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { askQuestion, getListMigrationName, getListDataName } from "./utils.js";

/**
 * Validates the file name.
 * @param {string} fileName - File name to validate.
 * @param {Array} names - List of existing file names.
 * @param {string} type - File type ("migration" or "data").
 * @returns {boolean} - `true` if the file name is valid; otherwise, logs an error.
 */
const isValidFileName = (fileName, names, type) => {
  if (!/^[a-zA-Z0-9-]+$/.test(fileName.trim())) {
    console.log("Invalid file name. Please try again.");
    return false;
  }
  if (names.some((e) => e.name === fileName)) {
    console.log(`This ${type} file already exists.`);
    return false;
  }
  return true;
};

/**
 * Generates a timestamp for file names.
 * @returns {string} - Formatted timestamp.
 */
const generateTimestamp = () =>
  new Date()
    .toISOString()
    .replace(/T/, "_")
    .replace(/\..+/, "")
    .replace(/[:.]/g, "-");

/**
 * Generates the initial content for a migration file.
 * @param {string} migrationName - The name of the migration.
 * @returns {string} - The migration template.
 */
const generateMigrationContent = (migrationName) => {
  const fnName =
    migrationName
      .split("-")
      .map((word, index) =>
        index !== 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join("") + "Migration";

  return `//import { askQuestion } from "../utils.js";

const ${fnName} = async () => {
  try {
    // Your migration logic here
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  } finally {
    if (process.env.NODE_ENV !== process.env.PROD_MODE) {
      process.exit(0);
    }
  }
};

// Run the migration
${fnName}();
`;
};

/**
 * Creates a file (migration or data).
 * @param {string} name - File name.
 * @param {string} type - "migration" or "data".
 * @param {Array} existingNames - List of existing file names.
 * @param {string} dir - Target directory.
 * @param {string} [content=""] - Initial file content.
 */
const createFile = async (name, type, existingNames, dir, content = "") => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Validate file name (loop until valid)
  while (!isValidFileName(name, existingNames, type)) {
    name = await askQuestion(
      `Please enter a valid ${type} file name (alphanumeric and dashes only): `
    );
  }

  // Generate file name with timestamp
  const filePath = path.join(
    __dirname,
    `${dir}/${generateTimestamp()}#${name}.${
      type === "migration" ? "js" : "json"
    }`
  );

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error("Error creating file:", err);
    } else {
      console.log(`File "${name}" created successfully at ${filePath}!`);
    }
    process.exit(0);
  });
};

/**
 * Creates a new migration file.
 * @param {string} fileName - Migration file name.
 */
const newMigration = async (fileName) => {
  await createFile(
    fileName,
    "migration",
    getListMigrationName(),
    "migrations-files",
    generateMigrationContent(fileName)
  );
};

/**
 * Creates a new data file.
 * @param {string} name - Data file name.
 */
const newFileData = async (name) => {
  await createFile(name, "data", getListDataName(), "data");
};

export { newFileData, newMigration };
